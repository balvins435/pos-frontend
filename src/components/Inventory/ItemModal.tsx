import React, { useState, useEffect, ReactNode } from 'react';
import { X, Package, AlertCircle } from 'lucide-react';
import { InventoryItem } from '../../types/inventory';
 

// Type definitions
interface Category {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  sku: string;
  category: number | Category; // Can be ID or full object
  quantity: number;
  price: number;
  low_stock_threshold: number;
}

interface FormData {
  name: string;
  sku: string;
  category: string;
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

// Type guard function
const isInventoryItem = (item: any): item is InventoryItem => {
  return item && typeof item.id === 'string';
};

// Service aligned with your Django models
const inventoryService = {
  createItem: async (data: Omit<Item, 'id'>): Promise<ApiResponse> => {
    const response = await fetch('/api/inventory/items/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create item');
    return response.json();
  },
  
  updateItem: async (id: number, data: Omit<Item, 'id'>): Promise<ApiResponse> => {
    const response = await fetch(`/api/inventory/items/${id}/`, {
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update item');
    return response.json();
  },
  
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch('/api/inventory/categories/');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }
};

// Modal component props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Button component props
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  type = 'button', 
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants: Record<string, string> = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:opacity-50',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 disabled:opacity-50',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500 disabled:opacity-50',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500 disabled:opacity-50'
  };
  
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm', 
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// ItemModal component props
interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSave?: (itemData: Partial<InventoryItem>) => Promise<void>;
  item?: InventoryItem | Item | null;
}

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSuccess, onSave, item = null }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Form data matching your Django Item model exactly
  const [formData, setFormData] = useState<FormData>({
    name: '',
    sku: '',
    category: '', // Foreign key to Category
    quantity: '',
    price: '',
    low_stock_threshold: '5' // Default value as per your model
  });

  // Load categories on mount
  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  // Reset form when modal opens/closes or item changes
  useEffect(() => {
    if (isOpen) {
      if (item) {
        // Editing existing item
        const categoryValue = isInventoryItem(item) ? item.category : 
                             (typeof item.category === 'number' ? item.category : item.category?.id || '');
        
        setFormData({
          name: item.name || '',
          sku: item.sku || '',
          category: categoryValue.toString(),
          quantity: item.quantity?.toString() || '0',
          price: item.price?.toString() || '',
          low_stock_threshold: item.low_stock_threshold?.toString() || '5'
        });
      } else {
        // Creating new item
        setFormData({
          name: '',
          sku: '',
          category: '',
          quantity: '0',
          price: '',
          low_stock_threshold: '5'
        });
      }
      setErrors({});
    }
  }, [isOpen, item]);

  const loadCategories = async (): Promise<void> => {
    try {
      const categoryData = await inventoryService.getCategories();
      setCategories(categoryData);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setErrors({ general: 'Failed to load categories' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate based on Django model constraints
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required (max 200 characters)';
    } else if (formData.name.length > 200) {
      newErrors.name = 'Name must be 200 characters or less';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required (max 100 characters)';
    } else if (formData.sku.length > 100) {
      newErrors.sku = 'SKU must be 100 characters or less';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      newErrors.quantity = 'Quantity must be a positive integer';
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      newErrors.price = 'Price must be a positive decimal (max 10 digits, 2 decimal places)';
    }

    const threshold = parseInt(formData.low_stock_threshold);
    if (isNaN(threshold) || threshold < 0) {
      newErrors.low_stock_threshold = 'Low stock threshold must be a positive integer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (onSave) {
        // When called from Inventory page, use onSave callback
        const submitData: Partial<InventoryItem> = {
          name: formData.name.trim(),
          sku: formData.sku.trim(),
          category: formData.category, // category is string in InventoryItem
          quantity: parseInt(formData.quantity),
          price: parseFloat(formData.price),
          low_stock_threshold: parseInt(formData.low_stock_threshold)
        };

        if (item && isInventoryItem(item)) {
          submitData.id = item.id; // Include ID for updates
        }

        await onSave(submitData);
      } else if (onSuccess) {
        // Original API-based flow
        const submitData: Omit<Item, 'id'> = {
          name: formData.name.trim(),
          sku: formData.sku.trim(),
          category: parseInt(formData.category), // Foreign key ID
          quantity: parseInt(formData.quantity),
          price: parseFloat(formData.price),
          low_stock_threshold: parseInt(formData.low_stock_threshold)
        };

        if (item && !isInventoryItem(item)) {
          await inventoryService.updateItem(item.id, submitData);
        } else {
          await inventoryService.createItem(submitData);
        }

        onSuccess(); // Refresh the item list
      }

      onClose();
    } catch (error) {
      console.error('Failed to save item:', error);
      setErrors({ submit: 'Failed to save item. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Item' : 'Create New Item'}
      size="lg"
    >
      <div className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name - CharField(max_length=200) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              maxLength={200}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.name.length}/200 characters
            </p>
          </div>

          {/* SKU - CharField(max_length=100, unique=True) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SKU *
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              maxLength={100}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.sku 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm`}
              placeholder="Enter unique SKU"
            />
            {errors.sku && (
              <p className="text-red-500 text-xs mt-1">{errors.sku}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Must be unique • {formData.sku.length}/100 characters
            </p>
          </div>

          {/* Category - ForeignKey(Category, on_delete=models.CASCADE) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.category 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* Quantity - PositiveIntegerField(default=0) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.quantity 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="0"
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>

          {/* Price - DecimalField(max_digits=10, decimal_places=2) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="99999999.99" // Based on max_digits=10, decimal_places=2
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.price 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          {/* Low Stock Threshold - PositiveIntegerField(default=5) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Low Stock Threshold *
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.low_stock_threshold}
              onChange={(e) => handleInputChange('low_stock_threshold', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.low_stock_threshold 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="5"
            />
            {errors.low_stock_threshold && (
              <p className="text-red-500 text-xs mt-1">{errors.low_stock_threshold}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Alert when stock falls below this level
            </p>
          </div>
        </div>

        {errors.submit && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{errors.submit}</span>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ItemModal;