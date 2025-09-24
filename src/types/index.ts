// src/types/index.ts
// sales.ts
export interface SaleItem {
  item: number;              // FK ID of Item
  quantity: number;
  unit_price: number;
}

export interface Sale {
  id: number;
  user: number;              // FK ID of User
  customer: number | null;   // FK ID of Customer (nullable)
  date: string;              // auto_now_add DateTime
  total: number;             // computed in backend
  payment_method: string;    // e.g., "cash"
  items: SaleItem[];
}

// inventory.ts


export interface Category {
  id: number;
  name: string;
}

export interface Item {
  id: number;
  name: string;
  sku: string;
  category: Category;
  stock: number;
  low_stock_threshold: number;
  price: number;
}

export interface Supplier {
  id: number;
  name: string;
}

export interface PurchaseOrder {
  id: number;
  supplier: Supplier;
  item: Item;
  quantity: number;
  date_ordered: string;
  received: boolean;
}

// export interface Sale {
//   id: number;
//   user_id: number;
//   total_amount: number;
//   sale_date: string;
//   items: { item: Item; quantity: number }[];
// }