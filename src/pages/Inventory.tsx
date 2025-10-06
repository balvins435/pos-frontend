import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import { Button } from '../components/Shared/Button';
import InventoryTable from '../components/Inventory/InventoryTable';
import ItemModal from '../components/Inventory/ItemModal';
import { InventoryItem } from '../types/inventory';
import { useInventory } from '../hooks/useInventory';

const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    getLowStockItems,
    getOutOfStockItems,
    getTotalValue
  } = useInventory();

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];
  const availableCategories = Array.from(new Set(items.map(item => item.category))).filter(cat => typeof cat === 'string') as string[];
  const statuses = ['all', 'in-stock', 'low-stock', 'out-of-stock'];

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddItem = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  const handleSaveItem = async (itemData: Partial<InventoryItem>) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id.toString(), itemData);
      } else {
        await addItem(itemData as Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>);
      }
      setShowItemModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const lowStockCount = getLowStockItems().length;
  const outOfStockCount = getOutOfStockItems().length;
  const totalValue = getTotalValue();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inventory Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your product inventory and stock levels
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{lowStockCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{outOfStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, SKU, or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={String(category)} value={String(category)}>
                  {category === 'all' ? 'All Categories' : String(category)}
                </option>
              ))}
            </select>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : 
                 status.split('-').map(word => 
                   word.charAt(0).toUpperCase() + word.slice(1)
                 ).join(' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryTable
        items={filteredItems}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
      />

      {/* Add/Edit Item Modal */}
      {showItemModal && (
        <ItemModal
          isOpen={showItemModal}
          onClose={() => {
            setShowItemModal(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
          item={editingItem}
          availableCategories={availableCategories}
        />
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Inventory;