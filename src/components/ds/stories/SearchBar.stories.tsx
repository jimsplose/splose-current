import type { Meta, StoryObj } from "@storybook/react";
import SearchBar from "../SearchBar";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof SearchBar> = {
  title: "Forms/SearchBar",
  component: SearchBar,
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the input",
    },
    defaultValue: {
      control: "text",
      description: "Pre-filled search query",
    },
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    placeholder: "Search...",
    defaultValue: "",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: { placeholder: "Search..." },
};

export const WithPlaceholder: Story = {
  args: { placeholder: "Search for name, phone number, and email" },
};

export const CustomWidth: Story = {
  render: () => (
    <div className="w-[320px]">
      <SearchBar placeholder="Search..." />
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  ClientsSearch                                                      */
/*  Pattern: Full-width search with client-specific placeholder        */
/*  Source: /clients ClientsPageClient                                 */
/* ------------------------------------------------------------------ */

export const ClientsSearch: Story = {
  args: { placeholder: "Search for name, phone number, and email" },
};

/* ------------------------------------------------------------------ */
/*  InvoicesSearch                                                     */
/*  Pattern: Search for payments/invoices by recipient and number      */
/*  Source: /payments page                                             */
/* ------------------------------------------------------------------ */

export const InvoicesSearch: Story = {
  args: { placeholder: "Search for recipient name and payment number" },
};

/* ------------------------------------------------------------------ */
/*  NotesSearch                                                        */
/*  Pattern: Search notes by content and title                         */
/*  Source: /notes page                                                */
/* ------------------------------------------------------------------ */

export const NotesSearch: Story = {
  args: { placeholder: "Search for content and title" },
};
