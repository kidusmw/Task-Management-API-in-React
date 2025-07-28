import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart, formatPrice } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await updateCartItem(item.id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Remove this item from your cart?')) {
      setIsRemoving(true);
      try {
        await removeFromCart(item.id);
      } catch (error) {
        console.error('Error removing item:', error);
      } finally {
        setIsRemoving(false);
      }
    }
  };

  const getItemPrice = () => {
    return item.product?.discountPrice || item.product?.price || item.price || 0;
  };

  const getItemTotal = () => {
    return getItemPrice() * item.quantity;
  };

  return (
    <div className={`p-6 transition-opacity ${isRemoving ? 'opacity-50' : ''}`}>
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
          {item.product?.images && item.product.images.length > 0 ? (
            <img
              src={item.product.images[0].url}
              alt={item.product?.title || 'Product'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {item.product?.title || 'Product'}
              </h3>
              
              {/* Variations */}
              {item.variations && Object.keys(item.variations).length > 0 && (
                <div className="mt-1">
                  {Object.entries(item.variations).map(([key, value]) => (
                    <span key={key} className="text-sm text-gray-500 mr-3">
                      {key}: {value}
                    </span>
                  ))}
                </div>
              )}
              
              {/* SKU */}
              {item.product?.sku && (
                <p className="text-xs text-gray-500 mt-1">SKU: {item.product.sku}</p>
              )}
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="ml-4 p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Remove from cart"
            >
              {isRemoving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(getItemPrice())}
              </span>
              {item.product?.discountPrice && item.product?.price > item.product?.discountPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  {formatPrice(item.product.price)}
                </span>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1 || isUpdating}
                  className="p-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus size={14} />
                </button>
                
                <span className="px-3 py-1 text-sm font-medium min-w-12 text-center border-x border-gray-300">
                  {isUpdating ? '...' : item.quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating}
                  className="p-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(getItemTotal())}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>

          {/* Stock Warning */}
          {item.product?.stock && item.quantity > item.product.stock && (
            <div className="mt-2 text-sm text-red-600">
              Only {item.product.stock} items available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
