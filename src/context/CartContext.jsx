import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const API_BASE = "http://localhost:4000/api";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const initCart = async () => {
      try {
        const res = await fetch(`${API_BASE}/cart/init`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        setCart(data.items || []);
      } catch (err) {
        console.error("Failed to init cart", err);
      }
    };

    initCart();
  }, []);

  const addItem = async (item) => {
    try {
      const res = await fetch(`${API_BASE}/cart/items`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItemId: item.id, qty: 1 }),
      });
      const data = await res.json();
      if (res.ok) setCart(data.items || []);
    } catch (err) {
      console.error("Failed to add item", err);
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/cart/items/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setCart(data.items || []);
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const decreaseQty = async (id) => {
    const existing = cart.find((item) => item.id === id);
    if (!existing) return;

    try {
      if (existing.qty <= 1) {
        await removeItem(id);
        return;
      }

      const res = await fetch(`${API_BASE}/cart/items/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty: existing.qty - 1 }),
      });
      const data = await res.json();
      if (res.ok) setCart(data.items || []);
    } catch (err) {
      console.error("Failed to decrease quantity", err);
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch(`${API_BASE}/cart`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setCart(data.items || []);
    } catch (err) {
      console.error("Failed to clear cart", err);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, decreaseQty, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
