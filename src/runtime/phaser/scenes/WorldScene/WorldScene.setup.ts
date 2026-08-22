import { lookupTileType } from '@content/definitions/tileTypes/index.js';
import type { GameEventMap, GameState } from '@domain/core';
import type { InteractableState } from '@domain/interaction';
import type { TileTypeLookup } from '@domain/wall';
import { createHudFeature, type IHudRenderer } from '@features/hud';
import { createInteractionFeature } from '@features/interaction';
import { createMovementFeature } from '@features/movement';
import { applySave, createSaveGameFeature } from '@features/save-game';
import { createWallCollisionFeature } from '@features/wall-collision';
import { createEventBus } from '@shared/events';
import type { ISaveGamePort } from '@shared/types';
import type * as Phaser from 'phaser';

import {
  createInteractableEntity,
  type IInteractableEntity,
} from '../../entities/InteractableEntity.js';
import { createPlayerEntity, type IPlayerEntity } from '../../entities/PlayerEntity.js';
import { createWallLayerEntity, type IWallLayerEntity } from '../../entities/WallLayerEntity.js';
import { createKeyboardInputPort, type IInputPort } from '../../input/keyboardInput.port.js';
import { configureArcadeWorld } from '../../physics/arcadePhysics.setup.js';

const tileTypes: TileTypeLookup = { get: lookupTileType };

export interface IWorldSceneDeps {
  readonly save: ISaveGamePort;
  readonly hud: IHudRenderer;
  readonly createState: () => GameState;
  readonly levelWidth: number;
  readonly levelHeight: number;
  readonly playerSpeedPxPerSec: number;
  readonly pointsPerInteraction: number;
}

export interface IWorldSceneRuntime {
  update: (deltaMs: number) => void;
  dispose: () => void;
}

interface SetupContext {
  readonly scene: Phaser.Scene;
  readonly deps: IWorldSceneDeps;
}

export const setupWorldScene = async (ctx: SetupContext): Promise<IWorldSceneRuntime> => {
  configureArcadeWorld(ctx.scene, ctx.deps.levelWidth, ctx.deps.levelHeight);

  const events = createEventBus<GameEventMap>();
  const bounds = {
    min: { x: 16, y: 16 },
    max: { x: ctx.deps.levelWidth - 16, y: ctx.deps.levelHeight - 16 },
  };

  let state: GameState = ctx.deps.createState();

  const input: IInputPort = createKeyboardInputPort(ctx.scene);
  const movement = createMovementFeature({
    events,
    bounds,
    speedPxPerSec: ctx.deps.playerSpeedPxPerSec,
  });
  const interaction = createInteractionFeature({
    events,
    pointsPerInteraction: ctx.deps.pointsPerInteraction,
  });
  const wallCollision = createWallCollisionFeature({ grid: () => state.grid, tileTypes });
  const hud = createHudFeature({ events, renderer: ctx.deps.hud });
  const save = createSaveGameFeature({
    events,
    port: ctx.deps.save,
    getState: () => state,
  });

  const wallLayer: IWallLayerEntity = createWallLayerEntity(ctx.scene, state.grid, tileTypes);
  const playerEntity: IPlayerEntity = createPlayerEntity(ctx.scene, state.player);
  const interactableEntities = new Map<string, IInteractableEntity>(
    state.interactables.map((i) => [i.id, createInteractableEntity(ctx.scene, i)]),
  );

  const keyboard = ctx.scene.input.keyboard;
  // Keyboard is optional (touch-only / headless). Movement already no-ops via the input port.
  const saveKey = keyboard?.addKey('S');
  const resetKey = keyboard?.addKey('R');
  saveKey?.on('down', () => events.emit('saveGame.requested', {}));
  resetKey?.on('down', () => {
    state = ctx.deps.createState();
    playerEntity.render(state.player);
    wallLayer.redraw(state.grid);

    for (const [id, entity] of interactableEntities) {
      const found = state.interactables.find((i: InteractableState) => i.id === id);

      if (found) {
        entity.render(found);
      }
    }

    events.emit('progression.updated', { score: 0 });
  });

  const loaded = await save.load();
  if (loaded.ok) {
    state = applySave(state, loaded.value.consumedIds, loaded.value.score);

    for (const i of state.interactables) {
      interactableEntities.get(i.id)?.render(i);
    }
  }

  return {
    update(deltaMs) {
      const intent = input.currentIntent();
      const previousPlayer = state.player;
      const afterMove = movement.tick(state, intent, deltaMs);
      const resolvedPlayer = wallCollision.resolveMove(previousPlayer, afterMove.player);
      state = { ...afterMove, player: resolvedPlayer };
      state = interaction.tick(state);

      playerEntity.render(state.player);

      for (const i of state.interactables) {
        interactableEntities.get(i.id)?.render(i);
      }
    },
    dispose() {
      hud.dispose();
      save.dispose();
      input.destroy();
      keyboard?.removeKey('S');
      keyboard?.removeKey('R');
      events.clear();
      wallLayer.destroy();
      playerEntity.destroy();
      for (const e of interactableEntities.values()) {
        e.destroy();
      }
    },
  };
};
