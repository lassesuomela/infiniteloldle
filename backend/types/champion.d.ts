/**
 * Champion entity type definitions
 * Based on Prisma schema and database structure
 */

export interface Champion {
  id: number;
  name: string;
  championKey?: string;
  title?: string;
  resource?: string;
  skinCount?: number;
  position?: string;
  gender?: number;
  rangeType?: string;
  region?: string;
  released?: string;
  genre?: string;
  damageType?: string;
}

export interface ChampionNameAndKey {
  name: string;
  championKey: string;
}

export interface ChampionWithCurrent extends Champion {
  currentChampion: number;
}
