import type { GameEventMap, GameState } from '@domain/core';
import { markConsumed, resolveOverlap } from '@domain/interaction';
import { recordInteraction } from '@domain/progression';
import type { IEventBus } from '@shared/events';

export interface IInteractionFeatureDeps {
  readonly events: IEventBus<GameEventMap>;
  readonly pointsPerInteraction: number;
}

export interface IInteractionFeature {
  tick: (state: GameState) => GameState;
}

export const createInteractionFeature = (deps: IInteractionFeatureDeps): IInteractionFeature => ({
  tick(state) {
    let progression = state.progression;
    let anyConsumed = false;

    const nextInteractables = state.interactables.map((i) => {
      const event = resolveOverlap(state.player, i);
      if (!event) {
        return i;
      }

      deps.events.emit('interaction.completed', event);
      progression = recordInteraction(progression, event, deps.pointsPerInteraction);
      anyConsumed = true;

      return markConsumed(i);
    });

    if (anyConsumed) {
      deps.events.emit('progression.updated', { score: progression.score });
    }

    return {
      ...state,
      interactables: nextInteractables,
      progression,
    };
  },
});
