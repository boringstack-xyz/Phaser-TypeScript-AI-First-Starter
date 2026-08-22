import type { GameState } from '@domain/core';
import { isRecord } from '@shared/guards';
import type { IRandomPort, ISaveGamePort, ITimePort } from '@shared/types';
import type * as Phaser from 'phaser';

export const APP_RUNTIME_KEY = 'app.runtime';

export interface IBoundAppRuntime {
  readonly save: ISaveGamePort;
  readonly time: ITimePort;
  readonly random: IRandomPort;
  readonly createState: () => GameState;
  readonly levelWidth: number;
  readonly levelHeight: number;
  readonly playerSpeedPxPerSec: number;
  readonly pointsPerInteraction: number;
}

const isPort = (value: unknown, methods: readonly string[]): boolean => {
  if (!isRecord(value)) {
    return false;
  }
  return methods.every((m) => typeof value[m] === 'function');
};

export const isBoundAppRuntime = (value: unknown): value is IBoundAppRuntime => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    isPort(value['save'], ['save', 'load']) &&
    isPort(value['time'], ['now']) &&
    isPort(value['random'], ['nextFloat', 'nextInt']) &&
    typeof value['createState'] === 'function' &&
    typeof value['levelWidth'] === 'number' &&
    typeof value['levelHeight'] === 'number' &&
    typeof value['playerSpeedPxPerSec'] === 'number' &&
    typeof value['pointsPerInteraction'] === 'number'
  );
};

export const bindAppRuntime = (game: Phaser.Game, runtime: IBoundAppRuntime): void => {
  game.registry.set(APP_RUNTIME_KEY, runtime);
};

export const readAppRuntime = (scene: Phaser.Scene): IBoundAppRuntime => {
  const value: unknown = scene.registry.get(APP_RUNTIME_KEY);
  if (!isBoundAppRuntime(value)) {
    throw new Error(
      'App runtime missing from Phaser registry. Wire composeAppRuntime() in bootstrap preBoot.',
    );
  }
  return value;
};
