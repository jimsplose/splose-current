import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "../Pagination";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Pagination> = {
  title: "Navigation/Pagination",
  component: Pagination,
  argTypes: {
    currentPage: {
      control: { type: "number", min: 1 },
      description: "Active page number (1-based)",
    },
    totalPages: {
      control: { type: "number", min: 1 },
      description: "Total number of pages",
    },
    totalItems: {
      control: "number",
      description: "Total number of rows (displayed in the item range label)",
    },
    itemsPerPage: {
      control: { type: "number", min: 1 },
      description: "Number of rows per page",
    },
    showPageSize: {
      control: "boolean",
      description: "Show the page size indicator or selector",
    },
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    showPageSize: true,
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: { currentPage: 1, totalPages: 5, totalItems: 48, itemsPerPage: 10 },
};

export const ManyPages: Story = {
  args: { currentPage: 5, totalPages: 20, totalItems: 200, itemsPerPage: 10 },
};

export const WithPageSize: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    totalItems: 48,
    itemsPerPage: 10,
    showPageSize: true,
    pageSizeOptions: [10, 25, 50, 100],
  },
};

export const FewItems: Story = {
  args: { currentPage: 1, totalPages: 1, totalItems: 7, itemsPerPage: 10 },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  ClientsPagination                                                  */
/*  Pattern: Large dataset with many pages and ellipsis                */
/*  Source: /clients page — 569 clients, 57 pages                      */
/* ------------------------------------------------------------------ */

export const ClientsPagination: Story = {
  args: {
    currentPage: 1,
    totalPages: 57,
    totalItems: 569,
    itemsPerPage: 10,
  },
};

/* ------------------------------------------------------------------ */
/*  SettingsPagination                                                 */
/*  Pattern: Small settings list with few pages                        */
/*  Source: /settings/letter-templates — small list                     */
/* ------------------------------------------------------------------ */

export const SettingsPagination: Story = {
  args: {
    currentPage: 1,
    totalPages: 2,
    totalItems: 15,
    itemsPerPage: 10,
  },
};

/* ------------------------------------------------------------------ */
/*  ContactsPagination                                                 */
/*  Pattern: Medium dataset with 13 pages of contacts                  */
/*  Source: /contacts page — 126 contacts, 13 pages                    */
/* ------------------------------------------------------------------ */

export const ContactsPagination: Story = {
  args: {
    currentPage: 1,
    totalPages: 13,
    totalItems: 126,
    itemsPerPage: 10,
  },
};

/* ------------------------------------------------------------------ */
/*  PaymentsPagination                                                 */
/*  Pattern: Large payment history with 61 pages and ellipsis          */
/*  Source: /payments page — 608 payments, 61 pages                    */
/* ------------------------------------------------------------------ */

export const PaymentsPagination: Story = {
  args: {
    currentPage: 1,
    totalPages: 61,
    totalItems: 608,
    itemsPerPage: 10,
  },
};

/* ------------------------------------------------------------------ */
/*  ProductsPaginationInteractive                                      */
/*  Pattern: Interactive pagination with page change handler           */
/*  Source: /products page — paginated with onPageChange callback      */
/* ------------------------------------------------------------------ */

export const ProductsPaginationInteractive: Story = {
  args: {
    currentPage: 3,
    totalPages: 8,
    totalItems: 74,
    itemsPerPage: 10,
  },
};

/* ------------------------------------------------------------------ */
/*  SinglePagePagination                                               */
/*  Pattern: Minimal pagination for small datasets that fit one page   */
/*  Source: /clients/[id]/communications — 7 items, single page        */
/* ------------------------------------------------------------------ */

export const SinglePagePagination: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 7,
    itemsPerPage: 10,
  },
};
