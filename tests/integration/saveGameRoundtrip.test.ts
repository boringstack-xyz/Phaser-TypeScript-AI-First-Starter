/**
 * Integration test: end-to-end roundtrip of the save-game vertical slice.
 *
 * Plays a few ticks, overlaps an interactable to raise the score, requests a
 * save, reloads into a fresh event bus, and confirms the saved score comes
 * back out.
 *
 * Runs against fake ports — no Phaser, no jsdom-specific APIs.
 */

import type { GameEventMap, GameState } from '@domain/core';
import { testGameState } from '@domain/core/testGameState.js';
import { PLAYER_SPEED_PX_PER_SEC } from '@domain/player';
import { POINTS_PER_INTERACTION } from '@domain/progression';
import { createHudFeature, type IHudRenderer } from '@features/hud';
import { createInteractionFeature } from '@features/interaction';
import { createMovementFeature } from '@features/movement';
import { createSaveGameFeature } from '@features/save-game';
import { createEventBus } from '@shared/events';
import { createFakeSaveGamePort } from '@shared/testing';
import { describe, expect, it, vi } from 'vitest';

const bounds = { min: { x: 0, y: 0 }, max: { x: 960, y: 540 } };

const fakeHud = (): IHudRenderer & { readonly last: () => number } => {
  let last = 0;
  return {
    setScore(s) {
      last = s;
    },
    last: () => last,
  };
};

const tick = (
  state: GameState,
  intent: { dx: number; dy: number },
  deltaMs: number,
  events: ReturnType<typeof createEventBus<GameEventMap>>,
): GameState => {
  const movement = createMovementFeature({
    events,
    bounds,
    speedPxPerSec: PLAYER_SPEED_PX_PER_SEC,
  });
  const interaction = createInteractionFeature({
    events,
    pointsPerInteraction: POINTS_PER_INTERACTION,
  });
  return interaction.tick(movement.tick(state, intent, deltaMs));
};

describe('save-game roundtrip', () => {
  it('persists score across a save/load cycle', async () => {
    const port = createFakeSaveGamePort();

    {
      const events = createEventBus<GameEventMap>();
      const hud = fakeHud();
      createHudFeature({ events, renderer: hud });

      let state = testGameState();
      const save = createSaveGameFeature({
        events,
        port,
        getState: () => state,
      });

      const first = state.interactables[0];
      if (!first) {
        throw new Error('testGameState must include at least one interactable');
      }

      state = {
        ...state,
        player: { ...state.player, position: first.position },
      };
      state = tick(state, { dx: 0, dy: 0 }, 16, events);

      expect(hud.last()).toBe(1);
      expect(state.progression.score).toBe(1);

      const saveCompleted = vi.fn();
      events.on('saveGame.completed', saveCompleted);
      events.emit('saveGame.requested', {});
      await new Promise((r) => setTimeout(r, 0));
      expect(saveCompleted).toHaveBeenCalledWith({ ok: true });

      save.dispose();
    }

    {
      const events = createEventBus<GameEventMap>();
      const hud = fakeHud();
      createHudFeature({ events, renderer: hud });
      const save = createSaveGameFeature({
        events,
        port,
        getState: () => testGameState(),
      });

      const loaded = await save.load();
      expect(loaded.ok).toBe(true);
      if (loaded.ok) {
        expect(loaded.value.score).toBe(1);
      }
      expect(hud.last()).toBe(1);
    }
  });
});
