import { useState, useEffect } from "react";
import { salesService } from "../services/salesServices";
import { useAuth } from "../context/AuthContext";

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

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await salesService.getAllSales();
      setSales(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch sales");
      console.error("Sales fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createSale = async (
    saleData: Omit<Sale, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newSale = await salesService.createSale(saleData);
      setSales((prev) => [newSale, ...prev]);
      setCart([]); // Clear cart after successful sale
      return newSale;
    } catch (err) {
      setError("Failed to create sale");
      throw err;
    }
  };

  const updateSale = async (id: string, updates: Partial<Sale>) => {
    try {
      const updatedSale = await salesService.updateSale(id, updates);
      setSales((prev) =>
        prev.map((sale) => (sale.id === id ? updatedSale : sale))
      );
      return updatedSale;
    } catch (err) {
      setError("Failed to update sale");
      throw err;
    }
  };

  const cancelSale = async (id: string) => {
    try {
      await salesService.cancelSale(id);
      setSales((prev) =>
        prev.map((sale) =>
          sale.id === id ? { ...sale, status: "cancelled" as const } : sale
        )
      );
    } catch (err) {
      setError("Failed to cancel sale");
      throw err;
    }
  };

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (item) => item.productId === product.productId
      );
      if (existingItem) {
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getTodaysSales = () => {
    const today = new Date().toDateString();
    return sales.filter(
      (sale) =>
        new Date(sale.createdAt).toDateString() === today &&
        sale.status === "completed"
    );
  };

  const getTodaysRevenue = () => {
    return getTodaysSales().reduce((total, sale) => total + sale.total, 0);
  };

  const getRecentSales = (limit: number = 10) => {
    return sales
      .filter((sale) => sale.status === "completed")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    cart,
    loading,
    error,
    fetchSales,
    createSale,
    updateSale,
    cancelSale,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getTodaysSales,
    getTodaysRevenue,
    getRecentSales,
  };
};

export default useAuth;
