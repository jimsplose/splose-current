import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import Tab from "../Tab";

const meta: Meta<typeof Tab> = {
  title: "Navigation/Tab",
  component: Tab,
  tags: ["extended"],
  parameters: {
    appPages: [
      {
        route: "/settings/ai",
        vercel: "https://splose-current.vercel.app/settings/ai",
        production: "https://acme.splose.com/settings/ai",
      },
      {
        route: "/waitlist",
        vercel: "https://splose-current.vercel.app/waitlist",
        production: "https://acme.splose.com/waitlist",
      },
      {
        route: "/settings/tags",
        vercel: "https://splose-current.vercel.app/settings/tags",
        production: "https://acme.splose.com/settings/tags",
      },
      {
        route: "/settings/forms/[id]",
        vercel: "https://splose-current.vercel.app/settings/forms/cmngtw7n9005eycwg4e67506h",
        production: "https://acme.splose.com/settings/forms/cmngtw7n9005eycwg4e67506h",
      },
    ],
    referenceUrl: "https://ant.design/components/tabs",
  },
};

export default meta;
type Story = StoryObj<typeof Tab>;

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    items: [
      { label: "Preferences", value: "preferences" },
      { label: "Saved prompts", value: "saved-prompts" },
      { label: "AI block library", value: "ai-block-library", badge: "BETA" },
    ],
    value: "preferences",
    onChange: fn(),
  },
};

// ---------------------------------------------------------------------------
// Feature stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    items: [
      { label: "Screener", value: "screener" },
      { label: "Waitlist", value: "waitlist" },
    ],
    value: "screener",
    onChange: fn(),
  },
};

export const ThreeItems: Story = {
  args: {
    items: [
      { label: "Components", value: "components" },
      { label: "Pages (22)", value: "pages" },
      { label: "Tokens", value: "tokens" },
    ],
    value: "components",
    onChange: fn(),
  },
};

export const WithBadge: Story = {
  args: {
    items: [
      { label: "Preferences", value: "preferences" },
      { label: "Saved prompts", value: "saved-prompts" },
      { label: "AI block library", value: "ai-block-library", badge: "BETA" },
    ],
    value: "ai-block-library",
    onChange: fn(),
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("tab-1");
    return (
      <div>
        <Tab
          items={[
            { label: "Tab 1", value: "tab-1" },
            { label: "Tab 2", value: "tab-2" },
            { label: "Tab 3", value: "tab-3" },
          ]}
          value={value}
          onChange={setValue}
        />
        <div style={{ marginTop: 16, borderRadius: 4, border: '1px solid var(--color-border)', padding: 16, fontSize: 12, borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
          Active tab: <strong>{value}</strong>
        </div>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Recipes — real patterns from the codebase
// ---------------------------------------------------------------------------

/**
 * Settings AI page — three tabs with a BETA badge on the third.
 * Source: `src/app/settings/ai/page.tsx`
 */
export const SettingsAITabs: Story = {
  name: "Recipe: Settings AI Tabs",
  render: () => {
    const [value, setValue] = useState("preferences");
    return (
      <div>
        <Tab
          items={[
            { label: "Preferences", value: "preferences" },
            { label: "Saved prompts", value: "saved-prompts" },
            { label: "AI block library", value: "ai-block-library", badge: "BETA" },
          ]}
          value={value}
          onChange={setValue}
          style={{ marginBottom: 24 }}
        />
        <div style={{ borderRadius: 4, border: '1px solid var(--color-border)', padding: 16, fontSize: 12, borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
          {value === "preferences" && "Voice-to-text, email assistant, and AI note generation settings."}
          {value === "saved-prompts" && "Custom prompts for AI-assisted note writing."}
          {value === "ai-block-library" && "Reusable AI block templates (BETA)."}
        </div>
      </div>
    );
  },
};

/**
 * Waitlist page — Screener / Waitlist main tabs with nested sub-tabs.
 * Source: `src/app/waitlist/page.tsx`
 */
export const WaitlistTabs: Story = {
  name: "Recipe: Waitlist Tabs",
  render: () => {
    const [mainTab, setMainTab] = useState("screener");
    const [subTab, setSubTab] = useState("triage");
    return (
      <div>
        <Tab
          items={[
            { label: "Screener", value: "screener" },
            { label: "Waitlist", value: "waitlist" },
          ]}
          value={mainTab}
          onChange={(v) => {
            setMainTab(v);
            setSubTab(v === "screener" ? "triage" : "active");
          }}
          style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 8 }}
        />
        <div style={{ marginTop: 16, paddingLeft: 24, paddingRight: 24 }}>
          {mainTab === "screener" && (
            <Tab
              items={[
                { label: "Triage", value: "triage" },
                { label: "Rejected", value: "rejected" },
              ]}
              value={subTab}
              onChange={setSubTab}
            />
          )}
          {mainTab === "waitlist" && (
            <Tab
              items={[
                { label: "Active", value: "active" },
                { label: "Closed", value: "closed" },
              ]}
              value={subTab}
              onChange={setSubTab}
            />
          )}
          <div style={{ marginTop: 16, borderRadius: 4, border: '1px solid var(--color-border)', padding: 16, fontSize: 12, borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
            Showing: {mainTab} &rarr; {subTab}
          </div>
        </div>
      </div>
    );
  },
};
