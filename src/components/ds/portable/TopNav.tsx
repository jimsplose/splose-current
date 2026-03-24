/**
 * Portable TopNav -- framework-agnostic version.
 * Replaces next/link with <a> and usePathname() with an activePath prop.
 * Imports Button from the parent DS directory (works in both contexts).
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Button from "../Button";

export interface NavItem {
  href: string;
  label: string;
}

export interface TopNavProps {
  brand?: string;
  items: NavItem[];
  /** Current path for active state (replaces usePathname). */
  activePath?: string;
  children?: React.ReactNode;
  className?: string;
}

const MOBILE_BP = 600;

export default function TopNav({ brand = "splose", items, activePath = "", children, className = "" }: TopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(items.length);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    activePath === href || (href !== "/" && activePath.startsWith(href));

  const measure = useCallback(() => {
    const mobile = window.innerWidth <= MOBILE_BP;
    setIsMobile(mobile);
    if (mobile) return;

    const nav = navRef.current;
    if (!nav) return;

    const available = nav.getBoundingClientRect().width;
    const links = nav.querySelectorAll<HTMLElement>("[data-nav-item]");
    let used = 0;
    let count = 0;
    const moreWidth = 80;

    for (const link of links) {
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
    `flex h-full items-center border-t-2 px-[15px] text-[14px] leading-[56px] whitespace-nowrap transition-colors subpixel-antialiased ${
      isActive(href)
        ? "border-primary font-semibold text-primary"
        : "border-transparent font-normal text-[rgb(65,69,73)] hover:text-primary"
    }`;

  return (
    <header className={`sticky top-0 z-40 border-b border-black/[0.06] bg-white ${className}`}>
      <div className="flex h-14 items-center">
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

        <a href="/" className="flex h-full items-center px-[15px]">
          <img src="/images/brand/splose logo.svg" alt={brand} className="h-[34px] w-auto" />
        </a>

        {!isMobile && (
          <nav ref={navRef} className="flex h-full flex-1 items-center overflow-hidden" style={{ maxWidth: "calc(100% - 300px)" }}>
            {items.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                data-nav-item
                className={linkClass(item.href)}
                style={i >= visibleCount ? { display: "none" } : undefined}
              >
                {item.label}
              </a>
            ))}

            {overflowItems.length > 0 && (
              <div ref={moreRef} className="relative flex h-full items-center">
                <button
                  type="button"
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`flex h-full items-center gap-1 border-t-2 px-[15px] text-[14px] leading-[56px] font-normal subpixel-antialiased transition-colors ${
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
                      <a
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
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        )}

        {children && <div className="ml-auto flex items-center">{children}</div>}
      </div>

      {isMobile && mobileMenuOpen && (
        <nav className="border-t border-border bg-white px-4 py-2">
          {items.map((item) => (
            <a
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
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
