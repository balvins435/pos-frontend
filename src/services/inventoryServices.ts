// inventoryService.ts

import { apiService } from "./api";
import { InventoryItem, CreateItemDTO } from "../types/inventory";

class InventoryService {
  async getAllItems(): Promise<InventoryItem[]> {
    return apiService.get<InventoryItem[]>("/inventory");
  }

  async getItem(id: string): Promise<InventoryItem> {
    return apiService.get<InventoryItem>(`/inventory/${id}`);
  }

  async createItem(item: CreateItemDTO): Promise<InventoryItem> {
    return apiService.post<InventoryItem>("/inventory", item);
  }

  async updateItem(
    id: string,
    updates: Partial<InventoryItem>
  ): Promise<InventoryItem> {
    return apiService.patch<InventoryItem>(`/inventory/${id}`, updates);
  }

  async deleteItem(id: string): Promise<void> {
    return apiService.delete<void>(`/inventory/${id}`);
  }

  async updateStock(id: string, quantity: number): Promise<InventoryItem> {
    return apiService.patch<InventoryItem>(`/inventory/${id}/stock`, {
      quantity,
    });
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return apiService.get<InventoryItem[]>("/inventory/low-stock");
  }

  async searchItems(query: string): Promise<InventoryItem[]> {
    return apiService.get<InventoryItem[]>(
      `/inventory/search?q=${encodeURIComponent(query)}`
    );
  }

  async getCategories(): Promise<string[]> {
    return apiService.get<string[]>("/inventory/categories");
  }

  async getSuppliers(): Promise<string[]> {
    return apiService.get<string[]>("/inventory/suppliers");
  }
}

export const inventoryService = new InventoryService();
