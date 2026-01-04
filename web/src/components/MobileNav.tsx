"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/products", label: "Products", icon: "🛍️" },
    { href: "/customize", label: "Customize", icon: "✏️" },
    { href: "/about", label: "About", icon: "ℹ️" },
  ];

  return (
    <nav className="mobile-nav md:hidden safe-area-bottom">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 haptic-feedback ${
            pathname === item.href
              ? "text-accent bg-accent-subtle/30"
              : "text-text-muted hover:text-accent hover:bg-surface-alt"
          }`}
          aria-label={item.label}
          aria-current={pathname === item.href ? "page" : undefined}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
