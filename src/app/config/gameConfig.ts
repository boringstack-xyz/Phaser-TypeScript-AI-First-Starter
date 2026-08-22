import * as Phaser from 'phaser';

import { BootScene } from '../../runtime/phaser/scenes/BootScene/index.js';
import { WorldScene } from '../../runtime/phaser/scenes/WorldScene/index.js';

export const createGameConfig = (
  parent: string | HTMLElement,
  width: number,
  height: number,
): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent,
  width,
  height,
  backgroundColor: '#1e1e28',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false },
  },
  scene: [BootScene, WorldScene],
});
