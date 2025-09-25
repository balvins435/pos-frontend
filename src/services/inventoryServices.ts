// inventoryService.ts

import { apiService } from "./api";
import { InventoryItem, CreateItemDTO } from "../types/inventory";

class InventoryService {
  async getAllItems(): Promise<InventoryItem[]> {
    return apiService.get<InventoryItem[]>("/items/");
  }

  async getItem(id: string): Promise<InventoryItem> {
    return apiService.get<InventoryItem>(`/items/${id}`);
  }

  async createItem(item: CreateItemDTO): Promise<InventoryItem> {
    return apiService.post<InventoryItem>("/items/", item);
  }

  async updateItem(
    id: string,
    updates: Partial<InventoryItem>
  ): Promise<InventoryItem> {
    return apiService.patch<InventoryItem>(`/items/${id}`, updates);
  }

  async deleteItem(id: string): Promise<void> {
    return apiService.delete<void>(`/items/${id}`);
  }

  async updateStock(id: string, quantity: number): Promise<InventoryItem> {
    return apiService.patch<InventoryItem>(`/items/${id}/stock`, {
      quantity,
    });
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return apiService.get<InventoryItem[]>("/items/low-stock");
  }

  async searchItems(query: string): Promise<InventoryItem[]> {
    return apiService.get<InventoryItem[]>(
      `/items/search?q=${encodeURIComponent(query)}`
    );
  }

  async getCategories(): Promise<string[]> {
    return apiService.get<string[]>("/categories/");
  }

  async getSuppliers(): Promise<string[]> {
    return apiService.get<string[]>("/suppliers/");
  }
}

export const inventoryService = new InventoryService();
