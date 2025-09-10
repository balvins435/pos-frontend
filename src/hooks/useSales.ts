import { useEffect, useState } from "react";
import axios from "axios";

export interface SaleItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
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
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Sale[]>("/api/sales/");
      setSales(res.data);
    } catch (err: any) {
      setError(err.message || "Error fetching sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return { sales, loading, error, fetchSales };
};

export default useSales;
