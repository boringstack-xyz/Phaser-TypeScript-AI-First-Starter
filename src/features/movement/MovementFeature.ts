import type { GameEventMap, GameState } from '@domain/core';
import { clampToBounds, type Bounds } from '@domain/movement';
import { applyMoveIntent, type MoveIntent } from '@domain/player';
import type { IEventBus } from '@shared/events';

export interface IMovementFeatureDeps {
  readonly events: IEventBus<GameEventMap>;
  readonly bounds: Bounds;
  readonly speedPxPerSec: number;
}

export interface IMovementFeature {
  tick: (state: GameState, intent: MoveIntent, deltaMs: number) => GameState;
}

export const createMovementFeature = (deps: IMovementFeatureDeps): IMovementFeature => ({
  tick(state, intent, deltaMs) {
    const moved = applyMoveIntent(state.player, intent, deltaMs, deps.speedPxPerSec);
    const clamped = {
      ...moved,
      position: clampToBounds(moved.position, deps.bounds),
    };

    if (
      clamped.position.x !== state.player.position.x ||
      clamped.position.y !== state.player.position.y
    ) {
      deps.events.emit('player.moved', { position: clamped.position });
    }

    return { ...state, player: clamped };
  },
});
