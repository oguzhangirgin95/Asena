import { InjectionToken } from '@angular/core';

/**
 * Maps a transaction name (e.g. "money-transfer") to its base route path
 * (e.g. "payment/money-transfer").
 */
export type TransactionPathMap = Record<string, string>;

export const TRANSACTION_PATH_MAP = new InjectionToken<TransactionPathMap>(
  'TRANSACTION_PATH_MAP',
  {
    factory: () => ({})
  }
);
