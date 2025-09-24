import { useState } from "react";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 🔹 Create a new cart (initialize with items or empty)
  const createCart = (items: CartItem[] = []) => {
    setCart(items);
  };

  // Add item to cart
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  // Remove item completely
  const removeFromCart = (productId: number) => {
  setCart((prev) => prev.filter((item) => item.productId !== productId));
};


  // Update quantity
  const updateCartItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => setCart([]);

  // Derived values
  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartItemCount = () =>
    cart.reduce((count, item) => count + item.quantity, 0);

  return {
    cart,
    createCart,       //  added
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    createSale: async (saleData: any) => {
    // Implement your sale creation logic here
    // For example, make an API call to your backend
    const response = await fetch('/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saleData),
    });
    if (!response.ok) throw new Error('Failed to create sale');
    return response.json();
  },
}; // close return object
}; // close useCart function
