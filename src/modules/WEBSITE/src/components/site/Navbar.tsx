import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, ShoppingCart, X } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À propos" },
  { to: "/services", label: "Nos services" },
  { to: "/realisations", label: "Réalisations" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-black/60 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between gap-4 px-5 lg:h-[90px] lg:px-6 2xl:px-8">
        <Logo />

        <ul className="hidden min-w-0 items-center justify-center gap-0.5 lg:flex xl:gap-1">
          {NAV.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="group relative block whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-medium text-white/75 transition-colors hover:text-white xl:px-3 xl:text-sm 2xl:px-4"
                activeProps={{ className: "text-white" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    <span
                      className={`pointer-events-none absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-[var(--gradient-primary)] transition-all duration-300 ${
                        isActive
                          ? "opacity-100 shadow-[0_0_12px_rgba(139,61,255,0.9)]"
                          : "opacity-0 group-hover:opacity-70"
                      }`}
                    />
                  </>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            to="/contact"
            className="btn-gradient inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold 2xl:px-5"
          >
            Demander un devis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/panier"
            aria-label="Panier"
            className="relative inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.04] p-2.5 text-sm font-semibold text-white backdrop-blur-xl transition hover:border-[color:var(--brand-violet)]/60"
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--gradient-primary)] px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-black/90 backdrop-blur-2xl lg:hidden">
          <ul className="space-y-1 px-5 py-4">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
                  activeProps={{ className: "text-white bg-white/5" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex gap-2 pt-2">
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="btn-gradient inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
              >
                Demander un devis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/panier"
                onClick={() => setOpen(false)}
                aria-label="Panier"
                className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white"
              >
                <ShoppingCart className="h-4 w-4" />
                {count > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--gradient-primary)] px-1 text-[10px] font-bold text-white">
                    {count}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
