import type { Meta, StoryObj } from "@storybook/react";
import Spinner from "../Spinner";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Spinner> = {
  title: "Feedback/Spinner",
  component: Spinner,
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "sm=16px, md=24px, lg=32px",
    },
  },
  parameters: {
    layout: "centered",
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
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <span className="text-xs text-text-secondary">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <span className="text-xs text-text-secondary">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span className="text-xs text-text-secondary">lg</span>
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
    <div className="flex h-96 w-full items-center justify-center rounded-lg border border-dashed border-border bg-gray-50/30">
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
    <div className="w-96 space-y-4">
      {/* AI generation in progress */}
      <div className="rounded-lg border border-purple-200 bg-primary/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-label-lg text-purple-700">Subjective</span>
          <span className="text-caption-sm text-purple-400">AI Assisted</span>
        </div>
        <div className="flex items-center gap-2 py-4">
          <Spinner size="sm" />
          <span className="text-sm text-text-secondary">
            Thinking<span className="animate-pulse">...</span>
          </span>
        </div>
      </div>

      {/* Standalone inline variant */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-3">
        <Spinner size="sm" />
        <span className="text-body-md text-text-secondary">Loading notes...</span>
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
    <div className="flex items-center gap-4">
      <button
        disabled
        className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-label-lg text-white opacity-80"
      >
        <Spinner size="sm" className="border-white border-t-transparent" />
        Saving...
      </button>
      <button
        disabled
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-label-lg text-text-secondary opacity-80"
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
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      {/* Table header skeleton */}
      <div className="flex items-center border-b border-border bg-gray-50 px-4 py-3">
        <div className="h-3 w-20 rounded bg-gray-200" />
        <div className="ml-8 h-3 w-32 rounded bg-gray-200" />
        <div className="ml-auto h-3 w-16 rounded bg-gray-200" />
      </div>
      {/* Spinner body */}
      <div className="flex h-48 items-center justify-center">
        <Spinner size="md" />
      </div>
      {/* Footer skeleton */}
      <div className="flex items-center justify-end border-t border-border px-4 py-3">
        <div className="h-3 w-32 rounded bg-gray-200" />
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
    <div className="relative h-96 w-full overflow-hidden rounded-lg border border-border">
      {/* Background content (blurred/dimmed) */}
      <div className="p-6 opacity-50 blur-[1px]">
        <div className="mb-4 h-6 w-48 rounded bg-gray-200" />
        <div className="mb-2 h-4 w-full rounded bg-gray-100" />
        <div className="mb-2 h-4 w-3/4 rounded bg-gray-100" />
        <div className="h-4 w-1/2 rounded bg-gray-100" />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/60">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <span className="text-label-lg text-text-secondary">Loading...</span>
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
