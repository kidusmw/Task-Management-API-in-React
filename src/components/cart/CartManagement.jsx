import { ArrowLeft, ShoppingCart } from 'lucide-react';
import React from 'react';
import { useCart } from '../../contexts/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

const CartManagement = ({ onContinueShopping }) => {
  const { cartItems, cartCount, cartTotal, loading, error, clearCart } = useCart();

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
        Error loading cart: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart size={28} />
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-1">
            {cartCount === 0 ? 'Your cart is empty' : `${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your cart`}
          </p>
        </div>
        
        <div className="flex gap-3">
          {onContinueShopping && (
            <button
              onClick={onContinueShopping}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </button>
          )}
          
          {cartCount > 0 && (
            <button
              onClick={handleClearCart}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {cartCount === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ShoppingCart size={64} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Add some products to your cart to get started</p>
          {onContinueShopping && (
            <button
              onClick={onContinueShopping}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={16} />
              Start Shopping
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Cart Items</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <CartItem key={`${item.id}-${JSON.stringify(item.variations)}`} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartManagement;
