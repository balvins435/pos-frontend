// ItemModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../Shared/Modal';
import { Button } from '../Shared/Button';
import { InventoryItem } from '../../types/inventory';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<InventoryItem>) => void;
  item?: InventoryItem | null;
}

const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  item
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    price: 0,
    cost: 0,
    supplier: '',
    location: '',
    minStock: 0,
    maxStock: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        sku: item.sku,
        category: typeof item.category === 'string' ? item.category : String(item.category),
        quantity: item.quantity,
        price: item.price,
        cost: item.cost,
        supplier: item.supplier,
        location: item.location,
        minStock: item.minStock,
        maxStock: item.maxStock
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: '',
        quantity: 0,
        price: 0,
        cost: 0,
        supplier: '',
        location: '',
        minStock: 0,
        maxStock: 0
      });
    }
    setErrors({});
  }, [item]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity must be positive';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.cost < 0) newErrors.cost = 'Cost cannot be negative';
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    if (formData.minStock < 0) newErrors.minStock = 'Minimum stock cannot be negative';
    if (formData.maxStock < formData.minStock) newErrors.maxStock = 'Maximum stock must be greater than minimum stock';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save item:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Item' : 'Add New Item'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium mb-2">SKU *</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.sku ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter SKU"
            />
            {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter category"
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium mb-2">Supplier *</label>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.supplier ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter supplier name"
            />
            {errors.supplier && <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.quantity ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              min="0"
            />
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter storage location"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2">Selling Price *</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium mb-2">Cost</label>
            <input
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleInputChange('cost', Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.cost ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
          </div>

          {/* Min Stock */}
          <div>
            <label className="block text-sm font-medium mb-2">Minimum Stock</label>
            <input
              type="number"
              value={formData.minStock}
              onChange={(e) => handleInputChange('minStock', Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.minStock ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              min="0"
            />
            {errors.minStock && <p className="text-red-500 text-xs mt-1">{errors.minStock}</p>}
          </div>

          {/* Max Stock */}
          <div>
            <label className="block text-sm font-medium mb-2">Maximum Stock</label>
            <input
              type="number"
              value={formData.maxStock}
              onChange={(e) => handleInputChange('maxStock', Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.maxStock ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              min="0"
            />
            {errors.maxStock && <p className="text-red-500 text-xs mt-1">{errors.maxStock}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ItemModal;
