import { useEffect, useState } from "react";
import axios from "axios";
import { InventoryItem } from "../../types/inventory";

const InventoryTable = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    axios
      .get<InventoryItem[]>("http://localhost:8000/api/items/")
      .then((res) => setItems(res.data));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">SKU</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.sku}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.sku}</td>
              <td className="px-4 py-2">
                {typeof item.category === "string"
                  ? item.category
                  : item.category?.name}
              </td>
              <td
                className={`px-4 py-2 ${
                  item.quantity <= item.low_stock_threshold
                    ? "text-red-500 font-semibold"
                    : ""
                }`}
              >
                {item.quantity}
              </td>
              <td className="px-4 py-2">{item.price}</td>
              <td className="px-4 py-2 space-x-2">
                <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Edit
                </button>
                <button className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                  Restock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
