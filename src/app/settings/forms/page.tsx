"use client";

import { useState } from "react";
import {
  Button,
  PageHeader,
  SearchBar,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Badge,
  EmptyState,
} from "@/components/ds";
import { ChevronDown, MoreHorizontal } from "lucide-react";

const formTemplates = [
  { title: "(Copy of) Test form saved in A jr", formType: "Embeddable form", published: false, createdAt: "6 Mar 2026", updatedAt: "6 Mar 2026" },
  { title: "Test form saved in A jr", formType: "Embeddable form", published: true, createdAt: "27 Feb 2026", updatedAt: "6 Mar 2026" },
  { title: "FORM FILE UPLOADS", formType: "Standard form", published: false, createdAt: "27 Feb 2026", updatedAt: "13 Mar 2026" },
  { title: "test 1 2 3", formType: "Standard form", published: false, createdAt: "9 Feb 2026", updatedAt: "9 Feb 2026" },
  { title: "Service agreement - Sharon", formType: "Standard form", published: false, createdAt: "5 Feb 2026", updatedAt: "5 Feb 2026" },
  { title: "Test EMB", formType: "Embeddable form", published: true, createdAt: "29 Jan 2026", updatedAt: "16 Feb 2026" },
  { title: "TESTTESTTEST", formType: "Standard form", published: false, createdAt: "2 Jan 2026", updatedAt: "16 Jan 2026" },
  { title: "Intake Form", formType: "Embeddable form", published: true, createdAt: "22 Dec 2025", updatedAt: "23 Jan 2026" },
];

export default function FormsPage() {
  const [search, setSearch] = useState("");
  const filtered = formTemplates.filter((f) => {
    if (search && !f.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6">
      <PageHeader title="Form templates">
        <Button variant="secondary">
          <span className="flex items-center gap-1">Learn <ChevronDown className="h-4 w-4" /></span>
        </Button>
        <Button variant="secondary">Show archived</Button>
        <Button variant="primary">+ New template</Button>
      </PageHeader>

      <SearchBar
        placeholder="Search for title"
        onSearch={(q) => setSearch(q)}
      />

      <DataTable>
        <TableHead>
          <Th>Title</Th>
          <Th>Form type</Th>
          <Th>Created at</Th>
          <Th>Updated at</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {filtered.map((form) => (
            <tr key={form.title} className="hover:bg-gray-50">
              <Td className="text-text">{form.title}</Td>
              <Td>
                <span className="flex items-center gap-2">
                  {form.formType}
                  {form.published && <Badge variant="green">Published</Badge>}
                </span>
              </Td>
              <Td>{form.createdAt}</Td>
              <Td>{form.updatedAt}</Td>
              <Td align="right">
                <button className="rounded p-1 text-text-secondary hover:bg-gray-100 hover:text-text">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      {filtered.length === 0 && <EmptyState message="No form templates found" className="py-8" />}
    </div>
  );
}
