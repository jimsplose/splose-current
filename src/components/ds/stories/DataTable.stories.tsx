"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DataTable, { TableHead, Th, TableBody, Td, Tr, LinkCell, ActionsCell, ExpandableRow } from "../DataTable";
import Pagination from "../Pagination";
import Badge, { statusVariant } from "../Badge";
import ColorDot from "../ColorDot";

const meta: Meta<typeof DataTable> = {
  title: "Data Display/DataTable",
  component: DataTable,
  tags: ["extended"],
  parameters: {
    appPages: [
      {
        label: "Clients list",
        vercel: "https://splose-current.vercel.app/clients",
        localhost: "http://localhost:3000/clients",
        production: "https://acme.splose.com/patients",
      },
      {
        label: "Invoices list",
        vercel: "https://splose-current.vercel.app/invoices",
        localhost: "http://localhost:3000/invoices",
        production: "https://acme.splose.com/invoices",
      },
      {
        label: "Invoice detail",
        vercel: "https://splose-current.vercel.app/invoices/1",
        localhost: "http://localhost:3000/invoices/1",
        production: "https://acme.splose.com/invoices/1/view",
      },
      {
        label: "Waitlist",
        vercel: "https://splose-current.vercel.app/waitlist",
        localhost: "http://localhost:3000/waitlist",
        production: "https://acme.splose.com/waitlist",
      },
    ],
    referenceUrl: "https://ant.design/components/table",
  },
};
export default meta;
type Story = StoryObj<typeof DataTable>;

/* ─── Playground ──────────────────────────────────────────────────────── */

export const Playground: Story = {
  render: () => (
    <DataTable>
      <TableHead>
        <Th>Name</Th>
        <Th>Email</Th>
        <Th align="right">Amount</Th>
      </TableHead>
      <TableBody>
        <Tr>
          <Td>Noah Campbell</Td>
          <Td>noah@example.com</Td>
          <Td align="right">$120.00</Td>
        </Tr>
        <Tr>
          <Td>Matilda Harris</Td>
          <Td>matilda@example.com</Td>
          <Td align="right">$85.50</Td>
        </Tr>
      </TableBody>
    </DataTable>
  ),
};

/* ─── Feature: Sortable Headers ───────────────────────────────────────── */

export const SortableHeaders: Story = {
  render: function SortableHeadersStory() {
    const [sortCol, setSortCol] = useState<string | null>("name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const toggleSort = (col: string) => {
      if (sortCol === col) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortCol(col);
        setSortDir("asc");
      }
    };

    const data = [
      { name: "Noah Campbell", dob: "2001-06-10", email: "noah@example.com" },
      { name: "Matilda Harris", dob: "1973-12-01", email: "matilda@example.com" },
      { name: "Oliver Mitchell", dob: "1985-03-15", email: "oliver@example.com" },
    ];

    const sorted = [...data].sort((a, b) => {
      const key = sortCol as keyof typeof a;
      if (!key) return 0;
      const cmp = a[key].localeCompare(b[key]);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return (
      <DataTable>
        <TableHead>
          <Th sortable sortDirection={sortCol === "name" ? sortDir : null} onSort={() => toggleSort("name")}>Name</Th>
          <Th sortable sortDirection={sortCol === "dob" ? sortDir : null} onSort={() => toggleSort("dob")}>Date of birth</Th>
          <Th>Email</Th>
        </TableHead>
        <TableBody>
          {sorted.map((r) => (
            <Tr key={r.name}>
              <Td><LinkCell>{r.name}</LinkCell></Td>
              <Td>{r.dob}</Td>
              <Td>{r.email}</Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>
    );
  },
};

/* ─── Feature: Clickable Rows with Selection ──────────────────────────── */

export const ClickableRows: Story = {
  render: function ClickableRowsStory() {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <DataTable>
        <TableHead>
          <Th>Appointment</Th>
          <Th>Practitioner</Th>
          <Th>Status</Th>
        </TableHead>
        <TableBody>
          {[
            { id: "1", appt: "Mon 23 Mar, 10:00 am", prac: "Emma Thompson", status: "Scheduled", color: "green" as const },
            { id: "2", appt: "Tue 24 Mar, 2:30 pm", prac: "James Wilson", status: "Completed", color: "blue" as const },
            { id: "3", appt: "Wed 25 Mar, 9:00 am", prac: "Lisa Adams", status: "Cancelled", color: "red" as const },
          ].map((r) => (
            <Tr key={r.id} clickable selected={selected === r.id} onClick={() => setSelected(r.id)}>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ColorDot color={r.color} />
                  {r.appt}
                </div>
              </Td>
              <Td>{r.prac}</Td>
              <Td><Badge variant={statusVariant(r.status)}>{r.status}</Badge></Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>
    );
  },
};

/* ─── Feature: Expandable Rows ────────────────────────────────────────── */

export const ExpandableRows: Story = {
  render: () => (
    <DataTable>
      <TableHead>
        <Th style={{ width: 32 }} />
        <Th>Payment #</Th>
        <Th>From</Th>
        <Th align="right">Amount</Th>
      </TableHead>
      <TableBody>
        <ExpandableRow
          colSpan={4}
          expandContent={
            <div style={{ paddingLeft: 32 }}>
              <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 8 }}>Linked Invoices</p>
              <table style={{ width: '100%', fontSize: 14, lineHeight: 1.57 }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ paddingTop: 8, paddingBottom: 8 }}>INV-0001</td>
                    <td style={{ paddingTop: 8, paddingBottom: 8 }}>$110.00</td>
                    <td style={{ paddingTop: 8, paddingBottom: 8 }}>10 Mar 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          }
        >
          <Td>PAY-0042</Td>
          <Td><LinkCell>Skyler Peterson</LinkCell></Td>
          <Td align="right">$110.00</Td>
        </ExpandableRow>
        <ExpandableRow
          colSpan={4}
          expandContent={
            <div style={{ paddingLeft: 32 }}>
              <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 8 }}>Linked Invoices</p>
              <table style={{ width: '100%', fontSize: 14, lineHeight: 1.57 }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ paddingTop: 8, paddingBottom: 8 }}>INV-0015</td>
                    <td style={{ paddingTop: 8, paddingBottom: 8 }}>$2,000.00</td>
                    <td style={{ paddingTop: 8, paddingBottom: 8 }}>5 Mar 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          }
        >
          <Td>PAY-0041</Td>
          <Td><LinkCell>Alex Anders</LinkCell></Td>
          <Td align="right">$2,000.00</Td>
        </ExpandableRow>
      </TableBody>
    </DataTable>
  ),
};

/* ─── Feature: Actions Column ─────────────────────────────────────────── */

export const WithActionsColumn: Story = {
  render: () => (
    <DataTable>
      <TableHead>
        <Th>Name</Th>
        <Th>Category</Th>
        <Th align="center">Stock</Th>
        <Th align="right">Actions</Th>
      </TableHead>
      <TableBody>
        {[
          { name: "Theraband — Light", cat: "Equipment", stock: 24 },
          { name: "Massage Oil — 500ml", cat: "Supplies", stock: 12 },
          { name: "Exercise Ball — 65cm", cat: "Equipment", stock: 0 },
        ].map((p) => (
          <Tr key={p.name}>
            <Td>{p.name}</Td>
            <Td color="secondary">{p.cat}</Td>
            <Td align="center">{p.stock || "—"}</Td>
            <ActionsCell
              items={[
                { label: "Edit", value: "edit" },
                { label: "Duplicate", value: "duplicate" },
                { label: "Archive", value: "archive", danger: true },
              ]}
            />
          </Tr>
        ))}
      </TableBody>
    </DataTable>
  ),
};

/* ─── Feature: Link Cells ─────────────────────────────────────────────── */

export const WithLinkCells: Story = {
  render: () => (
    <DataTable>
      <TableHead>
        <Th>Client</Th>
        <Th>Phone</Th>
        <Th>Email</Th>
      </TableHead>
      <TableBody>
        <Tr>
          <Td><LinkCell href="/clients/1">Noah Campbell</LinkCell></Td>
          <Td><LinkCell href="tel:0409999000">0409 999 000</LinkCell></Td>
          <Td>noah.campbell@email.com</Td>
        </Tr>
        <Tr>
          <Td><LinkCell href="/clients/2">Matilda Harris</LinkCell></Td>
          <Td><LinkCell href="tel:0408888999">0408 888 999</LinkCell></Td>
          <Td>matilda.harris@email.com</Td>
        </Tr>
      </TableBody>
    </DataTable>
  ),
};

/* ─── Feature: With Pagination ────────────────────────────────────────── */

export const WithPagination: Story = {
  render: function PaginationStory() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    return (
      <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
        <DataTable>
          <TableHead>
            <Th sortable>Name</Th>
            <Th>Email</Th>
            <Th>Tags</Th>
          </TableHead>
          <TableBody>
            <Tr><Td><LinkCell>Noah Campbell</LinkCell></Td><Td>noah@email.com</Td><Td>—</Td></Tr>
            <Tr><Td><LinkCell>Matilda Harris</LinkCell></Td><Td>matilda@email.com</Td><Td><Badge variant="green">Medicare</Badge></Td></Tr>
          </TableBody>
        </DataTable>
        <Pagination
          currentPage={page}
          totalPages={57}
          totalItems={569}
          itemsPerPage={pageSize}
          onPageChange={setPage}
          pageSizeOptions={[10, 25, 50]}
          onPageSizeChange={setPageSize}
        />
      </div>
    );
  },
};

/* ─── Recipe: Full Clients Table ──────────────────────────────────────── */

export const RecipeClientsList: Story = {
  name: "Recipe: Clients List",
  render: function ClientsListRecipe() {
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    return (
      <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
        <DataTable>
          <TableHead>
            <Th sortable sortDirection={sortDir} onSort={() => setSortDir(d => d === "asc" ? "desc" : "asc")} filterable>Name</Th>
            <Th>Date of birth</Th>
            <Th>Phone</Th>
            <Th>Email</Th>
            <Th sortable filterable>Tags</Th>
          </TableHead>
          <TableBody>
            {[
              { name: "Noah Campbell", dob: "10 Jun 2001", phone: "0409 999 000", email: "noah@email.com", tag: null },
              { name: "Matilda Harris", dob: "1 Dec 1973", phone: "0408 888 999", email: "matilda@email.com", tag: "Medicare" },
              { name: "Oliver Mitchell", dob: "15 Mar 1985", phone: "0401 111 222", email: "oliver@email.com", tag: "Medicare" },
              { name: "Charlotte Nguyen", dob: "22 Jul 2019", phone: "0402 222 333", email: "charlotte@email.com", tag: "NDIS" },
            ].map((c) => (
              <Tr key={c.name}>
                <Td><LinkCell>{c.name}</LinkCell></Td>
                <Td>{c.dob}</Td>
                <Td><LinkCell href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</LinkCell></Td>
                <Td color="secondary">{c.email}</Td>
                <Td>{c.tag && <Badge variant={c.tag === "Medicare" ? "green" : "purple"}>{c.tag}</Badge>}</Td>
              </Tr>
            ))}
          </TableBody>
        </DataTable>
        <Pagination currentPage={1} totalPages={57} totalItems={569} itemsPerPage={10} pageSizeOptions={[10, 25, 50]} onPageSizeChange={() => {}} />
      </div>
    );
  },
};

/* ─── Recipe: Appointments Table (click + select + status) ────────────── */

/* ─── Td color variants ────────────────────────────────────────────────── */

export const TdColors: Story = {
  name: "Td: color variants",
  render: () => (
    <DataTable>
      <TableHead>
        <Th>Variant</Th>
        <Th>Sample text</Th>
      </TableHead>
      <TableBody>
        <Tr><Td>default (omitted)</Td><Td>The quick brown fox</Td></Tr>
        <Tr><Td>default</Td><Td color="default">The quick brown fox</Td></Tr>
        <Tr><Td>secondary</Td><Td color="secondary">The quick brown fox</Td></Tr>
        <Tr><Td>tertiary</Td><Td color="tertiary">The quick brown fox</Td></Tr>
        <Tr><Td>primary</Td><Td color="primary">The quick brown fox</Td></Tr>
        <Tr><Td>danger</Td><Td color="danger">The quick brown fox</Td></Tr>
        <Tr><Td>success</Td><Td color="success">The quick brown fox</Td></Tr>
        <Tr><Td>warning</Td><Td color="warning">The quick brown fox</Td></Tr>
      </TableBody>
    </DataTable>
  ),
};

export const RecipeAppointments: Story = {
  name: "Recipe: Appointments",
  render: function AppointmentsRecipe() {
    const [selected, setSelected] = useState<string | null>("1");
    return (
      <DataTable>
        <TableHead>
          <Th sortable sortDirection="desc" onSort={() => {}}>When</Th>
          <Th>Where</Th>
          <Th>Type</Th>
          <Th>Practitioner</Th>
          <Th>Invoice status</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {[
            { id: "1", when: "Sat 7 Feb 2026, 1:30 pm", where: "East Clinics", type: "Standard", prac: "Emma T.", status: "Draft", color: "green" as const },
            { id: "2", when: "Fri 6 Feb 2026, 10:00 am", where: "East Clinics", type: "Initial Assessment", prac: "James W.", status: "Paid", color: "blue" as const },
            { id: "3", when: "Thu 5 Feb 2026, 2:00 pm", where: "West Clinics", type: "Follow Up", prac: "Lisa A.", status: "Do not invoice", color: "gray" as const },
          ].map((a) => (
            <Tr key={a.id} clickable selected={selected === a.id} onClick={() => setSelected(a.id)}>
              <Td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ColorDot color={a.color} />{a.when}</div></Td>
              <Td>{a.where}</Td>
              <Td>{a.type}</Td>
              <Td>{a.prac}</Td>
              <Td><Badge variant={statusVariant(a.status)}>{a.status}</Badge></Td>
              <ActionsCell items={[
                { label: "Edit", value: "edit" },
                { label: "Reschedule", value: "reschedule" },
                { label: "Cancel", value: "cancel", danger: true },
              ]} />
            </Tr>
          ))}
        </TableBody>
      </DataTable>
    );
  },
};
