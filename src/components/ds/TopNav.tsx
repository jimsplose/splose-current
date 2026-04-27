"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { MenuOutlined, CloseOutlined, DownOutlined } from "@ant-design/icons";
import { Button } from "antd";
import styles from "./TopNav.module.css";

export interface NavItem {
  href: string;
  label: string;
}

export interface TopNavProps {
  brand?: string;
  items: NavItem[];
  children?: React.ReactNode;
  className?: string;
}

const MOBILE_BP = 600;

export default function TopNav({ brand = "splose", items, children, className }: TopNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(items.length);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

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

  return (
    <header className={`${styles.header} ${className || ""}`}>
      <div className={styles.headerInner}>
        {isMobile && (
          <Button
            type="text"
            size="small"
            icon={mobileMenuOpen ? <CloseOutlined style={{ fontSize: 18 }} /> : <MenuOutlined style={{ fontSize: 18 }} />}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ marginRight: 8 }}
          />
        )}

        <Link href="/" className={styles.logoLink}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/splose logo.svg" alt={brand} className={styles.logoImg} />
        </Link>

        {!isMobile && (
          <nav ref={navRef} className={styles.nav}>
            {items.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                data-nav-item
                className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ""}`}
                style={i >= visibleCount ? { display: "none" } : undefined}
              >
                {item.label}
              </Link>
            ))}

            {overflowItems.length > 0 && (
              <div ref={moreRef} style={{ position: "relative", display: "flex", height: "100%", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`${styles.moreButton} ${overflowItems.some((i) => isActive(i.href)) ? styles.moreButtonActive : ""}`}
                >
                  More <DownOutlined style={{ fontSize: 12 }} />
                </button>
                {moreOpen && (
                  <div className={styles.moreDropdown}>
                    {overflowItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className={`${styles.moreDropdownLink} ${isActive(item.href) ? styles.moreDropdownLinkActive : ""}`}
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

        {children && <div className={styles.rightSide}>{children}</div>}
      </div>

      {isMobile && mobileMenuOpen && (
        <nav className={styles.mobileNav}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`${styles.mobileNavLink} ${isActive(item.href) ? styles.mobileNavLinkActive : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
