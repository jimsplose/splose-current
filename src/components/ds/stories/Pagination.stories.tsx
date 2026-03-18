import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "../Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Design System/Pagination",
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const FirstPage: Story = {
  args: { currentPage: 1, totalPages: 5, totalItems: 48, itemsPerPage: 10 },
};

export const MiddlePage: Story = {
  args: { currentPage: 3, totalPages: 5, totalItems: 48, itemsPerPage: 10 },
};

export const ManyPages: Story = {
  args: { currentPage: 5, totalPages: 20, totalItems: 200, itemsPerPage: 10 },
};

export const SinglePage: Story = {
  args: { currentPage: 1, totalPages: 1, totalItems: 7, itemsPerPage: 10 },
};
