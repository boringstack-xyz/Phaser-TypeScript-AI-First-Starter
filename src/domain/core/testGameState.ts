import { createGameState, type CreateGameStateInput, type GameState } from './GameState.js';

/** Empty-ish world for unit tests. Demo data lives in `src/content/levels`. */
export const testGameState = (overrides: Partial<CreateGameStateInput> = {}): GameState =>
  createGameState({
    cols: 30,
    rows: 17,
    tileSize: 32,
    playerStart: { x: 100, y: 100 },
    walls: [],
    interactables: [
      { id: 'i1', x: 200, y: 100 },
      { id: 'i2', x: 600, y: 420 },
      { id: 'i3', x: 120, y: 400 },
    ],
    ...overrides,
  });
