import { useEffect, useState } from "react";
import axios from "axios";

// Define the type for your Purchase Order
interface PurchaseOrder {
  id: number;
  supplier: {
    id: number;
    name: string;
  };
  item: {
    id: number;
    name: string;
  };
  quantity: number;
  date_ordered: string; // or Date if your API returns ISO strings
  received: boolean;
}

const PurchaseOrders = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);

  useEffect(() => {
    axios.get<PurchaseOrder[]>("/api/purchase-orders/").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Purchase Orders</h2>
      <table className="w-full table-auto bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr>
            <th>Supplier</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Date Ordered</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.supplier.name}</td>
              <td>{order.item.name}</td>
              <td>{order.quantity}</td>
              <td>{order.date_ordered}</td>
              <td>{order.received ? "Received" : "Pending"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrders;
