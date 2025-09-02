"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { inventoryService } from "../../services/inventoryServices";

interface ItemCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // refresh item list after create
}

export default function ItemCreateModal({
  open,
  onClose,
  onSuccess,
}: ItemCreateModalProps) {
  const [form, setForm] = useState({
    name: "",

    quantity: "",
    low_stock_threshold: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  try {
    await inventoryService.createItem({
      name: form.name,
      quantity: parseInt(form.quantity),
      low_stock_threshold: parseInt(form.low_stock_threshold),
    });
    alert("Item created!");
    onSuccess();
    setForm({ name: "", quantity: "", low_stock_threshold: "" });
    onClose();
  } catch (error) {
    console.error("Error creating item:", error);
  }
};


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Item Name"
          />
          <Input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Stock Quantity"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
