/**
 * Item entity type definitions
 * Based on Prisma schema and database structure
 */

export interface Item {
  id?: number;
  itemId: number;
  name: string;
}

export interface OldItem {
  id: number;
  name: string;
  old_item_key?: string;
}
