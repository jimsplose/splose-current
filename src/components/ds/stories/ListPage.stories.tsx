import type { Meta, StoryObj } from "@storybook/react";
import { PlusOutlined } from "@ant-design/icons";
import ListPage from "../ListPage";
import { Button } from "antd";
import DataTable from "../DataTable";
import { TableHead, Th, TableBody, Td } from "../DataTable";
import Pagination from "../Pagination";
import Badge, { statusVariant } from "../Badge";

const meta: Meta<typeof ListPage> = {
  title: "Templates/ListPage",
  component: ListPage,
  tags: ["extended"],
  parameters: {
    layout: "fullscreen",
    appPages: [
      {
        label: "/clients",
        vercel: "https://splose-current.vercel.app/clients",
        localhost: "http://localhost:3000/clients",
        production: "https://acme.splose.com/patients",
      },
      {
        label: "/invoices",
        vercel: "https://splose-current.vercel.app/invoices",
        localhost: "http://localhost:3000/invoices",
        production: "https://acme.splose.com/invoices",
      },
      {
        label: "/payments",
        vercel: "https://splose-current.vercel.app/payments",
        localhost: "http://localhost:3000/payments",
        production: "https://acme.splose.com/payments",
      },
      {
        label: "/contacts",
        vercel: "https://splose-current.vercel.app/contacts",
        localhost: "http://localhost:3000/contacts",
        production: "https://acme.splose.com/contacts",
      },
    ],
    referenceUrl: null,
  },
};

export default meta;
type Story = StoryObj<typeof ListPage>;

export const Playground: Story = {
  args: {
    title: "Contacts",
    searchPlaceholder: "Search contacts...",
    actions: (
      <Button variant="primary">
        <PlusOutlined style={{ fontSize: 16 }} /> New contact
      </Button>
    ),
    children: (
      <>
        <DataTable>
          <TableHead>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
          </TableHead>
          <TableBody>
            <tr><Td>Dr Sarah Mitchell</Td><Td>s.mitchell@rah.sa.gov.au</Td><Td>(08) 7074 0000</Td></tr>
            <tr><Td>Dr James Nguyen</Td><Td>j.nguyen@woodlake.com.au</Td><Td>(08) 8234 5678</Td></tr>
            <tr><Td>Laura Bennett</Td><Td>laura.b@myplanmanager.com.au</Td><Td>(08) 7200 3400</Td></tr>
          </TableBody>
        </DataTable>
        <Pagination currentPage={1} totalPages={3} totalItems={25} itemsPerPage={10} onPageChange={() => {}} />
      </>
    ),
  },
};

/*  Source: /invoices — list page with filter chips and status badges  */
export const InvoiceListRecipe: Story = {
  name: "Recipe: Invoice List",
  render: () => (
    <ListPage
      title="Invoices"
      searchPlaceholder="Search invoices..."
      actions={<Button variant="primary"><PlusOutlined style={{ fontSize: 16 }} /> New invoice</Button>}
      filters={
        <>
          <Badge shape="pill" variant="blue" onRemove={() => {}}>Location: East Clinics</Badge>
          <Badge shape="pill" variant="green" onRemove={() => {}}>Status: Paid</Badge>
        </>
      }
    >
      <DataTable>
        <TableHead>
          <Th>Invoice #</Th>
          <Th>Client</Th>
          <Th align="right">Amount</Th>
          <Th>Status</Th>
        </TableHead>
        <TableBody>
          <tr><Td>INV-006312</Td><Td>Sarah Mitchell</Td><Td align="right">$185.00</Td><Td><Badge variant={statusVariant("Paid")}>Paid</Badge></Td></tr>
          <tr><Td>INV-006311</Td><Td>James Park</Td><Td align="right">$95.50</Td><Td><Badge variant={statusVariant("Overdue")}>Overdue</Badge></Td></tr>
          <tr><Td>INV-006310</Td><Td>Lisa Wang</Td><Td align="right">$220.00</Td><Td><Badge variant={statusVariant("Draft")}>Draft</Badge></Td></tr>
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={5} totalItems={48} itemsPerPage={10} onPageChange={() => {}} />
    </ListPage>
  ),
};
