import { testGameState } from '@domain/core/testGameState.js';
import { describe, expect, it } from 'vitest';

import { applySave } from './applySave.js';

describe('applySave', () => {
  it('marks matching interactables consumed using the id set', () => {
    const state = testGameState();
    const first = state.interactables[0];
    if (!first) {
      throw new Error('expected an interactable');
    }

    const next = applySave(state, [first.id], 3);

    expect(next.progression.score).toBe(3);
    expect(next.progression.consumedIds.has(first.id)).toBe(true);
    expect(next.interactables[0]?.consumed).toBe(true);
    expect(next.interactables[1]?.consumed).toBe(false);
  });
});
