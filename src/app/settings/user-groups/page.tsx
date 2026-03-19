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
  Pagination,
} from "@/components/ds";
import { BookOpen, ArrowUpDown, MoreHorizontal } from "lucide-react";

const userGroups = [
  { name: "Intake team", users: 3 },
  { name: "OT", users: 7 },
  { name: "Physio", users: 7 },
];

export default function UserGroupsPage() {
  const [search, setSearch] = useState("");
  const filtered = userGroups.filter(
    (g) => !search || g.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6">
      <PageHeader title="User groups">
        <Button variant="secondary">
          <BookOpen className="h-4 w-4" />
          Learn
        </Button>
        <Button variant="primary">+ New group</Button>
      </PageHeader>

      <SearchBar
        placeholder="Search for group name"
        onSearch={(q) => setSearch(q)}
      />

      <DataTable>
        <TableHead>
          <Th>
            <span className="inline-flex items-center gap-1">
              Name
              <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
            </span>
          </Th>
          <Th>Users</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {filtered.map((group) => (
            <tr key={group.name} className="hover:bg-gray-50">
              <Td className="text-text">{group.name}</Td>
              <Td>{group.users}</Td>
              <Td align="right">
                <button className="rounded p-1 text-text-secondary hover:bg-gray-100 hover:text-text">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination
        currentPage={1}
        totalPages={1}
        totalItems={filtered.length}
        itemsPerPage={10}
      />
    </div>
  );
}
