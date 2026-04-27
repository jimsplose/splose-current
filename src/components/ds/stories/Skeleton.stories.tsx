import type { Meta, StoryObj } from "@storybook/react";
import Skeleton from "../Skeleton";
import Card from "../Card";

const meta: Meta<typeof Skeleton> = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  tags: ["extended"],
  argTypes: {
    shape: { control: "select", options: ["text", "rect", "circle"] },
    width: { control: "text" },
    height: { control: "text" },
    lines: { control: { type: "number", min: 1, max: 8 } },
    animated: { control: "boolean" },
  },
  parameters: {
    layout: "padded",
    appPages: [
      {
        label: "Clients list",
        vercel: "https://splose-current.vercel.app/clients",
        production: "https://acme.splose.com/patients",
      },
      {
        label: "Invoices list",
        vercel: "https://splose-current.vercel.app/invoices",
        production: "https://acme.splose.com/invoices",
      },
      {
        label: "Contacts list",
        vercel: "https://splose-current.vercel.app/contacts",
        production: "https://acme.splose.com/contacts",
      },
      {
        label: "Waitlist",
        vercel: "https://splose-current.vercel.app/waitlist",
        production: "https://acme.splose.com/waitlist",
      },
    ],
    referenceUrl: "https://ant.design/components/skeleton",
    splose: {
      status: "beta",
      summary:
        "Neutral placeholder that occupies the space of content while it loads.",
      whatToUseInstead:
        "<div className=\"animate-pulse bg-gray-200\" /> and ad-hoc loading rectangles.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Skeleton.md",
      source: "src/components/ds/Skeleton.tsx",
    },
  },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: { shape: "text", width: 240, height: undefined, lines: 1, animated: true },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Text: Story = {
  name: "Feature: Text",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 360 }}>
      <Skeleton.Text />
      <Skeleton.Text lines={3} />
      <Skeleton.Text lines={5} />
    </div>
  ),
};

export const Avatar: Story = {
  name: "Feature: Avatar",
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Skeleton.Avatar size={24} />
      <Skeleton.Avatar size={32} />
      <Skeleton.Avatar size={40} />
      <Skeleton.Avatar size={56} />
    </div>
  ),
};

export const Block: Story = {
  name: "Feature: Block",
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <Skeleton.Block width={120} height={80} />
      <Skeleton.Block width={240} height={120} />
      <Skeleton.Block width={180} height={180} />
    </div>
  ),
};

export const ReducedMotion: Story = {
  name: "Feature: Reduced Motion",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
      <div>
        <div style={{ fontSize: 12, marginBottom: 4, color: "#6E6E64" }}>Animated</div>
        <Skeleton.Text lines={2} />
      </div>
      <div>
        <div style={{ fontSize: 12, marginBottom: 4, color: "#6E6E64" }}>animated=false</div>
        <Skeleton.Text lines={2} animated={false} />
      </div>
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

/* List page loading — 6 rows of avatar + name + subtitle. */
export const ListPageRowSkeletons: Story = {
  name: "Recipe: List Page Rows",
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Card padding="md">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 0",
              borderBottom:
                i < 5 ? "1px solid var(--color-border, #eee)" : "none",
            }}
          >
            <Skeleton.Avatar size={36} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <Skeleton.Text width={140} />
              <Skeleton.Text width={220} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  ),
};

/* Detail header loading — avatar + title + subtitle + action buttons. */
export const DetailHeaderSkeleton: Story = {
  name: "Recipe: Detail Header",
  render: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: 24,
        borderBottom: "1px solid var(--color-border, #eee)",
        maxWidth: 720,
      }}
    >
      <Skeleton.Avatar size={56} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <Skeleton.Block width={220} height={22} />
        <Skeleton.Block width={160} height={14} />
      </div>
      <Skeleton.Block width={96} height={32} />
    </div>
  ),
};

/* Card body loading — title + paragraph + CTA. */
export const CardBodySkeleton: Story = {
  name: "Recipe: Card Body",
  render: () => (
    <Card title={<Skeleton.Block width={160} height={20} />} padding="md" style={{ maxWidth: 360 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Skeleton.Text lines={3} />
        <Skeleton.Block width={120} height={32} />
      </div>
    </Card>
  ),
};

/* Loading wrapper: swaps between children and placeholder. */
export const LoadingWrapper: Story = {
  name: "Recipe: Loading Wrapper",
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div style={{ flex: 1, maxWidth: 240 }}>
        <div style={{ fontSize: 12, marginBottom: 8, color: "#6E6E64" }}>
          loaded=false
        </div>
        <Skeleton.Loading loaded={false}>
          <div style={{ padding: 12, border: "1px solid #eee" }}>
            Real content
          </div>
        </Skeleton.Loading>
      </div>
      <div style={{ flex: 1, maxWidth: 240 }}>
        <div style={{ fontSize: 12, marginBottom: 8, color: "#6E6E64" }}>
          loaded=true
        </div>
        <Skeleton.Loading loaded={true}>
          <div style={{ padding: 12, border: "1px solid #eee" }}>
            Real content
          </div>
        </Skeleton.Loading>
      </div>
    </div>
  ),
};
