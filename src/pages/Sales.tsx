import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/Shared/Button';
import ProductCard from '../components/Sales/ProductionCard';
import Cart from '../components/Sales/Cart';
import CheckoutPanel from '../components/Sales/CheckoutPanel';
import { useCart } from '../hooks/useCart';
import { useInventory } from '../hooks/useInventory';

const Sales: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCheckout, setShowCheckout] = useState(false);
  
  const { cart, addToCart, getCartTotal, getCartItemCount } = useCart();
  const { items: products, loading } = useInventory();

  const categories = ['all', 'electronics', 'clothing', 'home-garden', 'sports', 'books'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (typeof product.category === 'string' 
                             ? product.category.toLowerCase().replace(/\s+/g, '-') 
                             : String(product.category).toLowerCase().replace(/\s+/g, '-')) === selectedCategory;
    
    return matchesSearch && matchesCategory && product.quantity > 0;
  });

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      stock: product.quantity,
      quantity: 0
    });
  };

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
            Point of Sale
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage sales and process orders
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setShowCheckout(true)}
            className="relative"
            disabled={cart.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Checkout
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartItemCount()}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
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
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : 
                       category.split('-').map(word => 
                         word.charAt(0).toUpperCase() + word.slice(1)
                       ).join(' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: '/api/placeholder/200/200',
                  stock: product.quantity,
                  category: typeof product.category === 'string' ? product.category : String(product.category)
                }}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No products found</div>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <Cart />
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutPanel
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
};

export default Sales;