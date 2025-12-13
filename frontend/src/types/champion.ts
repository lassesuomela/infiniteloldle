/**
 * Champion entity type definitions
 * Used in frontend components and state management
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

export interface ChampionGuess extends Champion {
  matchResult?: {
    name: boolean;
    title: boolean;
    resource: boolean;
    position: boolean;
    gender: boolean;
    rangeType: boolean;
    region: boolean;
    released: boolean;
    genre: boolean;
    damageType: boolean;
  };
}
