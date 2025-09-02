import { useState } from "react";
import { inventoryService } from "../../services/inventoryServices";

const ItemModal = ({ item, onClose }: any) => {
  const [form, setForm] = useState(item || { id: null, name: "", stock: 0 });

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Item name is required!");
      return;
    }
    if (form.stock < 0) {
      alert("Stock cannot be negative!");
      return;
    }

    try {
      await inventoryService.updateItem(form.id, form);
      alert("Item updated!");
      onClose();
    } catch (err) {
      alert("Failed to update item.");
      console.error(err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-4">Edit Item</h3>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-2 p-2 border rounded"
          placeholder="Item Name"
        />
        <input
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: +e.target.value })}
          className="w-full mb-2 p-2 border rounded"
          placeholder="Stock"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
