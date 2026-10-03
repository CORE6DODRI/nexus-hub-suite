// Panier front-office 100% local (localStorage), sans backend.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItemDTO, OrderDTO, OrderItemDTO } from "./shop.functions";

const STORAGE_KEY = "dodricom.cart.email";
const ITEMS_KEY = "dodricom.cart.items";
const ORDERS_KEY = "dodricom.cart.orders";

export type PendingItem = {
  itemType: string;
  itemId: string | null;
  slug: string | null;
  name: string;
  unitPrice: number;
  currency: string;
  imageUrl: string | null;
  quantity?: number;
};

interface CartContextValue {
  email: string | null;
  items: CartItemDTO[];
  orders: OrderDTO[];
  count: number;
  total: number;
  loading: boolean;
  identify: (email: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signOutCart: () => void;
  add: (item: PendingItem) => Promise<{ ok: boolean; pending?: boolean; error?: string }>;
  setQuantity: (id: string, quantity: number) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  submit: (info: { fullName?: string; phone?: string; company?: string; note?: string }) => Promise<
    { ok: true; number: string } | { ok: false; error: string }
  >;
}

const CartContext = createContext<CartContextValue | null>(null);

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [items, setItems] = useState<CartItemDTO[]>([]);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading] = useState(false);

  useEffect(() => {
    setEmail(window.localStorage.getItem(STORAGE_KEY));
    setItems(read<CartItemDTO[]>(ITEMS_KEY, []));
    setOrders(read<OrderDTO[]>(ORDERS_KEY, []));
  }, []);

  const persistItems = useCallback((next: CartItemDTO[]) => {
    setItems(next);
    write(ITEMS_KEY, next);
  }, []);

  const identify = useCallback<CartContextValue["identify"]>(async (value) => {
    const mail = value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      return { ok: false, error: "Adresse email invalide." } as const;
    }
    setEmail(mail);
    window.localStorage.setItem(STORAGE_KEY, mail);
    return { ok: true } as const;
  }, []);

  const signOutCart = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setEmail(null);
  }, []);

  const add = useCallback<CartContextValue["add"]>(
    async (item) => {
      const next = [...items];
      const existing = next.find((i) => i.slug === item.slug && i.itemId === item.itemId);
      if (existing) {
        existing.quantity += item.quantity ?? 1;
      } else {
        next.push({
          id: uid(),
          itemType: item.itemType,
          itemId: item.itemId,
          slug: item.slug,
          name: item.name,
          unitPrice: item.unitPrice,
          currency: item.currency,
          imageUrl: item.imageUrl,
          quantity: item.quantity ?? 1,
        });
      }
      persistItems(next);
      return { ok: true, pending: !email };
    },
    [items, email, persistItems],
  );

  const setQuantity = useCallback<CartContextValue["setQuantity"]>(
    async (id, quantity) => {
      persistItems(
        quantity <= 0
          ? items.filter((i) => i.id !== id)
          : items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      );
    },
    [items, persistItems],
  );

  const remove = useCallback<CartContextValue["remove"]>(
    async (id) => {
      persistItems(items.filter((i) => i.id !== id));
    },
    [items, persistItems],
  );

  const clear = useCallback(async () => {
    persistItems([]);
  }, [persistItems]);

  const submit = useCallback<CartContextValue["submit"]>(
    async (info) => {
      if (!email) return { ok: false, error: "Veuillez saisir votre email." };
      if (items.length === 0) return { ok: false, error: "Votre panier est vide." };
      const currency = items[0]?.currency ?? "MAD";
      const orderItems: OrderItemDTO[] = items.map((i) => ({
        id: i.id,
        name: i.name,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        total: i.unitPrice * i.quantity,
      }));
      const total = orderItems.reduce((s, i) => s + i.total, 0);
      const number = `CMD-${String(orders.length + 1).padStart(4, "0")}`;
      const order: OrderDTO = {
        id: uid(),
        number,
        email,
        fullName: info.fullName ?? null,
        phone: info.phone ?? null,
        company: info.company ?? null,
        note: info.note ?? null,
        total,
        currency,
        status: "nouvelle",
        createdAt: new Date().toISOString(),
        items: orderItems,
      };
      const nextOrders = [order, ...orders];
      setOrders(nextOrders);
      write(ORDERS_KEY, nextOrders);
      persistItems([]);
      return { ok: true, number };
    },
    [email, items, orders, persistItems],
  );

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    return { email, items, orders, count, total, loading, identify, signOutCart, add, setQuantity, remove, clear, submit };
  }, [email, items, orders, loading, identify, signOutCart, add, setQuantity, remove, clear, submit]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
