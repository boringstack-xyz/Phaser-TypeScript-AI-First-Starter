import { vec2, type Vec2 } from '@shared/types';

import { PLAYER_SPEED_PX_PER_SEC } from './Player.constants.js';
import type { PlayerState } from './Player.types.js';

export interface MoveIntent {
  readonly dx: number;
  readonly dy: number;
}

const normalizeIntent = (intent: MoveIntent): Vec2 => {
  const mag = Math.hypot(intent.dx, intent.dy);
  if (mag === 0) {
    return vec2(0, 0);
  }

  return vec2(intent.dx / mag, intent.dy / mag);
};

export const applyMoveIntent = (
  state: PlayerState,
  intent: MoveIntent,
  deltaMs: number,
  speedPxPerSec: number = PLAYER_SPEED_PX_PER_SEC,
): PlayerState => {
  const dir = normalizeIntent(intent);
  const step = (deltaMs / 1000) * speedPxPerSec;

  return {
    ...state,
    velocity: vec2(dir.x * speedPxPerSec, dir.y * speedPxPerSec),
    position: vec2(state.position.x + dir.x * step, state.position.y + dir.y * step),
  };
};
