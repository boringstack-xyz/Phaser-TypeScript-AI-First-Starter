import { POINTS_PER_INTERACTION } from './Progression.constants.js';
import type { ProgressionState } from './Progression.types.js';
import type { InteractionEvent } from '../interaction/Interaction.types.js';

export const recordInteraction = (
  state: ProgressionState,
  event: InteractionEvent,
  pointsPerInteraction: number = POINTS_PER_INTERACTION,
): ProgressionState => {
  if (state.consumedIds.has(event.interactableId)) {
    return state;
  }

  const consumedIds = new Set(state.consumedIds);
  consumedIds.add(event.interactableId);

  return {
    score: state.score + pointsPerInteraction,
    consumedIds,
  };
};
