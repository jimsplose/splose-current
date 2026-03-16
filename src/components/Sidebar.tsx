"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Users,
  FileText,
  DollarSign,
  LayoutDashboard,
  UserCog,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/notes", label: "Clinical Notes", icon: FileText },
  { href: "/invoices", label: "Invoices", icon: DollarSign },
  { href: "/practitioners", label: "Practitioners", icon: UserCog },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-white">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-white">
          S
        </div>
        <span className="text-xl font-bold tracking-tight">Splose</span>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-indigo-200 hover:bg-sidebar-hover hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-indigo-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium">
            SC
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Sarah Chen</p>
            <p className="truncate text-xs text-indigo-300">
              Senior Physiotherapist
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
