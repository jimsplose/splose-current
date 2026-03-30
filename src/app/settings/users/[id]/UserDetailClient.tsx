"use client";

import { useState } from "react";
import { Button, FormInput, FormSelect, Navbar, Collapse, Tab, Toggle, Modal, Card } from "@/components/ds";

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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7am-6pm

const defaultAvailability = [
  { day: "Mon", start: 9, end: 17 },
  { day: "Tue", start: 9, end: 17 },
  { day: "Wed", start: 9, end: 17 },
  { day: "Thu", start: 9, end: 17 },
  { day: "Fri", start: 9, end: 15 },
];

const bodyChartTemplates = [
  { id: 1, name: "Full Body — Front", updatedAt: "12 Mar 2026" },
  { id: 2, name: "Full Body — Back", updatedAt: "12 Mar 2026" },
  { id: 3, name: "Upper Limb", updatedAt: "5 Feb 2026" },
  { id: 4, name: "Lower Limb", updatedAt: "5 Feb 2026" },
  { id: 5, name: "Head & Neck", updatedAt: "20 Jan 2026" },
];

const tabs = [
  { label: "Details", value: "details" },
  { label: "Availability", value: "availability" },
  { label: "Body chart templates", value: "body-charts" },
];

const applyToOptions = [
  { value: "date", label: "Apply to date" },
  { value: "multiple", label: "Apply to multiple days" },
  { value: "weekly", label: "Apply weekly" },
  { value: "fortnightly", label: "Apply fortnightly" },
];

export default function UserDetailClient({ id }: { id: string }) {
  const index = parseInt(id, 10) - 1;
  const user = users[index] || users[0];

  const [activeTab, setActiveTab] = useState("details");
  const [name, setName] = useState(user.name);
  const [roleName, setRoleName] = useState(user.roleName);
  const [roleType, setRoleType] = useState(user.roleType);
  const [group, setGroup] = useState(user.group);
  const [editAvailOpen, setEditAvailOpen] = useState(false);
  const [editDay, setEditDay] = useState("Mon");
  const [editStart, setEditStart] = useState("9:00");
  const [editEnd, setEditEnd] = useState("17:00");
  const [editApplyTo, setEditApplyTo] = useState("date");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar backHref="/settings/users" title={name || user.name}>
        <Button variant="primary">Save changes</Button>
      </Navbar>

      <div className="border-b border-border px-6">
        <Tab items={tabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "details" && (
          <div className="max-w-2xl space-y-6">
            <Collapse title="Profile" defaultOpen>
              <div className="space-y-4">
                <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <FormInput label="Email" type="email" defaultValue={user.email} disabled className="bg-gray-50 text-text-secondary" />
              </div>
            </Collapse>

            <Collapse title="Role & Access" defaultOpen>
              <div className="space-y-4">
                <FormSelect label="Role name" options={roleNameOptions} value={roleName} onChange={setRoleName} />
                <FormSelect label="Role type" options={roleTypeOptions} value={roleType} onChange={setRoleType} />
                <FormInput label="Group" value={group} onChange={(e) => setGroup(e.target.value)} />
              </div>
            </Collapse>

            <Collapse title="Security" defaultOpen>
              <div className="space-y-3">
                <Button variant="secondary">Reset password</Button>
                <Button variant="secondary">Log out everywhere</Button>
                <Button variant="danger">Deactivate account</Button>
              </div>
            </Collapse>
          </div>
        )}

        {activeTab === "availability" && (
          <div className="max-w-4xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-heading-md text-text">Weekly availability</h3>
              <Button variant="secondary" onClick={() => setEditAvailOpen(true)}>Edit availability</Button>
            </div>

            {/* Availability grid */}
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="grid grid-cols-8 border-b border-border">
                <div className="p-3 text-label-lg text-text">Time</div>
                {DAYS.map((day) => (
                  <div key={day} className="p-3 text-center text-label-lg text-text">{day}</div>
                ))}
              </div>
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-border last:border-b-0">
                  <div className="p-2 text-caption-md text-text-secondary">{hour}:00</div>
                  {DAYS.map((day) => {
                    const avail = defaultAvailability.find((a) => a.day === day);
                    const isAvailable = avail && hour >= avail.start && hour < avail.end;
                    return (
                      <div
                        key={day}
                        className={`border-l border-border p-2 ${isAvailable ? "bg-primary/10" : ""}`}
                        onClick={() => { setEditDay(day); setEditAvailOpen(true); }}
                      >
                        {isAvailable && <div className="h-full rounded bg-primary/20" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "body-charts" && (
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-heading-md text-text">Body chart templates</h3>
              <Button variant="secondary">+ New template</Button>
            </div>
            <div className="space-y-2">
              {bodyChartTemplates.map((t) => (
                <Card key={t.id} padding="none" className="flex items-center justify-between px-4 py-3">
                  <span className="text-body-md text-primary">{t.name}</span>
                  <span className="text-caption-md text-text-secondary">Updated {t.updatedAt}</span>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal open={editAvailOpen} onClose={() => setEditAvailOpen(false)} title="Edit availability">
        <div className="space-y-4">
          <FormSelect label="Day" value={editDay} onChange={setEditDay} options={DAYS.map((d) => ({ value: d, label: d }))} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Start time" type="time" value={editStart} onChange={(e) => setEditStart(e.target.value)} />
            <FormInput label="End time" type="time" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} />
          </div>
          <FormSelect label="Apply to" value={editApplyTo} onChange={setEditApplyTo} options={applyToOptions} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditAvailOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setEditAvailOpen(false)}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
