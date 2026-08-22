import { EXAMPLE_LEVEL } from '@content/levels/index.js';
import { createGameState } from '@domain/core';
import { getTile } from '@domain/grid';
import { describe, expect, it } from 'vitest';

import { composeAppRuntime, levelToGameStateInput } from './composeRuntime.js';

describe('levelToGameStateInput', () => {
  it('maps the example level into the demo world', () => {
    const input = levelToGameStateInput(EXAMPLE_LEVEL);
    const state = createGameState(input);

    expect(state.grid.cols).toBe(30);
    expect(state.grid.rows).toBe(17);
    expect(state.player.position).toEqual({ x: 100, y: 100 });
    expect(state.interactables).toHaveLength(3);
    expect(getTile(state.grid, { col: 8, row: 6 })).toBe('brick');
    expect(getTile(state.grid, { col: 15, row: 3 })).toBe('steel');
  });
});

describe('composeAppRuntime', () => {
  it('builds a bound runtime from content + browser ports', () => {
    const app = composeAppRuntime();
    expect(app.level.id).toBe('example-level');
    expect(app.balance.playerSpeedPxPerSec).toBe(220);
    const state = app.createState();
    expect(state.interactables).toHaveLength(3);
  });
});
