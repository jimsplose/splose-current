"use client";

import { useState } from "react";
import { Plus, ArrowUpDown, Filter, Settings, Download, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ds/Button";
import PageHeader from "@/components/ds/PageHeader";
import SearchBar from "@/components/ds/SearchBar";
import DataTable, { TableHead, Th, TableBody, Tr, Td } from "@/components/ds/DataTable";
import Pagination from "@/components/ds/Pagination";
import Badge, { statusVariant } from "@/components/ds/Badge";
import FormInput from "@/components/ds/FormInput";
import FormSelect from "@/components/ds/FormSelect";
import Tab from "@/components/ds/Tab";
import Card from "@/components/ds/Card";

const pages = [
  { name: "Dashboard", href: "/", desc: "Messages + Income chart + Notes + Forms" },
  { name: "Calendar", href: "/calendar", desc: "Week/Month/Day views, appointments" },
  { name: "Clients", href: "/clients", desc: "Client list with search and tags" },
  {
    name: "Client Detail",
    href: "/clients/cm8jq0txx0003txh68tl46ehn",
    desc: "Details, appointments, notes, invoices, etc.",
  },
  { name: "Contacts", href: "/contacts", desc: "Contact list with type, company, email" },
  { name: "Contact Detail", href: "/contacts/1", desc: "Contact details, cases, letters, invoices" },
  { name: "Waitlist", href: "/waitlist", desc: "Screener + Waitlist with map view" },
  { name: "Invoices", href: "/invoices", desc: "Invoice list with status badges" },
  { name: "Payments", href: "/payments", desc: "Payment list with expandable rows" },
  { name: "New Payment", href: "/payments/new", desc: "Payment form with linked invoices" },
  { name: "Notes", href: "/notes", desc: "Progress notes list" },
  { name: "Note Edit", href: "/notes/new", desc: "New note with template selection" },
  { name: "Reports", href: "/reports", desc: "Performance overview with charts" },
  { name: "Reports - Appointments", href: "/reports/appointments", desc: "Appointment report with filters" },
  { name: "Reports - Progress Notes", href: "/reports/progress-notes", desc: "Notes report with pie charts" },
  { name: "Products", href: "/products", desc: "Product catalog" },
  { name: "Practitioners", href: "/practitioners", desc: "Practitioner cards" },
  { name: "Settings", href: "/settings", desc: "25 settings sub-pages" },
  { name: "Settings AI", href: "/settings/ai", desc: "AI preferences, prompts, block library" },
  { name: "Login", href: "/login", desc: "Login form with hand illustration" },
];

export default function EngPage() {
  const [tab, setTab] = useState<"components" | "pages">("components");

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="text-display-lg text-text">Eng Toolkit</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Design system components and page directory. Internal use only.
        </p>
      </div>

      <Tab
        items={[
          { label: "Components", value: "components" },
          { label: `Pages (${pages.length})`, value: "pages" },
        ]}
        value={tab}
        onChange={(v) => setTab(v as "components" | "pages")}
      />

      {tab === "components" && <ComponentShowcase />}
      {tab === "pages" && <PageDirectory />}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="mb-1 text-heading-lg text-text">{title}</h2>
      <div className="mb-4 h-px bg-border" />
      {children}
    </div>
  );
}

function ComponentShowcase() {
  return (
    <>
      {/* Buttons */}
      <Section title="Button">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="md">
              Medium
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary">
              <Plus className="h-4 w-4" /> New item
            </Button>
            <Button variant="secondary">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button variant="secondary">
              <Settings className="h-4 w-4" /> Settings
            </Button>
            <Button variant="primary">
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            <Button variant="danger">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
          <pre className="overflow-x-auto rounded bg-gray-50 p-3 text-xs text-text-secondary">
            {`import { Button } from "@/components/ds";

<Button variant="primary">Save</Button>
<Button variant="secondary"><Plus /> New item</Button>
<Button variant="danger" size="sm">Delete</Button>`}
          </pre>
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badge">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="green">Active</Badge>
          <Badge variant="green">Paid</Badge>
          <Badge variant="blue">Draft</Badge>
          <Badge variant="yellow">Outstanding</Badge>
          <Badge variant="red">Overdue</Badge>
          <Badge variant="red">Cancelled</Badge>
          <Badge variant="orange">Archived</Badge>
          <Badge variant="gray">Expired</Badge>
          <Badge variant="purple">NDIS</Badge>
        </div>
        <p className="mb-2 text-xs text-text-secondary">
          Use <code className="rounded bg-gray-100 px-1">statusVariant(status)</code> for automatic color mapping:
        </p>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {["Active", "Paid", "Draft", "Outstanding", "Overdue", "Cancelled", "Archived", "Expired"].map((s) => (
            <Badge key={s} variant={statusVariant(s)}>
              {s}
            </Badge>
          ))}
        </div>
        <pre className="overflow-x-auto rounded bg-gray-50 p-3 text-xs text-text-secondary">
          {`import { Badge, statusVariant } from "@/components/ds";

<Badge variant="green">Active</Badge>
<Badge variant={statusVariant(invoice.status)}>{invoice.status}</Badge>`}
        </pre>
      </Section>

      {/* PageHeader */}
      <Section title="PageHeader">
        <Card padding="md" className="mb-3">
          <PageHeader title="Clients">
            <Button variant="secondary">
              <Plus className="h-4 w-4" /> New client
            </Button>
          </PageHeader>
        </Card>
        <pre className="overflow-x-auto rounded bg-gray-50 p-3 text-xs text-text-secondary">
          {`import { PageHeader, Button } from "@/components/ds";

<PageHeader title="Clients">
  <Button><Plus /> New client</Button>
</PageHeader>`}
        </pre>
      </Section>

      {/* SearchBar */}
      <Section title="SearchBar">
        <Card padding="md" className="mb-3">
          <SearchBar placeholder="Search for name, phone number, and email" />
        </Card>
        <pre className="overflow-x-auto rounded bg-gray-50 p-3 text-xs text-text-secondary">
          {`import { SearchBar } from "@/components/ds";

<SearchBar placeholder="Search..." onSearch={(q) => console.log(q)} />`}
        </pre>
      </Section>

      {/* DataTable + Pagination */}
      <Section title="DataTable + Pagination">
        <div className="mb-3 overflow-hidden rounded-lg border border-border">
          <DataTable>
            <TableHead>
              <Th>
                <div className="flex items-center gap-1">
                  Name <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                </div>
              </Th>
              <Th>Email</Th>
              <Th hidden="md">
                <div className="flex items-center gap-1">
                  Tags <Filter className="h-3 w-3 text-text-secondary" />
                </div>
              </Th>
              <Th align="right">Status</Th>
            </TableHead>
            <TableBody>
              {[
                { name: "Skyler Peterson", email: "skyler@example.com", tag: "Company A", status: "Active" },
                { name: "Alex Anders", email: "alex@example.com", tag: "NDIS", status: "Draft" },
                { name: "Elsa Frozen", email: "elsa@example.com", tag: "", status: "Archived" },
              ].map((row) => (
                <Tr key={row.name}>
                  <Td className="font-medium text-primary">{row.name}</Td>
                  <Td className="text-text-secondary">{row.email}</Td>
                  <Td hidden="md">{row.tag && <Badge variant="yellow">{row.tag}</Badge>}</Td>
                  <Td align="right">
                    <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                  </Td>
                </Tr>
              ))}
            </TableBody>
          </DataTable>
          <Pagination currentPage={1} totalPages={5} totalItems={48} />
        </div>
        <pre className="overflow-x-auto rounded bg-gray-50 p-3 text-xs text-text-secondary">
          {`import { DataTable, TableHead, Th, TableBody, Td, Pagination, Badge } from "@/components/ds";

<DataTable>
  <TableHead>
    <Th>Name</Th>
    <Th hidden="md">Email</Th>
    <Th align="right">Status</Th>
  </TableHead>
  <TableBody>
    <tr><Td>Skyler</Td><Td hidden="md">skyler@ex.com</Td><Td align="right"><Badge>Active</Badge></Td></tr>
  </TableBody>
</DataTable>
<Pagination currentPage={1} totalPages={5} totalItems={48} />`}
        </pre>
      </Section>

      {/* Form Inputs */}
      <Section title="FormInput + FormSelect">
        <Card padding="md" className="mb-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput label="Email" type="email" placeholder="name@example.com" />
            <FormInput label="Password" type="password" placeholder="Enter password" />
            <FormInput label="With error" error="This field is required" defaultValue="" />
            <FormSelect
              label="Status"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "archived", label: "Archived" },
              ]}
            />
          </div>
        </Card>
        <pre className="overflow-x-auto rounded bg-gray-50 p-3 text-xs text-text-secondary">
          {`import { FormInput, FormSelect } from "@/components/ds";

<FormInput label="Email" type="email" placeholder="name@example.com" />
<FormInput label="Name" error="Required" />
<FormSelect label="Status" options={[{ value: "active", label: "Active" }]} />`}
        </pre>
      </Section>
    </>
  );
}

function PageDirectory() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {pages.map((page) => (
        <Link
          key={page.href}
          href={page.href}
          className="block rounded-lg border border-border p-4 transition-colors hover:border-primary hover:bg-surface-header"
        >
          <h3 className="text-heading-sm text-text">{page.name}</h3>
          <p className="mt-1 text-xs text-text-secondary">{page.desc}</p>
          <p className="mt-2 font-mono text-caption-sm text-primary">{page.href}</p>
        </Link>
      ))}
    </div>
  );
}
