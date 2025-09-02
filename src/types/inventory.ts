export type Category = {
  id: number;
  name: string;
};

export type CreateItemDTO = {
  name: string;
  quantity: number;
  sku?: string;
  category?: string | Category;
  price?: number;
  cost?: number;
  supplier?: string;
  location?: string;
  minStock?: number;
  maxStock?: number;
  reorderLevel?: number;
  low_stock_threshold?: number;
};

export interface InventoryItem {
  id: string;  // Keep string for DB/UUID flexibility
  name: string;
  sku: string;
  category: string | Category;
  quantity: number;
  price: number;
  cost: number;
  supplier: string;
  location: string;
  minStock: number;
  maxStock: number;
  reorderLevel?: number;
  low_stock_threshold: number;
  lastUpdated: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}
