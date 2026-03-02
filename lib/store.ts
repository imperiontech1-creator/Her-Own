import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartState = {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCart: () => void;
  totalItems: () => number;
  totalCents: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      addItem: (item, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          const next = existing
            ? state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              )
            : [...state.items, { ...item, quantity: qty }];
          return { items: next, isCartOpen: true };
        });
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(50);
        }
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity } : i
                ),
        })),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),
      clearCart: () => set({ items: [], isCartOpen: false }),
      totalItems: () => get().items.reduce((n, i) => n + i.quantity, 0),
      totalCents: () => get().items.reduce((n, i) => n + i.price * i.quantity * 100, 0),
    }),
    { name: "her-own-cart" }
  )
);
