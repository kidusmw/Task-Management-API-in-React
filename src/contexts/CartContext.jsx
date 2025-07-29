import React, { createContext, useContext, useEffect, useState } from 'react';
import { cartApi } from '../services/cartApi';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart on component mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const cartData = await cartApi.getCart();
      console.log('Cart data loaded:', cartData);
      setCartItems(cartData.items || []);
      setCartCount(cartData.total_items || 0);
      setCartTotal(cartData.total_amount || 0);
    } catch (err) {
      setError(err.message);
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, selectedVariations = {}) => {
    setError(null);
    try {
      const result = await cartApi.addToCart(productId, quantity, selectedVariations);
      await loadCart(); // Refresh cart after adding
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    setError(null);
    try {
      await cartApi.updateCartItem(cartItemId, quantity);
      await loadCart(); // Refresh cart after updating
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeFromCart = async (cartItemId) => {
    setError(null);
    try {
      await cartApi.removeFromCart(cartItemId);
      await loadCart(); // Refresh cart after removing
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const clearCart = async () => {
    setError(null);
    try {
      await cartApi.clearCart();
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getItemCount = (productId, variations = {}) => {
    const item = cartItems.find(item => 
      item.product_id === productId && 
      JSON.stringify(item.variations || {}) === JSON.stringify(variations)
    );
    return item ? item.quantity : 0;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    getItemCount,
    formatPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
