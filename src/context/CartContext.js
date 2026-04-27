"use client";
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Removed the old alert popup for the elegant Toast
  };

  const updateQuantity = (productId, amount) => {
    setCart((prev) => prev.reduce((acc, item) => {
      if (item.id !== productId) return [...acc, item];
      const newQty = item.quantity + amount;
      return newQty > 0 ? [...acc, { ...item, quantity: newQty }] : acc;
    }, []));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // High-end Shipping Logic: Free over RM200
  const shippingFee = cartTotal >= 200 || cartTotal === 0 ? 0 : 10;
  const grandTotal = cartTotal + shippingFee;

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartTotal,
      shippingFee, 
      grandTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);