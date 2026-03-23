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
  Tr,
  Td,
  Pagination,
  Dropdown,
  DropdownTriggerButton,
  Modal,
  FormInput,
} from "@/components/ds";
import { useFormModal } from "@/hooks/useFormModal";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";
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

export default function UserGroupsPage() {
  const [groups, setGroups] = useState(initialGroups);
  const [search, setSearch] = useState("");

  const { modalOpen, isEditing, form, setField, openCreate, openEdit, closeModal, handleSave } = useFormModal<{
    name: string;
  }>({
    defaults: { name: "" },
    onSave: (values, editingIndex) => {
      if (editingIndex !== null) {
        setGroups((prev) => prev.map((g, i) => (i === editingIndex ? { ...g, name: values.name } : g)));
      } else {
        setGroups((prev) => [...prev, { name: values.name, users: 0 }]);
      }
    },
  });

  const filtered = groups.filter(
    (g) => !search || g.name.toLowerCase().includes(search.toLowerCase()),
  );

  function handleAction(value: string, index: number) {
    if (value === "edit") {
      openEdit(index, { name: groups[index].name });
    }
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
            <Tr key={group.name}>
              <Td className="text-text">{group.name}</Td>
              <Td>{group.users}</Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={STANDARD_SETTINGS}
                  onSelect={(value) => handleAction(value, groups.indexOf(group))}
                />
              </Td>
            </Tr>
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
        onClose={closeModal}
        title={isEditing ? "Edit user group" : "New user group"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
