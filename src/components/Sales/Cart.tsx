// Cart.tsx
import React from "react";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "../Shared/Button";
import { useSales } from "../../hooks/useAuth";

const Cart: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartItemQuantity,
    getCartTotal,
    getCartItemCount,
    clearCart,
  } = useSales();

  if (cart.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-4">
          <ShoppingCart className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cart
          </h3>
        </div>
        <div className="text-center py-8">
          <ShoppingCart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Add products to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ShoppingCart className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cart ({getCartItemCount()})
          </h3>
        </div>
        <Button
          onClick={clearCart}
          variant="ghost"
          size="sm"
          className="text-red-600 dark:text-red-400"
        >
          Clear
        </Button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {cart.map((item) => (
          <div
            key={item.productId}
            className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {item.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${item.price.toFixed(2)} each
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() =>
                  updateCartItemQuantity(item.productId, item.quantity - 1)
                }
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>

              <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-center">
                {item.quantity}
              </span>

              <Button
                onClick={() =>
                  updateCartItemQuantity(item.productId, item.quantity + 1)
                }
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={item.quantity >= item.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>

              <Button
                onClick={() => removeFromCart(item.productId)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 dark:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Total
          </span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            ${getCartTotal().toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Cart;
