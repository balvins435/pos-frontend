// ProductCard.tsx
import React from "react";
import { Plus, Package } from "lucide-react";
import { Button } from "../Shared/Button";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <Package className="h-16 w-16 text-gray-400" />
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {product.category}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ${product.price.toFixed(2)}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              product.stock > 10
                ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                : product.stock > 0
                ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
                : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        <Button
          onClick={onAddToCart}
          disabled={product.stock === 0}
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
