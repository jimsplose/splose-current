"use client";

import { useState, useCallback } from "react";
import { Flex } from "antd";
import {
  Button,
  FormInput,
  FormSelect,
  Badge,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Dropdown,
  DropdownTriggerButton,
  Modal,
  PageHeader,
} from "@/components/ds";
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

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Users">
        <Button variant="secondary">Invite users</Button>
      </PageHeader>
      <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
        <div style={{ flex: 1 }}><FormInput type="text" placeholder="Search for user name and email" /></div>
        <Button variant="secondary">Search</Button>
      </Flex>
      <DataTable>
        <TableHead><Th>Name</Th><Th>Email</Th><Th>Role name</Th><Th>Role type</Th><Th>Group</Th><Th>Status</Th><Th>2FA</Th><Th align="right">Actions</Th></TableHead>
        <TableBody>
          {users.map((user, index) => (
            <Tr key={user.email}>
              <Td className="text-text" style={{ fontWeight: 500 }}>
                <div><a href={`/settings/users/${index + 1}`} className="text-text">{user.name}</a>{user.isOwner && <Badge variant="green" style={{ marginLeft: 8 }}>Account owner</Badge>}</div>
              </Td>
              <Td className="text-text-secondary">{user.email}</Td>
              <Td className="text-text-secondary">{user.roleName}</Td>
              <Td className="text-text-secondary">{user.roleType}</Td>
              <Td className="text-text-secondary">{user.group || "---"}</Td>
              <Td className="text-text-secondary">{user.status}</Td>
              <Td className="text-text-secondary">{user.twoFA ? "Enabled" : "Not enabled"}</Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={USER_ADMIN}
                  onSelect={(value) => handleDropdownAction(value, user, index)}
                />
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>

      {/* Edit User Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Edit user"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
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
            <Button variant="secondary" onClick={closeConfirmDialog}>Cancel</Button>
            <Button
              variant={confirmDialog.action === "deactivate" ? "danger" : "primary"}
              onClick={handleConfirmAction}
            >
              {confirmDialog.action === "deactivate" ? "Deactivate" : "Send reset email"}
            </Button>
          </>
        }
      >
        <p className="text-body-md text-text-secondary">{confirmDialog.message}</p>
      </Modal>
    </div>
  );
}
