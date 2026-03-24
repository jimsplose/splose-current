"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
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

/* ── Breakpoint: 600px matches production ── */
const MOBILE_BP = 600;

export default function TopNav({ brand = "splose", items, children, className = "" }: TopNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(items.length);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  /* Measure which items fit, put the rest in "More" */
  const measure = useCallback(() => {
    const mobile = window.innerWidth <= MOBILE_BP;
    setIsMobile(mobile);
    if (mobile) return;

    const nav = navRef.current;
    if (!nav) return;

    // Available width = nav container width minus "More" button space (80px reserve)
    const available = nav.getBoundingClientRect().width;
    const links = nav.querySelectorAll<HTMLElement>("[data-nav-item]");
    let used = 0;
    let count = 0;
    const moreWidth = 80; // reserve for "More" button

    for (const link of links) {
      // Temporarily show all to measure
      link.style.display = "";
      const w = link.getBoundingClientRect().width;
      if (used + w + (count < items.length - 1 ? moreWidth : 0) <= available) {
        used += w;
        count++;
      } else {
        break;
      }
    }

    setVisibleCount(count >= items.length ? items.length : count);
  }, [items.length]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /* Close "More" dropdown on click outside */
  useEffect(() => {
    if (!moreOpen) return;
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [moreOpen]);

  const visibleItems = items.slice(0, visibleCount);
  const overflowItems = items.slice(visibleCount);

  const linkClass = (href: string) =>
    `flex h-full items-center border-t-2 px-[15px] text-[14px] whitespace-nowrap transition-colors ${
      isActive(href)
        ? "border-primary font-semibold text-primary"
        : "border-transparent font-normal text-[rgb(65,69,73)] hover:text-primary"
    }`;

  return (
    <header className={`sticky top-0 z-40 border-b border-black/[0.06] bg-white ${className}`}>
      <div className="flex h-14 items-center pr-4">
        {/* Mobile hamburger — show at ≤600px */}
        {isMobile && (
          <Button
            variant="icon"
            size="sm"
            className="mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}

        {/* Logo */}
        <Link href="/" className="flex h-full items-center px-[15px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/splose logo.svg" alt={brand} className="h-[34px] w-auto" />
        </Link>

        {/* Navigation tabs — inline above 600px, with "More" overflow */}
        {!isMobile && (
          <nav ref={navRef} className="flex h-full flex-1 items-center overflow-hidden" style={{ maxWidth: "calc(100% - 300px)" }}>
            {items.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                data-nav-item
                className={linkClass(item.href)}
                style={i >= visibleCount ? { display: "none" } : undefined}
              >
                {item.label}
              </Link>
            ))}

            {/* "More" dropdown for overflow items */}
            {overflowItems.length > 0 && (
              <div ref={moreRef} className="relative flex h-full items-center">
                <button
                  type="button"
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`flex h-full items-center gap-1 border-t-2 px-[15px] text-[14px] font-normal transition-colors ${
                    overflowItems.some((i) => isActive(i.href))
                      ? "border-primary font-semibold text-primary"
                      : "border-transparent text-[rgb(65,69,73)] hover:text-primary"
                  }`}
                >
                  More <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {moreOpen && (
                  <div className="absolute left-0 top-full z-50 mt-px min-w-[180px] rounded-lg border border-black/[0.06] bg-white py-1 shadow-lg">
                    {overflowItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className={`block px-4 py-2 text-[14px] transition-colors ${
                          isActive(item.href)
                            ? "font-semibold text-primary"
                            : "text-[rgb(65,69,73)] hover:bg-gray-50 hover:text-primary"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        )}

        {/* Right side content */}
        {children && <div className="ml-auto flex items-center gap-2">{children}</div>}
      </div>

      {/* Mobile navigation menu — slides down at ≤600px */}
      {isMobile && mobileMenuOpen && (
        <nav className="border-t border-border bg-white px-4 py-2">
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
