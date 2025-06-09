import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shopping Cart ({items.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Your cart is empty</p>
                <p className="text-sm text-slate-400 mt-1">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 bg-slate-50 rounded-lg p-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-slate-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-600">${item.price}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 rounded"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 rounded"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded ml-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-slate-200 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold text-blue-600">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <div className="space-y-2">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium">
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}