"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Button from "./Button";

export interface NavItem {
  href: string;
  label: string;
}

export interface TopNavProps {
  /** App name / logo text */
  brand?: string;
  /** Navigation items */
  items: NavItem[];
  /** Right-side content (icons, avatar, etc.) */
  children?: React.ReactNode;
  className?: string;
}

export default function TopNav({ brand = "splose", items, children, className = "" }: TopNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className={`sticky top-0 z-40 border-b border-border bg-white ${className}`}>
      <div className="flex h-14 items-center px-4">
        {/* Mobile hamburger */}
        <Button
          variant="icon"
          size="sm"
          className="mr-2 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/splose logo.svg" alt={brand} className="h-[32px] w-auto" />
        </Link>

        {/* Navigation tabs - hidden on mobile */}
        <nav className="hidden h-full items-center gap-1 lg:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-full items-center border-b-2 px-3 text-label-lg transition-colors ${
                isActive(item.href)
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side content */}
        {children && <div className="ml-auto flex items-center gap-2">{children}</div>}
      </div>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-white px-4 py-2 lg:hidden">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-md px-3 py-2 text-label-lg ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-gray-50 hover:text-text"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
