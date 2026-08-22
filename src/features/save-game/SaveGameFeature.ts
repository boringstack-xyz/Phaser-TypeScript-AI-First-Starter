import type { GameEventMap, GameState } from '@domain/core';
import { SAVE_GAME_KEY } from '@shared/constants';
import type { IEventBus } from '@shared/events';
import { err, ok, type Result } from '@shared/types';
import type { ISaveGamePort } from '@shared/types';

import type { ISaveGamePayload } from './SaveGame.contracts.js';
import { SaveGamePayloadSchema } from './SaveGame.schema.js';

export type SaveLoadError = 'missing' | 'corrupt';

export interface ISaveGameFeatureDeps {
  readonly events: IEventBus<GameEventMap>;
  readonly port: ISaveGamePort;
  readonly getState: () => GameState;
}

export interface ISaveGameFeature {
  dispose: () => void;
  load: () => Promise<Result<ISaveGamePayload, SaveLoadError>>;
}

export const createSaveGameFeature = (deps: ISaveGameFeatureDeps): ISaveGameFeature => {
  const unsub = deps.events.on('saveGame.requested', () => {
    const state = deps.getState();
    const payload: ISaveGamePayload = {
      version: 1,
      score: state.progression.score,
      consumedIds: Array.from(state.progression.consumedIds),
    };

    void deps.port
      .save(SAVE_GAME_KEY, JSON.stringify(payload))
      .then(() => {
        deps.events.emit('saveGame.completed', { ok: true });
      })
      .catch(() => {
        deps.events.emit('saveGame.completed', { ok: false });
      });
  });

  return {
    dispose: unsub,
    async load() {
      const raw = await deps.port.load(SAVE_GAME_KEY);
      if (raw === null) {
        return err('missing');
      }

      try {
        const parsed: unknown = JSON.parse(raw);
        const payload = SaveGamePayloadSchema.safeParse(parsed);
        if (!payload.success) {
          return err('corrupt');
        }

        deps.events.emit('saveGame.loaded', { score: payload.data.score });

        return ok(payload.data);
      } catch {
        return err('corrupt');
      }
    },
  };
};
