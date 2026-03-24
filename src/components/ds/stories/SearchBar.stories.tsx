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

/* ------------------------------------------------------------------ */
/*  ContactsSearch                                                     */
/*  Pattern: Contact list search with compound placeholder             */
/*  Source: /contacts page                                             */
/* ------------------------------------------------------------------ */

export const ContactsSearch: Story = {
  args: { placeholder: "Search for contact name, phone number, email and company name" },
};

/* ------------------------------------------------------------------ */
/*  ProductsSearchWithDefault                                          */
/*  Pattern: Pre-filled search with existing query and onSearch        */
/*  Source: /products page — searchable product list with state        */
/* ------------------------------------------------------------------ */

export const ProductsSearchWithDefault: Story = {
  args: {
    placeholder: "Search for product by name",
    defaultValue: "Theraband",
  },
};

/* ------------------------------------------------------------------ */
/*  SettingsServicesSearch                                              */
/*  Pattern: Settings list search with service-specific placeholder    */
/*  Source: /settings/services page                                    */
/* ------------------------------------------------------------------ */

export const SettingsServicesSearch: Story = {
  args: { placeholder: "Search for service name, type, and item code" },
};

/* ------------------------------------------------------------------ */
/*  ClientFilesSearch                                                  */
/*  Pattern: Simple short placeholder for client sub-tab files list    */
/*  Source: /clients/[id]/files page                                   */
/* ------------------------------------------------------------------ */

export const ClientFilesSearch: Story = {
  args: { placeholder: "Search for file name" },
};
