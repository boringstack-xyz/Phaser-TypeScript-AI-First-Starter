import type { GameState } from '@domain/core';

export const applySave = (
  state: GameState,
  consumedIds: readonly string[],
  score: number,
): GameState => {
  const consumed = new Set(consumedIds);

  return {
    ...state,
    progression: {
      score,
      consumedIds: consumed,
    },
    interactables: state.interactables.map((i) =>
      consumed.has(i.id) ? { ...i, consumed: true } : i,
    ),
  };
};
