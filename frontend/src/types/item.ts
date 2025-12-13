/**
 * Item entity type definitions
 * Used in frontend components and state management
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

export interface ItemOption {
  value: string;
  label: string;
}
