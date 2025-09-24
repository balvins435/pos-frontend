// CheckoutPanel.tsx
import React, { useState } from "react";
import { CreditCard, Banknote, Smartphone, Building, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "../Shared/Button";
import { Modal } from "../Shared/Modal";

import { useCart } from "../../hooks/useCart";

interface CheckoutPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutPanel: React.FC<CheckoutPanelProps> = ({ isOpen, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "bank-transfer" | "mobile-money">("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);

  const { cart, getCartTotal, createSale, clearCart, updateCartItemQuantity, removeFromCart } = useCart();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal - discount + tax;

  const paymentMethods = [
    { id: "cash", name: "Cash", icon: Banknote },
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "bank-transfer", name: "Bank Transfer", icon: Building },
    { id: "mobile-money", name: "Mobile Money", icon: Smartphone },
  ];

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const saleData = {
        customerId: "guest",
        customerName: customerName || "Walk-in Customer",
        customerEmail: customerEmail || null,
        items: cart.map((item) => ({
          id: item.productId,
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        subtotal,
        tax,
        discount,
        total,
        paymentMethod,
        status: "completed" as const,
      };

      await createSale(saleData);
      clearCart();
      onClose();
      alert("Sale completed successfully!");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Checkout" size="lg">
      <div className="space-y-6">
        {/* Customer Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Customer Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Customer Name (Optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="email"
              placeholder="Email (Optional)"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Order Summary</h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between text-sm border-b border-gray-200 dark:border-gray-600 pb-2"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500 dark:text-gray-400">Ksh {item.price.toFixed(2)} each</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                    className="p-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                    className="p-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-medium">Ksh {(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Totals */}
            <div className="pt-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>Ksh {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>Ksh {tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-Ksh {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200 dark:border-gray-600">
                <span>Total</span>
                <span>Ksh {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Discount */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Discount</h4>
          <input
            type="number"
            placeholder="0.00"
            value={discount || ""}
            onChange={(e) => setDiscount(Number(e.target.value) || 0)}
            min="0"
            max={subtotal}
            step="0.01"
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Payment Method */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Payment Method</h4>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`flex items-center justify-center gap-2 p-3 border rounded-lg text-sm font-medium transition-colors ${
                    paymentMethod === method.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {method.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Checkout Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <Button
            onClick={handleCheckout}
            loading={processing}
            disabled={processing || cart.length === 0}
            variant="primary"
            size="lg"
            className="w-full"
          >
            {processing ? "Processing..." : `Confirm & Pay Ksh ${total.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CheckoutPanel;
