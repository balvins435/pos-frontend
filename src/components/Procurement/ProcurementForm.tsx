import { useEffect, useState } from "react";
import axios from "axios";

interface Supplier {
  id: string | number;
  name: string;
}

interface Item {
  id: string | number;
  name: string;
}

const ProcurementForm = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<{ supplier: string; item: string; quantity: number }>({
    supplier: "",
    item: "",
    quantity: 0,
  });

  useEffect(() => {
    axios.get<Supplier[]>("/api/suppliers/").then((res) => setSuppliers(res.data));
    axios.get<Item[]>("/api/items/").then((res) => setItems(res.data));
  }, []);

  const handleSubmit = () => {
    axios.post("/api/purchase-orders/", form).then(() => {
      alert("Order placed!");
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="p-4"
    >
      <h2 className="text-xl font-bold mb-4">Place Purchase Order</h2>

      {/* Supplier select */}
      <select
        onChange={(e) => setForm({ ...form, supplier: e.target.value })}
        className="mb-2 p-2 w-full border rounded"
      >
        <option value="">Select Supplier</option>
        {suppliers.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* Item select */}
      <select
        onChange={(e) => setForm({ ...form, item: e.target.value })}
        className="mb-2 p-2 w-full border rounded"
      >
        <option value="">Select Item</option>
        {items.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name}
          </option>
        ))}
      </select>

      {/* Quantity input */}
      <input
        type="number"
        placeholder="Quantity"
        onChange={(e) => setForm({ ...form, quantity: +e.target.value })}
        className="mb-2 p-2 w-full border rounded"
      />

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default ProcurementForm;
