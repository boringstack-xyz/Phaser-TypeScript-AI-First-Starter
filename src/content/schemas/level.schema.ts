import { z } from 'zod';

const kebabId = z
  .string()
  .regex(/^[a-z0-9-]+$/)
  .min(1);

export const WallPlacementSchema = z.object({
  col: z.number().int().nonnegative(),
  row: z.number().int().nonnegative(),
  tileType: kebabId,
});

export const InteractablePlacementSchema = z.object({
  id: kebabId,
  x: z.number(),
  y: z.number(),
});

export const LevelSchema = z.object({
  id: kebabId,
  displayName: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  tileSize: z.number().int().positive(),
  playerStart: z.object({ x: z.number(), y: z.number() }),
  walls: z.array(WallPlacementSchema),
  interactables: z.array(InteractablePlacementSchema),
});

export type Level = z.infer<typeof LevelSchema>;
export type WallPlacement = z.infer<typeof WallPlacementSchema>;
export type InteractablePlacement = z.infer<typeof InteractablePlacementSchema>;
