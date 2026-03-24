"use client";

import { Bell, Settings, HelpCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { TopNav as DSTopNav } from "@/components/ds";
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

/* Production header icon container: 42×56px, centered icon 20×20 */
function HeaderIcon({ children, badge, href }: { children: React.ReactNode; badge?: number; href?: string }) {
  const inner = (
    <div className="relative flex h-14 w-[42px] cursor-pointer items-center justify-center text-[rgb(65,69,73)] transition-colors hover:text-primary">
      {children}
      {badge != null && (
        <span className="absolute top-2 right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function TopNav() {
  return (
    <DSTopNav items={navItems}>
      <HeaderIcon badge={3}>
        <Bell className="h-5 w-5" />
      </HeaderIcon>
      <HeaderIcon badge={8}>
        <MessageSquare className="h-5 w-5" />
      </HeaderIcon>
      <HeaderIcon href="/settings">
        <Settings className="h-5 w-5" />
      </HeaderIcon>
      <HeaderIcon>
        <HelpCircle className="h-5 w-5" />
      </HeaderIcon>
      {/* Production avatar: 26×26, rgba(0,0,0,0.25) bg, 50% radius */}
      <div className="flex h-14 w-[42px] items-center justify-center">
        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-black/25 text-[12px] font-medium text-white">
          SC
        </div>
      </div>
    </DSTopNav>
  );
}
