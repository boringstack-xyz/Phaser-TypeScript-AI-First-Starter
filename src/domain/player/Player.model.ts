import { vec2, type Vec2 } from '@shared/types';

import { PLAYER_START_POSITION } from './Player.constants.js';
import type { PlayerState } from './Player.types.js';
import { playerId, type PlayerId } from '../core/ids.js';

export const createPlayer = (
  id: PlayerId = playerId('p1'),
  position: Vec2 = vec2(PLAYER_START_POSITION.x, PLAYER_START_POSITION.y),
): PlayerState => ({
  id,
  position: vec2(position.x, position.y),
  velocity: vec2(0, 0),
});
