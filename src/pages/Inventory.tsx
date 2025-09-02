import { useEffect, useState } from "react";
import { inventoryService } from "../services/inventoryServices";
import ItemModal from "../components/Inventory/ItemModal";
import ItemCreateModal from "../components/Inventory/ItemCreateModal";
import { Button } from "../components/ui/button";

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const fetchItems = async () => {
    const res = await inventoryService.getAllItems();
    setItems(res);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Inventory</h1>
        <Button onClick={() => setOpenCreate(true)}>+ Add Item</Button>
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>
              {item.name} - Stock: {item.stock}
            </span>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedItem(item);
                setOpenEdit(true);
              }}
            >
              Edit
            </Button>
          </li>
        ))}
      </ul>

      {selectedItem && (
        <ItemModal
          open={openEdit}
          item={selectedItem}
          onClose={() => setOpenEdit(false)}
          onSuccess={fetchItems}
        />
      )}

      <ItemCreateModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={fetchItems}
      />
    </div>
  );
}
