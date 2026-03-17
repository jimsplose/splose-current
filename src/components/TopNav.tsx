"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Settings, HelpCircle } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/calendar", label: "Calendar" },
  { href: "/clients", label: "Clients" },
  { href: "/notes", label: "Progress notes" },
  { href: "/invoices", label: "Invoices" },
  { href: "/practitioners", label: "Practitioners" },
  { href: "/settings", label: "Settings" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div className="flex h-12 items-center px-4">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center">
          <span className="text-lg font-bold text-accent">splose</span>
        </Link>

        {/* Navigation tabs */}
        <nav className="flex h-full items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-full items-center border-b-2 px-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text"
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
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
              3
            </span>
          </button>
          <button className="rounded-full p-2 text-text-secondary hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-text-secondary hover:bg-gray-100">
            <HelpCircle className="h-5 w-5" />
          </button>
          <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
            SC
          </div>
        </div>
      </div>
    </header>
  );
}
