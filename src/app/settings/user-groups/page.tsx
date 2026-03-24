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
  usePagination,
} from "@/components/ds";
import { useFormModal } from "@/hooks/useFormModal";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";
import { BookOpen, ArrowUpDown, Check } from "lucide-react";

const MOCK_USERS = [
  "Sophie Anderson",
  "James Wilson",
  "Priya Sharma",
  "Daniel O'Brien",
  "Sarah Chen",
  "Harry Nguyen",
];

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
    selectedUsers: string[];
  }>({
    defaults: { name: "", selectedUsers: [] },
    onSave: (values, editingIndex) => {
      if (editingIndex !== null) {
        setGroups((prev) =>
          prev.map((g, i) => (i === editingIndex ? { ...g, name: values.name, users: values.selectedUsers.length } : g)),
        );
      } else {
        setGroups((prev) => [...prev, { name: values.name, users: values.selectedUsers.length }]);
      }
    },
  });

  function toggleUser(userName: string) {
    const current = form.selectedUsers;
    if (current.includes(userName)) {
      setField("selectedUsers", current.filter((u) => u !== userName));
    } else {
      setField("selectedUsers", [...current, userName]);
    }
  }

  const filtered = groups.filter(
    (g) => !search || g.name.toLowerCase().includes(search.toLowerCase()),
  );

  const { paged, paginationProps } = usePagination(filtered, { pageKey: "/settings/user-groups" });

  function handleAction(value: string, index: number) {
    if (value === "edit") {
      openEdit(index, { name: groups[index].name, selectedUsers: [] });
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
          {paged.map((group) => (
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

      <Pagination {...paginationProps} />
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

        <div className="mt-6 border-t border-border pt-6">
          <h3 className="text-heading-md text-text mb-3">Users</h3>
          <div className="space-y-1">
            {MOCK_USERS.map((user) => {
              const isSelected = form.selectedUsers.includes(user);
              return (
                <label
                  key={user}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-secondary"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      isSelected ? "border-primary bg-primary" : "border-border bg-white"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => toggleUser(user)}
                  />
                  <span className="text-body-md text-text">{user}</span>
                </label>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
