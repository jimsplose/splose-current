"use client";

import { useState } from "react";
import { Button, FormInput, FormSelect, Navbar, Collapse } from "@/components/ds";

interface User {
  name: string;
  email: string;
  roleName: string;
  roleType: string;
  group: string;
  status: string;
  isOwner: boolean;
}

const users: User[] = [
  { name: "Nicholas Smithson", email: "nick@splose.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "OT", status: "Active", isOwner: true },
  { name: "Splose Support", email: "support@splose.com", roleName: "Practice manager", roleType: "Practice manager", group: "", status: "Active", isOwner: false },
  { name: "nick sand", email: "nick1@splose.com", roleName: "Practitioner", roleType: "Practitioner", group: "", status: "Active", isOwner: false },
  { name: "Harry Nguyen", email: "harry@splose.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "OT", status: "Active", isOwner: true },
  { name: "Cheng Ma", email: "cheng@splose.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "Intake team, +1 more", status: "Active", isOwner: true },
  { name: "Rakesh Soni", email: "rakesh@splose.com", roleName: "Practice manager", roleType: "Practice manager", group: "Physio", status: "Active", isOwner: true },
  { name: "Cheng Test", email: "machengjam@gmail.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "", status: "Active", isOwner: false },
];

const roleNameOptions = [
  { value: "Practitioner admin", label: "Practitioner admin" },
  { value: "Practice manager", label: "Practice manager" },
  { value: "Practitioner", label: "Practitioner" },
  { value: "Receptionist", label: "Receptionist" },
];

const roleTypeOptions = [
  { value: "Practitioner admin", label: "Practitioner admin" },
  { value: "Practice manager", label: "Practice manager" },
  { value: "Practitioner", label: "Practitioner" },
  { value: "Receptionist", label: "Receptionist" },
];

export default function UserDetailClient({ id }: { id: string }) {
  const index = parseInt(id, 10) - 1;
  const user = users[index] || users[0];

  const [name, setName] = useState(user.name);
  const [roleName, setRoleName] = useState(user.roleName);
  const [roleType, setRoleType] = useState(user.roleType);
  const [group, setGroup] = useState(user.group);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar backHref="/settings/users" title={name || user.name}>
        <Button variant="primary">Save changes</Button>
      </Navbar>

      <div className="flex-1 p-6">
        <div className="max-w-2xl space-y-6">
          {/* Profile section */}
          <Collapse title="Profile" defaultOpen>
            <div className="space-y-4">
              <FormInput
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormInput
                label="Email"
                type="email"
                defaultValue={user.email}
                disabled
                className="bg-gray-50 text-text-secondary"
              />
            </div>
          </Collapse>

          {/* Role & Access section */}
          <Collapse title="Role & Access" defaultOpen>
            <div className="space-y-4">
              <FormSelect
                label="Role name"
                options={roleNameOptions}
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
              <FormSelect
                label="Role type"
                options={roleTypeOptions}
                value={roleType}
                onChange={(e) => setRoleType(e.target.value)}
              />
              <FormInput
                label="Group"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              />
            </div>
          </Collapse>

          {/* Security section */}
          <Collapse title="Security" defaultOpen>
            <div className="space-y-3">
              <Button variant="secondary">Reset password</Button>
              <Button variant="secondary">Log out everywhere</Button>
              <Button variant="danger">Deactivate account</Button>
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  );
}
