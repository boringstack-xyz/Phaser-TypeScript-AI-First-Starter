import { z } from 'zod';

export const SaveGamePayloadSchema = z.object({
  version: z.literal(1),
  score: z.number().int().nonnegative(),
  consumedIds: z.array(z.string()),
});

export type ISaveGamePayload = z.infer<typeof SaveGamePayloadSchema>;
