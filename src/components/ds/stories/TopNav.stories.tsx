"use client";

import type { Meta, StoryObj } from "@storybook/react";
import TopNav from "../TopNav";

const meta: Meta<typeof TopNav> = {
  title: "Navigation/TopNav",
  component: TopNav,
  argTypes: {
    brand: { control: "text" },
    className: { control: "text" },
  },
  parameters: {
    nextjs: { appDirectory: true },
    layout: "fullscreen",
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
      <button className="rounded-full bg-gray-100 p-2 text-text-secondary hover:bg-gray-200">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-primary">
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
      <button className="relative rounded-full p-2 text-text-secondary hover:bg-gray-100">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          3
        </span>
      </button>
      <button className="relative rounded-full p-2 text-text-secondary hover:bg-gray-100">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          8
        </span>
      </button>
      <button className="rounded-full p-2 text-text-secondary hover:bg-gray-100">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      <button className="rounded-full p-2 text-text-secondary hover:bg-gray-100">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-primary">
        SC
      </div>
    </TopNav>
  ),
};
