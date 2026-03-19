import type { Meta, StoryObj } from "@storybook/react";
import DataTable, { TableHead, Th, TableBody, Td } from "../DataTable";
import Badge, { statusVariant } from "../Badge";

const meta: Meta<typeof DataTable> = {
  title: "Design System/DataTable",
  component: DataTable,
};

export default meta;
type Story = StoryObj<typeof DataTable>;

const sampleRows = [
  { name: "Sarah Johnson", email: "sarah@example.com", status: "Active" },
  { name: "Michael Chen", email: "michael@example.com", status: "Draft" },
  { name: "Emma Wilson", email: "emma@example.com", status: "Overdue" },
  { name: "James Taylor", email: "james@example.com", status: "Paid" },
];

export const Default: Story = {
  render: () => (
    <DataTable>
      <TableHead>
        <Th>Name</Th>
        <Th>Email</Th>
        <Th align="center">Status</Th>
      </TableHead>
      <TableBody>
        {sampleRows.map((row) => (
          <tr key={row.name} className="hover:bg-gray-50">
            <Td className="font-medium text-text">{row.name}</Td>
            <Td className="text-text-secondary">{row.email}</Td>
            <Td align="center">
              <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
            </Td>
          </tr>
        ))}
      </TableBody>
    </DataTable>
  ),
};

export const WithHiddenColumns: Story = {
  render: () => (
    <DataTable>
      <TableHead>
        <Th>Name</Th>
        <Th hidden="md">Email</Th>
        <Th align="center">Status</Th>
      </TableHead>
      <TableBody>
        {sampleRows.map((row) => (
          <tr key={row.name} className="hover:bg-gray-50">
            <Td className="font-medium text-text">{row.name}</Td>
            <Td hidden="md" className="text-text-secondary">{row.email}</Td>
            <Td align="center">
              <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
            </Td>
          </tr>
        ))}
      </TableBody>
    </DataTable>
  ),
};
