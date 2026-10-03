// Types et constantes du panier (front-office statique, stockage local).

export type CartItemDTO = {
  id: string;
  itemType: string;
  itemId: string | null;
  slug: string | null;
  name: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  imageUrl: string | null;
};

export type OrderItemDTO = {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
};

export type OrderDTO = {
  id: string;
  number: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  company: string | null;
  note: string | null;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
  items: OrderItemDTO[];
};

export const ORDER_STATUSES = [
  "nouvelle",
  "confirmee",
  "en_preparation",
  "en_livraison",
  "livree",
  "annulee",
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  nouvelle: "Nouvelle",
  confirmee: "Confirmée",
  en_preparation: "En préparation",
  en_livraison: "En livraison",
  livree: "Livrée",
  annulee: "Annulée",
};
