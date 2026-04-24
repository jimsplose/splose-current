"use client";

import { useState, useCallback } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FormInput, FormSelect, Badge, Dropdown, DropdownTriggerButton, Modal, PageHeader, Text } from "@/components/ds";
import { USER_ADMIN } from "@/lib/dropdown-presets";
import { useFormModal } from "@/hooks/useFormModal";

interface User {
  name: string;
  email: string;
  roleName: string;
  roleType: string;
  group: string;
  status: string;
  isOwner: boolean;
  twoFA: boolean;
}

const initialUsers: User[] = [
  { name: "Nicholas Smithson", email: "nick@splose.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "OT", status: "Active", isOwner: true, twoFA: true },
  { name: "Splose Support", email: "support@splose.com", roleName: "Practice manager", roleType: "Practice manager", group: "", status: "Active", isOwner: false, twoFA: false },
  { name: "nick sand", email: "nick1@splose.com", roleName: "Practitioner", roleType: "Practitioner", group: "", status: "Active", isOwner: false, twoFA: false },
  { name: "Harry Nguyen", email: "harry@splose.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "OT", status: "Active", isOwner: true, twoFA: true },
  { name: "Cheng Ma", email: "cheng@splose.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "Intake team, +1 more", status: "Active", isOwner: true, twoFA: false },
  { name: "Rakesh Soni", email: "rakesh@splose.com", roleName: "Practice manager", roleType: "Practice manager", group: "Physio", status: "Active", isOwner: true, twoFA: false },
  { name: "Cheng Test", email: "machengjam@gmail.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "", status: "Active", isOwner: false, twoFA: false },
];

const roleOptions = [
  { value: "Practitioner", label: "Practitioner" },
  { value: "Practitioner admin", label: "Practitioner admin" },
  { value: "Practice manager", label: "Practice manager" },
  { value: "Receptionist", label: "Receptionist" },
];

const groupOptions = [
  { value: "", label: "None" },
  { value: "OT", label: "OT" },
  { value: "Physio", label: "Physio" },
  { value: "Intake team", label: "Intake team" },
  { value: "Speech", label: "Speech" },
];

type UserForm = {
  [key: string]: unknown;
  name: string;
  email: string;
  role: string;
  group: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: "deactivate" | "reset-password" | null;
    userIndex: number | null;
  }>({ open: false, title: "", message: "", action: null, userIndex: null });

  const { modalOpen, isEditing, form, setField, openEdit, closeModal, handleSave } =
    useFormModal<UserForm>({
      defaults: { name: "", email: "", role: "Practitioner", group: "" },
      onSave: (values, index) => {
        if (index !== null) {
          setUsers((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              name: values.name,
              email: values.email,
              roleName: values.role,
              roleType: values.role,
              group: values.group,
            };
            return updated;
          });
        }
      },
    });

  const handleDropdownAction = useCallback(
    (value: string, user: User, index: number) => {
      if (value === "deactivate") {
        setConfirmDialog({
          open: true,
          title: "Deactivate user",
          message: `Are you sure you want to deactivate "${user.name}"? They will no longer be able to log in.`,
          action: "deactivate",
          userIndex: index,
        });
      } else if (value === "reset-password") {
        setConfirmDialog({
          open: true,
          title: "Reset password",
          message: `A password reset email will be sent to ${user.email}.`,
          action: "reset-password",
          userIndex: index,
        });
      } else if (value === "edit") {
        openEdit(index, {
          name: user.name,
          email: user.email,
          role: user.roleName,
          group: user.group,
        });
      }
    },
    [openEdit],
  );

  const handleConfirmAction = useCallback(() => {
    if (confirmDialog.action === "deactivate" && confirmDialog.userIndex !== null) {
      setUsers((prev) => {
        const updated = [...prev];
        updated[confirmDialog.userIndex!] = {
          ...updated[confirmDialog.userIndex!],
          status: "Inactive",
        };
        return updated;
      });
    }
    // For reset-password, just close the dialog (no-op in prototype)
    setConfirmDialog({ open: false, title: "", message: "", action: null, userIndex: null });
  }, [confirmDialog]);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({ open: false, title: "", message: "", action: null, userIndex: null });
  }, []);

  const columns: ColumnsType<User> = [
    {
      key: "name",
      title: "Name",
      render: (_, row, index) => (
        <div style={{ fontWeight: 500 }}>
          <a href={`/settings/users/${index + 1}`}>{row.name}</a>
          {row.isOwner && <Badge variant="green" style={{ marginLeft: 8 }}>Account owner</Badge>}
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      render: (_, row) => <Text color="secondary" as="span">{row.email}</Text>,
    },
    {
      key: "roleName",
      title: "Role name",
      render: (_, row) => <Text color="secondary" as="span">{row.roleName}</Text>,
    },
    {
      key: "roleType",
      title: "Role type",
      render: (_, row) => <Text color="secondary" as="span">{row.roleType}</Text>,
    },
    {
      key: "group",
      title: "Group",
      render: (_, row) => <Text color="secondary" as="span">{row.group || "---"}</Text>,
    },
    {
      key: "status",
      title: "Status",
      render: (_, row) => <Text color="secondary" as="span">{row.status}</Text>,
    },
    {
      key: "twoFA",
      title: "2FA",
      render: (_, row) => <Text color="secondary" as="span">{row.twoFA ? "Enabled" : "Not enabled"}</Text>,
    },
    {
      key: "actions",
      title: "",
      align: "right" as const,
      render: (_, row, index) => (
        <Dropdown
          align="right"
          trigger={<DropdownTriggerButton />}
          items={USER_ADMIN}
          onSelect={(value) => handleDropdownAction(value, row, index)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Users">
        <Button>Invite users</Button>
      </PageHeader>
      <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
        <div style={{ flex: 1 }}><FormInput type="text" placeholder="Search for user name and email" /></div>
        <Button>Search</Button>
      </Flex>
      <Table columns={columns} dataSource={users} rowKey="email" pagination={false} />

      {/* Edit User Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Edit user"
        footer={
          <>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>{isEditing ? "Edit" : "Create"}</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Name *" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormInput label="Email" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} />
          <FormSelect label="Role" options={roleOptions} value={form.role} onChange={(value) => setField("role", value)} />
          <FormSelect label="User group" options={groupOptions} value={form.group} onChange={(value) => setField("group", value)} />
        </Flex>
      </Modal>

      {/* Confirmation Dialog */}
      <Modal
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        title={confirmDialog.title}
        maxWidth="sm"
        footer={
          <>
            <Button onClick={closeConfirmDialog}>Cancel</Button>
            <Button
              type={confirmDialog.action === "deactivate" ? "default" : "primary"}
              danger={confirmDialog.action === "deactivate"}
              onClick={handleConfirmAction}
            >
              {confirmDialog.action === "deactivate" ? "Deactivate" : "Send reset email"}
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{confirmDialog.message}</p>
      </Modal>
    </div>
  );
}
