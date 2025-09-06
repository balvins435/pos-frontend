import { useState, useEffect } from "react";
import { inventoryService } from "../services/inventoryServices";
import { InventoryItem } from "../types/inventory";

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAllItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch inventory items");
      console.error("Inventory fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add new item
  const addItem = async (
    item: Omit<InventoryItem, "id" | "lastUpdated" | "status">
  ) => {
    try {
      const newItem = await inventoryService.createItem(item);
      setItems((prev) => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError("Failed to add item");
      throw err;
    }
  };

  // Update existing item
  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const updatedItem = await inventoryService.updateItem(id, updates);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
      return updatedItem;
    } catch (err) {
      setError("Failed to update item");
      throw err;
    }
  };

  // Delete item
  const deleteItem = async (id: string) => {
    try {
      await inventoryService.deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError("Failed to delete item");
      throw err;
    }
  };

  // Update stock quantity
  const updateStock = async (id: string, quantity: number) => {
    try {
      const updatedItem = await inventoryService.updateStock(id, quantity);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
      return updatedItem;
    } catch (err) {
      setError("Failed to update stock");
      throw err;
    }
  };

  // Derived data helpers
  const getLowStockItems = () =>
    items.filter((item) => item.quantity <= item.minStock);

  const getOutOfStockItems = () => items.filter((item) => item.quantity === 0);

  const getTotalValue = () =>
    items.reduce((total, item) => total + item.quantity * item.cost, 0);

  // Auto-fetch on mount
  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    updateStock,
    getLowStockItems,
    getOutOfStockItems,
    getTotalValue,
  };
};
export default useInventory;
