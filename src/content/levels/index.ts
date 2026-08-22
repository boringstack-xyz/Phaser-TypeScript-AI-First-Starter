import exampleLevelRaw from './example-level.json' with { type: 'json' };
import { LevelSchema, type Level } from '../schemas/level.schema.js';

export const EXAMPLE_LEVEL: Level = LevelSchema.parse(exampleLevelRaw);
