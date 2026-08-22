import defaultBalanceRaw from './default.json' with { type: 'json' };
import { BalanceSchema, type Balance } from '../schemas/balance.schema.js';

export const DEFAULT_BALANCE: Balance = BalanceSchema.parse(defaultBalanceRaw);
