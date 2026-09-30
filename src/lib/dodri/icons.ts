import {
  Activity,
  Boxes,
  Box,
  BarChart3,
  Briefcase,
  Calculator,
  CreditCard,
  Database,
  FileText,
  Globe,
  Handshake,
  Headphones,
  LayoutGrid,
  LifeBuoy,
  Megaphone,
  MessageSquare,
  Package,
  ShoppingCart,
  Store,
  Users,
  Wallet,
  Warehouse,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/** Icons a module can declare in the registry. Keep this list open-ended. */
export const MODULE_ICONS: Record<string, LucideIcon> = {
  Box,
  Boxes,
  LayoutGrid,
  FileText,
  Package,
  ShoppingCart,
  Users,
  Store,
  Warehouse,
  Megaphone,
  Briefcase,
  LifeBuoy,
  Headphones,
  Calculator,
  CreditCard,
  Database,
  Activity,
  BarChart3,
  Workflow,
  Globe,
  Handshake,
  Wallet,
  MessageSquare,
};

export const MODULE_ICON_NAMES = Object.keys(MODULE_ICONS);

export function moduleIcon(name?: string | null): LucideIcon {
  return (name && MODULE_ICONS[name]) || Box;
}
