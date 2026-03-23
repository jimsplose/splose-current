import type { Meta, StoryObj } from "@storybook/react";
import { Search, FileText, Package } from "lucide-react";
import EmptyState from "../EmptyState";
import Button from "../Button";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof EmptyState> = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  argTypes: {
    title: {
      control: "text",
      description: "Optional bold heading above the message",
    },
    message: {
      control: "text",
      description: "Descriptive message explaining the empty state",
    },
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    title: "Nothing here yet",
    message: "Get started by creating your first item.",
    icon: <FileText className="h-10 w-10 text-text-secondary" />,
    action: <Button variant="primary">Create item</Button>,
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: {
    message: "No invoices found.",
  },
};

export const WithAction: Story = {
  args: {
    message: "No payments yet.",
    action: <Button variant="primary">Add payment</Button>,
  },
};

export const WithIcon: Story = {
  args: {
    icon: <Search className="h-10 w-10 text-text-secondary" />,
    title: "No results",
    message: "Try adjusting your search or filters.",
  },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  NoSearchResults                                                    */
/*  Pattern: Shown when a search/filter returns zero rows              */
/*  Source: /notes/[id]/edit — "No reference notes found"              */
/* ------------------------------------------------------------------ */

export const NoSearchResults: Story = {
  args: {
    message: "No reference notes found",
    className: "mt-16",
  },
};

/* ------------------------------------------------------------------ */
/*  NoNotesFound                                                       */
/*  Pattern: Empty table state on the notes list page                  */
/*  Source: /notes page                                                */
/* ------------------------------------------------------------------ */

export const NoNotesFound: Story = {
  args: {
    message: "No progress notes found. Create your first note to get started.",
    className: "py-12",
  },
};

/* ------------------------------------------------------------------ */
/*  NoProductsYet                                                      */
/*  Pattern: Empty table row for products list                         */
/*  Source: /products page                                             */
/* ------------------------------------------------------------------ */

export const NoProductsYet: Story = {
  render: () => (
    <div className="rounded-lg border border-border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-4 py-3 text-label-lg text-text-secondary">Name</th>
            <th className="px-4 py-3 text-label-lg text-text-secondary">Price</th>
            <th className="px-4 py-3 text-label-lg text-text-secondary">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3}>
              <EmptyState
                icon={<Package className="h-10 w-10 text-text-secondary" />}
                message="No products found."
                className="py-8"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
