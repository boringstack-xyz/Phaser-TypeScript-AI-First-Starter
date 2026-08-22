import { DEFAULT_BALANCE } from '@content/balance/index.js';
import { EXAMPLE_LEVEL } from '@content/levels/index.js';
import type { Balance } from '@content/schemas/balance.schema.js';
import type { Level } from '@content/schemas/level.schema.js';
import { createGameState, type CreateGameStateInput, type GameState } from '@domain/core';
import {
  createBrowserRandomPort,
  createBrowserTimePort,
  createLocalStorageSavePort,
} from '@runtime/adapters/index.js';
import type { IBoundAppRuntime } from '@runtime/appRuntime';
import type { IRandomPort, ISaveGamePort, ITimePort } from '@shared/types';

export interface IComposedPorts {
  readonly time: ITimePort;
  readonly random: IRandomPort;
  readonly save: ISaveGamePort;
}

export interface IAppRuntime {
  readonly ports: IComposedPorts;
  readonly level: Level;
  readonly balance: Balance;
  readonly createState: () => GameState;
}

/**
 * Wires concrete adapters + validated content into the process-wide runtime.
 * This is the only place browser ports are constructed.
 */
export const composePorts = (): IComposedPorts => ({
  time: createBrowserTimePort(),
  random: createBrowserRandomPort(),
  save: createLocalStorageSavePort(),
});

const gridExtent = (span: number, tileSize: number, axis: 'width' | 'height'): number => {
  if (tileSize <= 0 || span % tileSize !== 0) {
    throw new Error(
      `Level ${axis} (${span}) must be divisible by tileSize (${tileSize}); got remainder ${span % tileSize}.`,
    );
  }

  return span / tileSize;
};

export const levelToGameStateInput = (level: Level): CreateGameStateInput => ({
  cols: gridExtent(level.width, level.tileSize, 'width'),
  rows: gridExtent(level.height, level.tileSize, 'height'),
  tileSize: level.tileSize,
  playerStart: level.playerStart,
  walls: level.walls.map((w) => ({
    col: w.col,
    row: w.row,
    tileType: w.tileType,
  })),
  interactables: level.interactables.map((i) => ({
    id: i.id,
    x: i.x,
    y: i.y,
  })),
});

export const composeAppRuntime = (): IAppRuntime => {
  const level = EXAMPLE_LEVEL;
  const balance = DEFAULT_BALANCE;
  return {
    ports: composePorts(),
    level,
    balance,
    createState: () => createGameState(levelToGameStateInput(level)),
  };
};

export const toBoundAppRuntime = (app: IAppRuntime): IBoundAppRuntime => ({
  save: app.ports.save,
  time: app.ports.time,
  random: app.ports.random,
  createState: app.createState,
  levelWidth: app.level.width,
  levelHeight: app.level.height,
  playerSpeedPxPerSec: app.balance.playerSpeedPxPerSec,
  pointsPerInteraction: app.balance.pointsPerInteraction,
});
