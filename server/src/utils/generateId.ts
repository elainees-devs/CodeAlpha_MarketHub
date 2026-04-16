// src/utils/generateIds.ts

import { randomUUID } from 'crypto';

/**
 * UUID for global unique identifiers e.g order IDs, user IDs, etc.
 */
export const generateUUID = (): string => randomUUID();

/**
 * Short readable ID (useful for order codes, refs)
 */
export const generateShortId = (length = 8): string => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
    .toUpperCase();
};