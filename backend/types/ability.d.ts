/**
 * Ability entity type definitions
 * Based on Prisma schema and database structure
 */

export type AbilityKey = 'P' | 'Q' | 'W' | 'E' | 'R';

export interface Ability {
  id: number;
  championId: number;
  name: string;
  key: AbilityKey;
}
