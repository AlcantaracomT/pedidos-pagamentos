import { Product } from "@/types/product";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextData = {
  items: CartItem[];
  delivery: number;
  discount: number;
  subtotal: number;
  total: number;
  setCartItems: (items: CartItem[]) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextData | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const delivery = 5;
  const discount = 10;

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);
  }, [items]);

  const total = useMemo(() => {
    return Math.max(0, subtotal + delivery - discount);
  }, [subtotal]);

  function setCartItems(newItems: CartItem[]) {
    setItems(newItems);
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        delivery,
        discount,
        subtotal,
        total,
        setCartItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }

  return context;
}