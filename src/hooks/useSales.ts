// src/hooks/useSales.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { Sale } from "../types";  // Assuming Sale includes SaleItem

export const useSales = () => {
  const [data, setData] = useState<Sale[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Sale[]>("http://localhost:8000/api/sales/");
        setData(res.data);
      } catch (err: any) {
        setError(err.message || "Error fetching sales");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  return { data, loading, error };
};

export default useSales;
