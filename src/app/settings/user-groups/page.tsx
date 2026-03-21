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
  Dropdown,
  DropdownTriggerButton,
  Modal,
  FormInput,
} from "@/components/ds";
import { BookOpen, ArrowUpDown } from "lucide-react";

interface UserGroup {
  name: string;
  users: number;
}

const initialGroups: UserGroup[] = [
  { name: "Intake team", users: 3 },
  { name: "OT", users: 7 },
  { name: "Physio", users: 7 },
];

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
];

export default function UserGroupsPage() {
  const [groups, setGroups] = useState(initialGroups);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const filtered = groups.filter(
    (g) => !search || g.name.toLowerCase().includes(search.toLowerCase()),
  );

  function openCreate() {
    setEditingIndex(null);
    setFormName("");
    setModalOpen(true);
  }

  function openEdit(index: number) {
    setEditingIndex(index);
    setFormName(groups[index].name);
    setModalOpen(true);
  }

  function handleSave() {
    if (editingIndex !== null) {
      setGroups((prev) => prev.map((g, i) => (i === editingIndex ? { ...g, name: formName } : g)));
    } else {
      setGroups((prev) => [...prev, { name: formName, users: 0 }]);
    }
    setModalOpen(false);
  }

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index);
  }

  return (
    <div className="p-6">
      <PageHeader title="User groups">
        <Button variant="secondary">
          <BookOpen className="h-4 w-4" />
          Learn
        </Button>
        <Button variant="primary" onClick={openCreate}>+ New group</Button>
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
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={dropdownItems}
                  onSelect={(value) => handleAction(value, groups.indexOf(group))}
                />
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
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIndex !== null ? "Edit user group" : "New user group"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
