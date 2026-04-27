"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { BellOutlined, SettingOutlined, QuestionCircleOutlined, MessageOutlined } from "@ant-design/icons";
import TopNav from "../TopNav";
import Avatar from "../Avatar";
import { Button } from "antd";

const meta: Meta<typeof TopNav> = {
  title: "Navigation/TopNav",
  component: TopNav,
  tags: ["custom"],
  argTypes: {
    brand: { control: "text" },
    className: { control: "text" },
  },
  parameters: {
    nextjs: { appDirectory: true },
    layout: "fullscreen",
    appPages: [
      {
        route: "/calendar",
        vercel: "https://splose-current.vercel.app/calendar",
        production: "https://acme.splose.com/calendar/week/25/3/2026",
      },
      {
        route: "/clients",
        vercel: "https://splose-current.vercel.app/clients",
        production: "https://acme.splose.com/patients",
      },
      {
        route: "/invoices",
        vercel: "https://splose-current.vercel.app/invoices",
        production: "https://acme.splose.com/invoices",
      },
    ],
    referenceUrl: null,
  },
};

export default meta;
type Story = StoryObj<typeof TopNav>;

/* ── Playground ─────────────────────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    brand: "splose",
    items: [
      { href: "/", label: "Dashboard" },
      { href: "/calendar", label: "Calendar" },
      { href: "/clients", label: "Clients" },
    ],
  },
};

/* ── Feature Stories ────────────────────────────────────────────────────── */

export const Default: Story = {
  args: {
    items: [
      { href: "#home", label: "Home" },
      { href: "#about", label: "About" },
      { href: "#contact", label: "Contact" },
    ],
  },
};

export const WithChildren: Story = {
  args: {
    items: [
      { href: "#dashboard", label: "Dashboard" },
      { href: "#reports", label: "Reports" },
    ],
  },
  render: (args) => (
    <TopNav {...args}>
      <button style={{ borderRadius: '50%', backgroundColor: '#f3f4f6', padding: 8, color: 'var(--color-text-secondary)' }}>
        <svg style={{ height: 20, width: 20 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>
      <div style={{ display: 'flex', height: 32, width: 32, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#f3e8ff', fontSize: 11, fontWeight: 700, color: 'var(--color-primary)' }}>
        SC
      </div>
    </TopNav>
  ),
};

/* ── Recipes ────────────────────────────────────────────────────────────── */

export const SplosNav: Story = {
  name: "Recipe: Full Splose Nav",
  render: () => (
    <TopNav
      items={[
        { href: "/", label: "Dashboard" },
        { href: "/calendar", label: "Calendar" },
        { href: "/clients", label: "Clients" },
        { href: "/contacts", label: "Contacts" },
        { href: "/waitlist", label: "Waitlist" },
        { href: "/invoices", label: "Invoices" },
        { href: "/payments", label: "Payments" },
        { href: "/reports", label: "Reports" },
        { href: "/products", label: "Products" },
      ]}
    >
      <Button variant="icon" shape="circle" style={{ position: 'relative' }}>
        <BellOutlined style={{ fontSize: 20 }} />
        <span style={{ position: 'absolute', right: 6, top: 6, display: 'flex', height: 16, width: 16, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff', fontSize: 11, lineHeight: 1.5, backgroundColor: 'var(--color-danger)' }}>3</span>
      </Button>
      <Button variant="icon" shape="circle" style={{ position: 'relative' }}>
        <MessageOutlined style={{ fontSize: 20 }} />
        <span style={{ position: 'absolute', right: 6, top: 6, display: 'flex', height: 16, width: 16, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff', fontSize: 11, lineHeight: 1.5, backgroundColor: 'var(--color-danger)' }}>8</span>
      </Button>
      <Button variant="icon" shape="circle">
        <SettingOutlined style={{ fontSize: 20 }} />
      </Button>
      <Button variant="icon" shape="circle">
        <QuestionCircleOutlined style={{ fontSize: 20 }} />
      </Button>
      <Avatar name="Sarah Chen" size="sm" style={{ marginLeft: 4, height: 32, width: 32 }} />
    </TopNav>
  ),
};

/* ------------------------------------------------------------------ */
/*  LayoutTopNav                                                       */
/*  Pattern: The exact TopNav used in the app layout.tsx. Uses DS      */
/*  Button with variant="icon" and Avatar for the right-side icons.    */
/*  Source: /src/components/TopNav.tsx — the wrapper component used     */
/*  in layout.tsx that composes DSTopNav with AntD icons + Avatar      */
/* ------------------------------------------------------------------ */

export const LayoutTopNav: Story = {
  name: "Recipe: Layout TopNav (production)",
  render: () => (
    <TopNav
      items={[
        { href: "/", label: "Dashboard" },
        { href: "/calendar", label: "Calendar" },
        { href: "/clients", label: "Clients" },
        { href: "/contacts", label: "Contacts" },
        { href: "/waitlist", label: "Waitlist" },
        { href: "/invoices", label: "Invoices" },
        { href: "/payments", label: "Payments" },
        { href: "/reports", label: "Reports" },
        { href: "/products", label: "Products" },
      ]}
    >
      <Button variant="icon" shape="circle" style={{ position: 'relative' }}>
        <BellOutlined style={{ fontSize: 20 }} />
        <span style={{ position: 'absolute', top: 6, right: 6, display: 'flex', height: 16, width: 16, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff', fontSize: 11, lineHeight: 1.5, backgroundColor: 'var(--color-danger)' }}>3</span>
      </Button>
      <Button variant="icon" shape="circle" style={{ position: 'relative' }}>
        <MessageOutlined style={{ fontSize: 20 }} />
        <span style={{ position: 'absolute', top: 6, right: 6, display: 'flex', height: 16, width: 16, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff', fontSize: 11, lineHeight: 1.5, backgroundColor: 'var(--color-danger)' }}>8</span>
      </Button>
      <Button variant="icon" shape="circle">
        <SettingOutlined style={{ fontSize: 20 }} />
      </Button>
      <Button variant="icon" shape="circle">
        <QuestionCircleOutlined style={{ fontSize: 20 }} />
      </Button>
      <Avatar name="Sarah Chen" size="sm" style={{ marginLeft: 4, height: 32, width: 32 }} />
    </TopNav>
  ),
};

/* ------------------------------------------------------------------ */
/*  MinimalNav                                                         */
/*  Pattern: Minimal nav with only 3 items, no right-side icons.       */
/*  Useful for sub-apps or simplified views (e.g. client portal).      */
/*  Source: hypothetical client portal — reduced nav items              */
/* ------------------------------------------------------------------ */

export const MinimalNav: Story = {
  name: "Recipe: Minimal Nav",
  render: () => (
    <TopNav
      items={[
        { href: "/", label: "Home" },
        { href: "/appointments", label: "Appointments" },
        { href: "/documents", label: "Documents" },
      ]}
    >
      <Avatar name="Liam Nguyen" size="sm" style={{ height: 32, width: 32 }} />
    </TopNav>
  ),
};

/* ------------------------------------------------------------------ */
/*  NavWithNotificationBadges                                          */
/*  Pattern: TopNav with notification badge counters on multiple       */
/*  icon buttons. Shows how Badge elements overlay icon buttons.       */
/*  Source: /src/components/TopNav.tsx — bell + message icons both     */
/*  have red badge counters for unread notifications                   */
/* ------------------------------------------------------------------ */

export const NavWithNotificationBadges: Story = {
  name: "Recipe: Nav with Notification Badges",
  render: () => (
    <TopNav
      items={[
        { href: "/", label: "Dashboard" },
        { href: "/calendar", label: "Calendar" },
        { href: "/clients", label: "Clients" },
      ]}
    >
      <Button variant="icon" shape="circle" style={{ position: 'relative' }}>
        <BellOutlined style={{ fontSize: 20 }} />
        <span style={{ position: 'absolute', top: 6, right: 6, display: 'flex', height: 16, width: 16, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff', fontSize: 11, lineHeight: 1.5, backgroundColor: 'var(--color-danger)' }}>5</span>
      </Button>
      <Button variant="icon" shape="circle" style={{ position: 'relative' }}>
        <MessageOutlined style={{ fontSize: 20 }} />
        <span style={{ position: 'absolute', top: 6, right: 6, display: 'flex', height: 16, width: 16, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff', fontSize: 11, lineHeight: 1.5, backgroundColor: 'var(--color-danger)' }}>12</span>
      </Button>
      <Avatar name="Emma Williams" size="sm" style={{ marginLeft: 4, height: 32, width: 32 }} />
    </TopNav>
  ),
};
