import { useEffect, useState } from "react";
import axios from "axios";

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

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Sale[]>("/sales/");
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
