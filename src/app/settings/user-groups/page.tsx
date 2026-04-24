"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReadOutlined, SwapOutlined, CheckOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import { PageHeader, SearchBar, Pagination, Dropdown, DropdownTriggerButton, Modal, FormInput, Divider } from "@/components/ds";
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

  const columns: ColumnsType<UserGroup> = [
    {
      key: "name",
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Name
          <Icon as={SwapOutlined} tone="secondary" />
        </span>
      ),
      dataIndex: "name",
    },
    { key: "users", title: "Users", dataIndex: "users" },
    {
      key: "actions",
      title: "",
      align: "right" as const,
      render: (_, row) => (
        <Dropdown
          align="right"
          trigger={<DropdownTriggerButton />}
          items={STANDARD_SETTINGS}
          onSelect={(value) => handleAction(value, groups.indexOf(row))}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="User groups">
        <Button>
          <Icon as={ReadOutlined} />
          Learn
        </Button>
        <Button onClick={openCreate}>+ New group</Button>
      </PageHeader>

      <SearchBar
        placeholder="Search for group name"
        onSearch={(q) => setSearch(q)}
      />

      <Table columns={columns} dataSource={paged} rowKey="name" pagination={false} />

      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} />
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit user group" : "New user group"}
        footer={
          <>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>{isEditing ? "Edit" : "Create"}</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Name *" value={form.name} onChange={(e) => setField("name", e.target.value)} />
        </Flex>

        <Divider spacing="none" style={{ marginTop: 24 }} />
        <div style={{ paddingTop: 24 }}>
          <h3 style={{ marginBottom: 12, fontSize: 18, fontWeight: 600 }}>Users</h3>
          <Flex vertical gap={4}>
            {MOCK_USERS.map((user) => {
              const isSelected = form.selectedUsers.includes(user);
              return (
                <Flex
                  component="label"
                  key={user}
                  align="center"
                  gap={12}
                  style={{ cursor: 'pointer', borderRadius: 8, padding: '8px 12px' }}
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
                    {isSelected && <Icon as={CheckOutlined} tone="inverted" />}
                  </Flex>
                  <input
                    type="checkbox"
                    style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}
                    checked={isSelected}
                    onChange={() => toggleUser(user)}
                  />
                  <span style={{ fontSize: 14 }}>{user}</span>
                </Flex>
              );
            })}
          </Flex>
        </div>
      </Modal>
    </div>
  );
}
