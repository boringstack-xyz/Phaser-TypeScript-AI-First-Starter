import { getTile } from '@domain/grid';
import { describe, expect, it } from 'vitest';

import { createGameState, type CreateGameStateInput } from './GameState.js';

const input = (overrides: Partial<CreateGameStateInput> = {}): CreateGameStateInput => ({
  cols: 8,
  rows: 6,
  tileSize: 32,
  playerStart: { x: 16, y: 16 },
  walls: [],
  interactables: [],
  ...overrides,
});

describe('createGameState', () => {
  it('places the player at playerStart', () => {
    const state = createGameState(input({ playerStart: { x: 40, y: 80 } }));
    expect(state.player.position).toEqual({ x: 40, y: 80 });
  });

  it('builds the grid from cols/rows/tileSize and wall placements', () => {
    const state = createGameState(
      input({
        walls: [
          { col: 2, row: 1, tileType: 'brick' },
          { col: 3, row: 1, tileType: 'steel' },
        ],
      }),
    );

    expect(state.grid.cols).toBe(8);
    expect(state.grid.rows).toBe(6);
    expect(state.grid.tileSize).toBe(32);
    expect(getTile(state.grid, { col: 2, row: 1 })).toBe('brick');
    expect(getTile(state.grid, { col: 3, row: 1 })).toBe('steel');
    expect(getTile(state.grid, { col: 0, row: 0 })).toBe('empty');
  });

  it('creates interactables from placements', () => {
    const state = createGameState(
      input({
        interactables: [
          { id: 'coin-a', x: 200, y: 100 },
          { id: 'coin-b', x: 400, y: 120 },
        ],
      }),
    );

    expect(state.interactables).toHaveLength(2);
    expect(state.interactables[0]?.id).toBe('coin-a');
    expect(state.interactables[0]?.position).toEqual({ x: 200, y: 100 });
    expect(state.interactables[0]?.consumed).toBe(false);
    expect(state.interactables[1]?.id).toBe('coin-b');
  });

  it('starts progression empty', () => {
    const state = createGameState(input());
    expect(state.progression.score).toBe(0);
    expect(state.progression.consumedIds.size).toBe(0);
  });
});
