"use client";

import { Bell, Settings, HelpCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { TopNav as DSTopNav, Avatar, Button } from "@/components/ds";
import type { NavItem } from "@/components/ds";

const navItems: NavItem[] = [
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
  return (
    <DSTopNav items={navItems}>
      <Button variant="icon" round className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-caption-sm font-bold text-white">3</span>
      </Button>
      <Button variant="icon" round className="relative">
        <MessageSquare className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-caption-sm font-bold text-white">8</span>
      </Button>
      <Link href="/settings" className="rounded-full p-2 text-text-secondary hover:bg-gray-100">
        <Settings className="h-5 w-5" />
      </Link>
      <Button variant="icon" round>
        <HelpCircle className="h-5 w-5" />
      </Button>
      <Avatar name="Sarah Chen" size="sm" className="ml-1 h-8 w-8" />
    </DSTopNav>
  );
}
