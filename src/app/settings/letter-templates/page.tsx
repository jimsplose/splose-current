"use client";

import {
  Button,
  PageHeader,
  SearchBar,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Pagination,
  Dropdown,
  DropdownTriggerButton,
} from "@/components/ds";

const templates = [
  {
    title: "Chronic Disease Management plan first appointment",
    createdAt: "4:44 pm, 6 Oct 2020",
    lastUpdated: "12:17 pm, 6 Feb 2026",
  },
  {
    title: "Chronic Disease Management plan last appointment",
    createdAt: "4:44 pm, 6 Oct 2020",
    lastUpdated: "12:50 pm, 8 Nov 2021",
  },
  {
    title: "DVA",
    createdAt: "10:54 am, 15 Aug 2023",
    lastUpdated: "10:54 am, 15 Aug 2023",
  },
  {
    title: "Test 123 contact",
    createdAt: "4:36 pm, 4 Jun 2024",
    lastUpdated: "11:41 am, 3 Mar 2026",
  },
  {
    title: "Case note",
    createdAt: "2:05 pm, 14 Jun 2024",
    lastUpdated: "2:05 pm, 14 Jun 2024",
  },
  {
    title: "Case hours",
    createdAt: "10:32 am, 23 Aug 2024",
    lastUpdated: "10:32 am, 23 Aug 2024",
  },
  {
    title: "Test",
    createdAt: "2:39 pm, 27 May 2025",
    lastUpdated: "2:29 pm, 4 Jun 2025",
  },
];

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
];

export default function LetterTemplatesPage() {
  return (
    <div className="p-6">
      <PageHeader title="Letter templates">
        <Button variant="secondary">Show archived</Button>
        <Button variant="primary">+ New template</Button>
      </PageHeader>

      <SearchBar placeholder="Search for title" />

      <DataTable>
        <TableHead>
          <Th>Title</Th>
          <Th>Created at</Th>
          <Th>Last updated</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {templates.map((t) => (
            <tr key={t.title} className="hover:bg-gray-50">
              <Td className="text-text">{t.title}</Td>
              <Td>{t.createdAt}</Td>
              <Td>{t.lastUpdated}</Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={dropdownItems}
                  onSelect={() => {}}
                />
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination
        currentPage={1}
        totalPages={1}
        totalItems={templates.length}
        itemsPerPage={10}
        showPageSize={false}
      />
    </div>
  );
}
