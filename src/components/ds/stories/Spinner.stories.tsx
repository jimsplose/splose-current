import type { Meta, StoryObj } from "@storybook/react";
import Spinner from "../Spinner";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Spinner> = {
  title: "Feedback/Spinner",
  component: Spinner,
  tags: ["extended"],
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "sm=16px, md=24px, lg=32px",
    },
  },
  parameters: {
    layout: "centered",
    appPages: [
      {
        label: "Note edit",
        vercel: "https://splose-current.vercel.app/notes/1/edit",
        localhost: "http://localhost:3000/notes/1/edit",
        production: "https://acme.splose.com/notes/1/edit",
      },
    ],
    referenceUrl: "https://ant.design/components/spin",
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    size: "md",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Small: Story = { args: { size: "sm" } };
export const Medium: Story = { args: { size: "md" } };
export const Large: Story = { args: { size: "lg" } };

/* ------------------------------------------------------------------ */
/*  All Sizes side-by-side                                             */
/* ------------------------------------------------------------------ */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Spinner size="sm" />
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>sm</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Spinner size="md" />
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>md</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Spinner size="lg" />
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>lg</span>
      </div>
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  FullPageLoader                                                     */
/*  Pattern: Centered large spinner used as a full-page loading state  */
/*  Source: /notes/[id]/edit — while the note data is loading, a       */
/*  large spinner is centered vertically and horizontally              */
/* ------------------------------------------------------------------ */

export const FullPageLoader: Story = {
  name: "Recipe: Full Page Loader",
  render: () => (
    <div style={{ display: 'flex', height: 384, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1px solid var(--color-border)', borderStyle: 'dashed', backgroundColor: 'rgba(249,250,251,0.3)' }}>
      <Spinner size="lg" />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  InlineLoader                                                       */
/*  Pattern: Small spinner inline with "Thinking..." text during AI    */
/*  content generation in the notes editor                             */
/*  Source: /notes/[id]/edit — AI block generating state shows a sm    */
/*  spinner next to animated "Thinking..." text                        */
/* ------------------------------------------------------------------ */

export const InlineLoader: Story = {
  name: "Recipe: Inline Loader",
  render: () => (
    <div style={{ width: 384, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* AI generation in progress */}
      <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', borderColor: '#e9d5ff', padding: 16, backgroundColor: 'rgba(130,80,255,0.05)' }}>
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: '#7e22ce' }}>Subjective</span>
          <span style={{ fontSize: 11, lineHeight: 1.5, color: '#c084fc' }}>AI Assisted</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 16, paddingBottom: 16 }}>
          <Spinner size="sm" />
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            Thinking<span>...</span>
          </span>
        </div>
      </div>

      {/* Standalone inline variant */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
        <Spinner size="sm" />
        <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Loading notes...</span>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ButtonLoader                                                       */
/*  Pattern: Spinner inside a button during form submission            */
/*  Source: common pattern for save/submit actions across forms         */
/* ------------------------------------------------------------------ */

export const ButtonLoader: Story = {
  name: "Recipe: Button Loader",
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <button
        disabled
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 8, border: '1px solid var(--color-border)', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, color: '#fff', opacity: 0.8, fontSize: 14, fontWeight: 600, lineHeight: 1.57 }}
      >
        <Spinner size="sm" style={{ borderColor: '#fff', borderTopColor: 'transparent' }} />
        Saving...
      </button>
      <button
        disabled
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, opacity: 0.8, fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}
      >
        <Spinner size="sm" />
        Loading...
      </button>
    </div>
  ),
  parameters: { layout: "centered" },
};

/* ------------------------------------------------------------------ */
/*  TableLoadingState                                                  */
/*  Pattern: Spinner as a placeholder while a data table loads         */
/*  Source: used in client-side data tables that fetch on mount         */
/* ------------------------------------------------------------------ */

export const TableLoadingState: Story = {
  name: "Recipe: Table Loading State",
  render: () => (
    <div style={{ overflow: 'hidden', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
      {/* Table header skeleton */}
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-border)', backgroundColor: '#f9fafb', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
        <div style={{ height: 12, width: 80, borderRadius: 4, backgroundColor: '#e5e7eb' }} />
        <div style={{ marginLeft: 32, height: 12, width: 128, borderRadius: 4, backgroundColor: '#e5e7eb' }} />
        <div style={{ marginLeft: 'auto', height: 12, width: 64, borderRadius: 4, backgroundColor: '#e5e7eb' }} />
      </div>
      {/* Spinner body */}
      <div style={{ display: 'flex', height: 192, alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size="md" />
      </div>
      {/* Footer skeleton */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
        <div style={{ height: 12, width: 128, borderRadius: 4, backgroundColor: '#e5e7eb' }} />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  OverlayLoader                                                      */
/*  Pattern: Full-screen overlay spinner for page transitions          */
/*  Source: modal/dialog loading states, route transitions              */
/* ------------------------------------------------------------------ */

export const OverlayLoader: Story = {
  name: "Recipe: Overlay Loader",
  render: () => (
    <div style={{ position: 'relative', height: 384, width: '100%', overflow: 'hidden', borderRadius: 8, border: '1px solid var(--color-border)' }}>
      {/* Background content (blurred/dimmed) */}
      <div style={{ padding: 24, opacity: 0.5, filter: 'blur(1px)' }}>
        <div style={{ marginBottom: 16, height: 24, width: 192, borderRadius: 4, backgroundColor: '#e5e7eb' }} />
        <div style={{ marginBottom: 8, height: 16, width: '100%', borderRadius: 4, backgroundColor: '#f3f4f6' }} />
        <div style={{ marginBottom: 8, height: 16, width: '75%', borderRadius: 4, backgroundColor: '#f3f4f6' }} />
        <div style={{ height: 16, width: '50%', borderRadius: 4, backgroundColor: '#f3f4f6' }} />
      </div>
      {/* Overlay */}
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Spinner size="lg" />
          <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Loading...</span>
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
