import type { Vec2 } from '@shared/types';

import { interactableId, playerId } from './ids.js';
import { createGrid, setTile, type GridState, type TileCoord } from '../grid/index.js';
import { createInteractable } from '../interaction/Interaction.model.js';
import type { InteractableState } from '../interaction/Interaction.types.js';
import { createPlayer } from '../player/Player.model.js';
import type { PlayerState } from '../player/Player.types.js';
import { createProgression } from '../progression/Progression.model.js';
import type { ProgressionState } from '../progression/Progression.types.js';

export interface GameState {
  readonly player: PlayerState;
  readonly interactables: readonly InteractableState[];
  readonly progression: ProgressionState;
  readonly grid: GridState;
}

export interface WallPlacement {
  readonly col: number;
  readonly row: number;
  readonly tileType: string;
}

export interface InteractablePlacement {
  readonly id: string;
  readonly x: number;
  readonly y: number;
}

export interface CreateGameStateInput {
  readonly cols: number;
  readonly rows: number;
  readonly tileSize: number;
  readonly playerStart: Vec2;
  readonly walls: readonly WallPlacement[];
  readonly interactables: readonly InteractablePlacement[];
}

export const createGameState = (input: CreateGameStateInput): GameState => {
  const gridBase = createGrid({
    cols: input.cols,
    rows: input.rows,
    tileSize: input.tileSize,
    origin: { x: 0, y: 0 },
  });
  const grid = input.walls.reduce(
    (g, w) => setTile(g, { col: w.col, row: w.row } satisfies TileCoord, w.tileType),
    gridBase,
  );

  return {
    player: createPlayer(playerId('p1'), input.playerStart),
    interactables: input.interactables.map((i) =>
      createInteractable(interactableId(i.id), i.x, i.y),
    ),
    progression: createProgression(),
    grid,
  };
};
