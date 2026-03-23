"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, Settings, HelpCircle, Menu, X, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ds";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/calendar", label: "Calendar" },
  { href: "/clients", label: "Clients" },
  { href: "/contacts", label: "Contacts" },
  { href: "/waitlist", label: "Waitlist" },
  { href: "/invoices", label: "Invoices" },
  { href: "/payments", label: "Payments" },
  { href: "/reports", label: "Reports" },
  { href: "/products", label: "Products" },
];

export default function TopNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div className="flex h-12 items-center px-4">
        {/* Mobile hamburger */}
        <button
          className="mr-2 rounded p-1.5 text-text-secondary hover:bg-gray-100 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center">
          <span className="text-heading-lg text-accent">splose</span>
        </Link>

        {/* Navigation tabs - hidden on mobile */}
        <nav className="hidden h-full items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-full items-center border-b-2 px-3 text-label-lg transition-colors ${
                  isActive ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side icons */}
        <div className="ml-auto flex items-center gap-2">
          <button className="relative rounded-full p-2 text-text-secondary hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-caption-sm font-bold text-white">
              3
            </span>
          </button>
          <button className="relative rounded-full p-2 text-text-secondary hover:bg-gray-100">
            <MessageSquare className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-caption-sm font-bold text-white">
              8
            </span>
          </button>
          <Link href="/settings" className="rounded-full p-2 text-text-secondary hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </Link>
          <button className="rounded-full p-2 text-text-secondary hover:bg-gray-100">
            <HelpCircle className="h-5 w-5" />
          </button>
          <Avatar name="Sarah Chen" size="sm" className="ml-1 h-8 w-8" />
        </div>
      </div>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-white px-4 py-2 lg:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-label-lg ${
                  isActive ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-gray-50 hover:text-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
