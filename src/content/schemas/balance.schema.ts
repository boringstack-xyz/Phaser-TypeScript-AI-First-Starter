import { z } from 'zod';

export const BalanceSchema = z.object({
  pointsPerInteraction: z.number().int().nonnegative(),
  playerSpeedPxPerSec: z.number().positive(),
});

export type Balance = z.infer<typeof BalanceSchema>;
