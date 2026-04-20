"use client";

import { useState } from "react";
import { Flex } from "antd";
import { ReadOutlined, SwapOutlined, CheckOutlined } from "@ant-design/icons";
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
  Divider,
} from "@/components/ds";
import { useFormModal } from "@/hooks/useFormModal";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";

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

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function handleAction(value: string, index: number) {
    if (value === "edit") {
      openEdit(index, { name: groups[index].name, selectedUsers: [] });
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="User groups">
        <Button variant="secondary">
          <ReadOutlined style={{ fontSize: 16 }} />
          Learn
        </Button>
        <Button variant="secondary" onClick={openCreate}>+ New group</Button>
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
              <SwapOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
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

      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} />
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit user group" : "New user group"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{isEditing ? "Edit" : "Create"}</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Name *" value={form.name} onChange={(e) => setField("name", e.target.value)} />
        </Flex>

        <Divider spacing="none" className="mt-6" />
        <div className="pt-6">
          <h3 className="mb-3 text-heading-md text-text">Users</h3>
          <Flex vertical gap={4}>
            {MOCK_USERS.map((user) => {
              const isSelected = form.selectedUsers.includes(user);
              return (
                <Flex
                  component="label"
                  key={user}
                  align="center"
                  gap={12}
                  className="cursor-pointer"
                  style={{ borderRadius: 8, padding: '8px 12px' }}
                >
                  <Flex
                    component="span"
                    align="center"
                    justify="center"
                    style={{
                      height: 20, width: 20, flexShrink: 0, borderRadius: 4,
                      border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      backgroundColor: isSelected ? 'var(--color-primary)' : 'white',
                    }}
                  >
                    {isSelected && <CheckOutlined style={{ fontSize: 14, color: 'white' }} />}
                  </Flex>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => toggleUser(user)}
                  />
                  <span className="text-body-md text-text">{user}</span>
                </Flex>
              );
            })}
          </Flex>
        </div>
      </Modal>
    </div>
  );
}
