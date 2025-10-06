import React, { useState, useEffect, ReactNode } from "react";
import { X, AlertCircle } from "lucide-react";
import { InventoryItem } from "../../types/inventory";

// =====================
// Type definitions
// =====================
interface Category {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  sku: string;
  category: number; // Always send category as an ID
  quantity: number;
  price: number;
  low_stock_threshold: number;
}

interface FormData {
  name: string;
  sku: string;
  category: string; // still string in the form, convert to number on submit
  quantity: string;
  price: string;
  low_stock_threshold: string;
}

interface FormErrors {
  [key: string]: string;
}

interface ApiResponse {
  [key: string]: any;
}

// =====================
// Inventory Service
// =====================
const inventoryService = {
  createItem: async (data: Omit<Item, "id">): Promise<ApiResponse> => {
    const response = await fetch("/api/items/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create item");
    return response.json();
  },

  updateItem: async (id: number, data: Omit<Item, "id">): Promise<ApiResponse> => {
    const response = await fetch(`/api/items/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update item");
    return response.json();
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await fetch("/api/categories/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  },
};

// =====================
// Modal Component
// =====================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses: Record<string, string> = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// =====================
// Button Component
// =====================
interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants: Record<string, string> = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:opacity-50",
    outline:
      "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500 disabled:opacity-50",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled ? "cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

// =====================
// ItemModal Component
// =====================
interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Partial<InventoryItem>) => Promise<void>;
  onSuccess?: () => void;
  item: InventoryItem | null;
  availableCategories: string[];
}

const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  item = null,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    name: "",
    sku: "",
    category: "",
    quantity: "0",
    price: "",
    low_stock_threshold: "5",
  });

  // Load categories
  useEffect(() => {
    if (isOpen) {
      inventoryService
        .getCategories()
        .then(setCategories)
        .catch(() =>
          setCategories([
            { id: 1, name: "Electronics" },
            { id: 2, name: "Clothing" },
            { id: 3, name: "Books" },
            { id: 4, name: "Sports" },
          ])
        );
    }
  }, [isOpen]);

  // Reset form when editing
  useEffect(() => {
    if (isOpen && item) {
      setFormData({
        name: item.name,
        sku: item.sku,
        category: item.category.toString(),
        quantity: item.quantity.toString(),
        price: item.price.toString(),
        low_stock_threshold: item.low_stock_threshold.toString(),
      });
    } else if (isOpen) {
      setFormData({
        name: "",
        sku: "",
        category: "",
        quantity: "0",
        price: "",
        low_stock_threshold: "5",
      });
    }
  }, [isOpen, item]);

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    setErrors({});

    try {
      const submitData: Omit<Item, "id"> = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        category: parseInt(formData.category, 10), // ✅ Always send category ID
        quantity: parseInt(formData.quantity, 10),
        price: parseFloat(formData.price),
        low_stock_threshold: parseInt(formData.low_stock_threshold, 10),
      };

      if (item) {
        await inventoryService.updateItem(Number(item.id), submitData);
      } else {
        await inventoryService.createItem(submitData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save item:", error);
      setErrors({ submit: "Failed to save item. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? "Edit Item" : "Create Item"}
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter product name"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SKU *
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => handleInputChange("sku", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter SKU"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Low Stock Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Low Stock Threshold *
            </label>
            <input
              type="number"
              value={formData.low_stock_threshold}
              onChange={(e) =>
                handleInputChange("low_stock_threshold", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {errors.submit && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{errors.submit}</span>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : item ? "Update Item" : "Create Item"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ItemModal;
