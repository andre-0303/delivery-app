import { createContext, useCallback, useContext, useState } from 'react';
import type { CartItem, Produto } from '../types';

interface CartCtx {
  items: CartItem[];
  addItem: (produto: Produto, qty?: number) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  getQty: (id: number) => number;
}

const CartContext = createContext<CartCtx | null>(null);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function persist(items: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  const addItem = useCallback((produto: Produto, qty = 1) => {
    setItems(prev => {
      const exists = prev.find(i => i.produto.id === produto.id);
      const next = exists
        ? prev.map(i => i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + qty } : i)
        : [...prev, { produto, quantidade: qty }];
      persist(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems(prev => {
      const next = prev.filter(i => i.produto.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    setItems(prev => {
      const next = qty <= 0
        ? prev.filter(i => i.produto.id !== id)
        : prev.map(i => i.produto.id === id ? { ...i, quantidade: qty } : i);
      persist(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('cart');
  }, []);

  const total = items.reduce((s, i) => s + parseFloat(i.produto.preco) * i.quantidade, 0);
  const count = items.reduce((s, i) => s + i.quantidade, 0);
  const getQty = useCallback((id: number) => items.find(i => i.produto.id === id)?.quantidade ?? 0, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count, getQty }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart fora do CartProvider');
  return ctx;
}
