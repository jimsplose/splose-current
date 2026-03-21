"use client";

import Link from "next/link";
import { Button, FormInput, Badge, DataTable, TableHead, Th, TableBody, Td, Dropdown, DropdownTriggerButton } from "@/components/ds";
import { USER_ADMIN } from "@/lib/dropdown-presets";

const users = [
  { name: "Nicholas Smithson", email: "nick@splose.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "OT", status: "Active", isOwner: true },
  { name: "Splose Support", email: "support@splose.com", roleName: "Practice manager", roleType: "Practice manager", group: "", status: "Active", isOwner: false },
  { name: "nick sand", email: "nick1@splose.com", roleName: "Practitioner", roleType: "Practitioner", group: "", status: "Active", isOwner: false },
  { name: "Harry Nguyen", email: "harry@splose.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "OT", status: "Active", isOwner: true },
  { name: "Cheng Ma", email: "cheng@splose.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "Intake team, +1 more", status: "Active", isOwner: true },
  { name: "Rakesh Soni", email: "rakesh@splose.com", roleName: "Practice manager", roleType: "Practice manager", group: "Physio", status: "Active", isOwner: true },
  { name: "Cheng Test", email: "machengjam@gmail.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "", status: "Active", isOwner: false },
];

export default function UsersPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-display-lg text-text">Users</h1>
        <Button variant="primary">Invite users</Button>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1"><FormInput type="text" placeholder="Search for user name and email" /></div>
        <Button variant="secondary">Search</Button>
      </div>
      <DataTable>
        <TableHead><Th>Name</Th><Th>Email</Th><Th>Role name</Th><Th>Role type</Th><Th>Group</Th><Th>Status</Th><Th align="right">Actions</Th></TableHead>
        <TableBody>
          {users.map((user, index) => (
            <tr key={user.email} className="hover:bg-gray-50">
              <Td className="font-medium text-text">
                <div><Link href={`/settings/users/${index + 1}`} className="text-primary hover:underline">{user.name}</Link>{user.isOwner && <span className="ml-2 inline-block rounded bg-green-500 px-1.5 py-0.5 text-caption-sm text-white">Account owner</span>}</div>
              </Td>
              <Td className="text-text-secondary">{user.email}</Td>
              <Td className="text-text-secondary">{user.roleName}</Td>
              <Td className="text-text-secondary">{user.roleType}</Td>
              <Td className="text-text-secondary">{user.group || "---"}</Td>
              <Td><Badge variant="green">{user.status}</Badge></Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={USER_ADMIN}
                  onSelect={() => {}}
                />
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
    </div>
  );
}
