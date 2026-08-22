import * as Phaser from 'phaser';

import { bindAppRuntime } from '../../runtime/appRuntime.js';
import { composeAppRuntime, toBoundAppRuntime } from '../composition/index.js';
import { createGameConfig } from '../config/gameConfig.js';

export const bootstrapGame = (parent: string | HTMLElement): Phaser.Game => {
  const bound = toBoundAppRuntime(composeAppRuntime());

  return new Phaser.Game({
    ...createGameConfig(parent, bound.levelWidth, bound.levelHeight),
    callbacks: {
      preBoot: (game) => {
        bindAppRuntime(game, bound);
      },
    },
  });
};
