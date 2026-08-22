import type { GameEventMap } from '@domain/core';
import { testGameState } from '@domain/core/testGameState.js';
import { POINTS_PER_INTERACTION } from '@domain/progression';
import { createEventBus } from '@shared/events';
import { describe, expect, it, vi } from 'vitest';

import { createInteractionFeature } from './InteractionFeature.js';

describe('InteractionFeature.tick', () => {
  it('consumes overlapping interactables and updates progression', () => {
    const events = createEventBus<GameEventMap>();
    const interactionSpy = vi.fn();
    const progressionSpy = vi.fn();
    events.on('interaction.completed', interactionSpy);
    events.on('progression.updated', progressionSpy);

    const feature = createInteractionFeature({
      events,
      pointsPerInteraction: POINTS_PER_INTERACTION,
    });
    const state = testGameState();
    const first = state.interactables[0];
    if (!first) {
      throw new Error('testGameState must include at least one interactable');
    }

    const overlapping = {
      ...state,
      player: { ...state.player, position: first.position },
    };
    const next = feature.tick(overlapping);
    const consumed = next.interactables[0];
    if (!consumed) {
      throw new Error('expected interactable after tick');
    }

    expect(interactionSpy).toHaveBeenCalledOnce();
    expect(progressionSpy).toHaveBeenCalledWith({ score: 1 });
    expect(consumed.consumed).toBe(true);
    expect(next.progression.score).toBe(1);
  });

  it('is a no-op when no overlaps', () => {
    const events = createEventBus<GameEventMap>();
    const spy = vi.fn();
    events.on('interaction.completed', spy);

    const feature = createInteractionFeature({
      events,
      pointsPerInteraction: POINTS_PER_INTERACTION,
    });
    const state = testGameState();
    const next = feature.tick({
      ...state,
      player: { ...state.player, position: { x: -999, y: -999 } },
    });

    expect(spy).not.toHaveBeenCalled();
    expect(next.progression.score).toBe(0);
  });
});
