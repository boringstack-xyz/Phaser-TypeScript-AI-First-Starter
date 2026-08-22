import type { Brand } from '@shared/types';

export type SceneKey = Brand<string, 'SceneKey'>;

export const asSceneKey = (value: string): SceneKey => value as SceneKey;
