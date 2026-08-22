import { interactableId, type GameEventMap } from '@domain/core';
import { testGameState } from '@domain/core/testGameState.js';
import { recordInteraction } from '@domain/progression';
import { SAVE_GAME_KEY } from '@shared/constants';
import { createEventBus } from '@shared/events';
import { createFakeSaveGamePort } from '@shared/testing';
import { describe, expect, it, vi } from 'vitest';

import { createSaveGameFeature } from './SaveGameFeature.js';

describe('SaveGameFeature', () => {
  it('saves on saveGame.requested and emits saveGame.completed', async () => {
    const events = createEventBus<GameEventMap>();
    const port = createFakeSaveGamePort();
    const state = testGameState();

    const completed = vi.fn();
    events.on('saveGame.completed', completed);

    const feature = createSaveGameFeature({
      events,
      port,
      getState: () => state,
    });

    events.emit('saveGame.requested', {});
    await new Promise((r) => setTimeout(r, 0));

    expect(completed).toHaveBeenCalledWith({ ok: true });
    const raw = await port.load(SAVE_GAME_KEY);
    expect(raw).toBeTruthy();

    feature.dispose();
  });

  it('roundtrips: save, load, emit saveGame.loaded', async () => {
    const events = createEventBus<GameEventMap>();
    const port = createFakeSaveGamePort();

    let state = testGameState();
    state = {
      ...state,
      progression: recordInteraction(state.progression, {
        interactableId: interactableId('i1'),
      }),
    };

    const loaded = vi.fn();
    events.on('saveGame.loaded', loaded);

    const feature = createSaveGameFeature({
      events,
      port,
      getState: () => state,
    });

    events.emit('saveGame.requested', {});
    await new Promise((r) => setTimeout(r, 0));

    const payload = await feature.load();

    expect(payload.ok).toBe(true);
    if (payload.ok) {
      expect(payload.value.score).toBe(1);
    }
    expect(loaded).toHaveBeenCalledWith({ score: 1 });
  });

  it('load returns missing when nothing is stored', async () => {
    const events = createEventBus<GameEventMap>();
    const port = createFakeSaveGamePort();
    const feature = createSaveGameFeature({
      events,
      port,
      getState: () => testGameState(),
    });
    expect(await feature.load()).toEqual({ ok: false, error: 'missing' });
  });

  it('load returns corrupt when stored JSON is not a save payload', async () => {
    const events = createEventBus<GameEventMap>();
    const port = createFakeSaveGamePort();
    const feature = createSaveGameFeature({
      events,
      port,
      getState: () => testGameState(),
    });

    await port.save(SAVE_GAME_KEY, '{"nope":true}');

    expect(await feature.load()).toEqual({ ok: false, error: 'corrupt' });
  });
});
