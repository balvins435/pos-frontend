// src/types/index.ts
export interface SaleItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "bank-transfer" | "mobile-money";
  status: "pending" | "completed" | "cancelled" | "refunded";
  createdAt: string;
  updatedAt: string;
}


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