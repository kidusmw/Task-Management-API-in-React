import React, { useState } from 'react';
import { CreditCard, Truck, Shield } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const CartSummary = () => {
  const { cartItems, cartTotal, formatPrice } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Calculate totals
  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const discount = promoApplied ? subtotal * 0.1 : 0; // 10% discount if promo applied
  const finalTotal = subtotal + shipping + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }
  };

  const handleCheckout = () => {
    // This would integrate with a payment processor
    alert('Checkout functionality would be implemented here with payment processing');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 sticky top-6">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

        {/* Order Items Summary */}
        <div className="space-y-3 mb-6">
          {cartItems.map((item) => (
            <div key={`${item.id}-${JSON.stringify(item.variations)}`} className="flex justify-between text-sm">
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 truncate">
                  {item.product?.title || 'Product'} × {item.quantity}
                </p>
                {item.variations && Object.keys(item.variations).length > 0 && (
                  <p className="text-gray-500 text-xs truncate">
                    {Object.entries(item.variations).map(([key, value]) => `${key}: ${value}`).join(', ')}
                  </p>
                )}
              </div>
              <span className="text-gray-900 ml-2">
                {formatPrice((item.product?.discountPrice || item.product?.price || 0) * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Promo Code */}
        <div className="mb-6">
          <label htmlFor="promo" className="block text-sm font-medium text-gray-700 mb-2">
            Promo Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="promo"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code"
              disabled={promoApplied}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              onClick={handleApplyPromo}
              disabled={promoApplied || !promoCode}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
          {promoApplied && (
            <p className="text-green-600 text-sm mt-1">Promo code applied! 10% off</p>
          )}
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">{formatPrice(tax)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Discount</span>
              <span className="text-green-600">-{formatPrice(discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{formatPrice(finalTotal)}</span>
          </div>
        </div>

        {/* Shipping Info */}
        {shipping > 0 && (
          <div className="mb-6 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <Truck size={16} />
              <span>Add {formatPrice(50 - subtotal)} more for free shipping</span>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <CreditCard size={20} />
          Proceed to Checkout
        </button>

        {/* Security Info */}
        <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-sm">
          <Shield size={16} />
          <span>Secure checkout with SSL encryption</span>
        </div>

        {/* Additional Info */}
        <div className="mt-6 space-y-2 text-xs text-gray-500">
          <p>• Free returns within 30 days</p>
          <p>• 2-year warranty on all products</p>
          <p>• Customer support: 24/7</p>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
