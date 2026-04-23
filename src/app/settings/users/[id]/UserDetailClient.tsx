"use client";

import { useState } from "react";
import { Button, Flex } from "antd";
import { FormInput, FormSelect, Tab, Toggle, Modal, Card, Grid, Divider, Text, Checkbox } from "@/components/ds";

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

const titleOptions = [
  { value: "", label: "Title" },
  { value: "Mr", label: "Mr" },
  { value: "Mrs", label: "Mrs" },
  { value: "Ms", label: "Ms" },
  { value: "Dr", label: "Dr" },
];

const genderOptions = [
  { value: "", label: "Gender" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Non-binary", label: "Non-binary" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const dayOptions = [{ value: "", label: "Day" }, ...Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))];
const monthOptions = [{ value: "", label: "Month" }, ...["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => ({ value: String(i + 1), label: m }))];
const yearOptions = [{ value: "", label: "Year" }, ...Array.from({ length: 80 }, (_, i) => ({ value: String(2026 - i), label: String(2026 - i) }))];

const timezoneOptions = [
  { value: "Australia/Adelaide", label: "(UTC+09:30) - Australia/Adelaide" },
  { value: "Australia/Sydney", label: "(UTC+10:00) - Australia/Sydney" },
  { value: "Australia/Brisbane", label: "(UTC+10:00) - Australia/Brisbane" },
  { value: "Australia/Perth", label: "(UTC+08:00) - Australia/Perth" },
];

const locationsList = ["East Clinics", "Splose OT", "Ploc", "Tasks", "Sharon's", "One service only"];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 7);

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
  const nameParts = user.name.split(" ");

  const [activeTab, setActiveTab] = useState("details");
  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "");
  const [roleName, setRoleName] = useState(user.roleName);
  const [group, setGroup] = useState(user.group);
  const [editAvailOpen, setEditAvailOpen] = useState(false);
  const [editDay, setEditDay] = useState("Mon");
  const [editStart, setEditStart] = useState("9:00");
  const [editEnd, setEditEnd] = useState("17:00");
  const [editApplyTo, setEditApplyTo] = useState("date");
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set(["East Clinics"]));

  const toggleLocation = (loc: string) => {
    setSelectedLocations(prev => {
      const next = new Set(prev);
      if (next.has(loc)) next.delete(loc); else next.add(loc);
      return next;
    });
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 3rem)' }}>
      <div style={{ padding: '24px 24px 0' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Account details</h1>
      </div>

      <div style={{ borderBottom: '1px solid var(--color-border)', padding: '0 24px' }}>
        <Tab items={tabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {activeTab === "details" && (
          <div style={{ maxWidth: 672 }}>
            <Flex gap={16}>
              {/* Profile photo */}
              <Flex vertical gap={16} style={{ flex: 1 }}>
                {/* Name row: Title | First name* | Last name* */}
                <Grid cols={3} gap="md">
                  <FormSelect label="Title" options={titleOptions} />
                  <FormInput label="First name *" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <FormInput label="Last name *" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </Grid>

                <FormSelect label="Gender" options={genderOptions} />

                <FormInput label="Email *" type="email" defaultValue={user.email} />

                {/* Date of birth */}
                <div>
                  <Text variant="label/lg" as="label" color="text" style={{ marginBottom: 4, display: 'block' }}>Date of birth</Text>
                  <Grid cols={3} gap="sm">
                    <FormSelect options={dayOptions} />
                    <FormSelect options={monthOptions} />
                    <FormSelect options={yearOptions} />
                  </Grid>
                </div>

                {/* Phone numbers */}
                <div>
                  <Text variant="label/lg" as="label" color="text" style={{ marginBottom: 4, display: 'block' }}>Phone numbers</Text>
                  <Button style={{ marginTop: 4 }}>+ Add new phone number</Button>
                </div>

                <FormInput label="Professional title (Occupational Therapist, Physiotherapist, etc.) *" defaultValue="Registered Physiotherapist" />

                <FormInput label="Groups" defaultValue={group} />
              </Flex>

              {/* Profile photo placeholder */}
              <div style={{ width: 200, flexShrink: 0, textAlign: 'center' }}>
                <div style={{ width: 200, height: 200, borderRadius: 8, backgroundColor: 'var(--color-fill-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <Text variant="display/lg" color="secondary">Photo</Text>
                </div>
                <Button style={{ marginTop: 12 }}>Upload</Button>
              </div>
            </Flex>

            <Divider type="primary" style={{ margin: '24px 0' }} />

            {/* Timezone */}
            <div style={{ marginBottom: 24 }}>
              <Text variant="heading/lg" as="h2" style={{ marginBottom: 8 }}>Timezone</Text>
              <Text variant="body/md" color="secondary" style={{ marginBottom: 16 }}>The timezone is used for calendar and time information on PDF downloads. The location timezone is recommended.</Text>
              <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
                <Checkbox checked />
                <Text variant="body/md">Automatic timezone</Text>
              </Flex>
              <FormSelect options={timezoneOptions} defaultValue="Australia/Adelaide" />
            </div>

            <Divider type="primary" style={{ margin: '24px 0' }} />

            {/* Account role */}
            <div style={{ marginBottom: 24 }}>
              <Text variant="heading/lg" as="h2" style={{ marginBottom: 16 }}>Account role</Text>
              <FormSelect options={roleNameOptions} value={roleName} onChange={setRoleName} />
            </div>

            <Divider type="primary" style={{ margin: '24px 0' }} />

            {/* Practitioner settings */}
            <div style={{ marginBottom: 24 }}>
              <Text variant="heading/lg" as="h2" style={{ marginBottom: 16 }}>Practitioner settings</Text>
              <Text variant="label/lg" as="label" color="text" style={{ marginBottom: 8, display: 'block' }}>Locations practitioner works at</Text>
              <Flex vertical gap={8} style={{ marginBottom: 24 }}>
                {locationsList.map(loc => (
                  <Flex key={loc} align="center" gap={8}>
                    <Checkbox checked={selectedLocations.has(loc)} onChange={() => toggleLocation(loc)} />
                    <Text variant="body/md">{loc}</Text>
                  </Flex>
                ))}
              </Flex>
            </div>

            {/* Footer actions */}
            <Flex align="center" gap={16} style={{ marginTop: 32, marginBottom: 32 }}>
              <Button type="primary">Save details</Button>
              <Button type="link">View user change log</Button>
            </Flex>
          </div>
        )}

        {activeTab === "availability" && (
          <div style={{ maxWidth: 896 }}>
            <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>Weekly availability</h3>
              <Button onClick={() => setEditAvailOpen(true)}>Edit availability</Button>
            </Flex>

            <div style={{ overflow: 'hidden', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ padding: 12, fontSize: 12, fontWeight: 500 }}>Time</div>
                {DAYS.map((day) => (
                  <div key={day} style={{ padding: 12, fontSize: 12, fontWeight: 500, textAlign: 'center' }}>{day}</div>
                ))}
              </div>
              {HOURS.map((hour, hourIdx) => (
                <div key={hour} style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', borderBottom: hourIdx < HOURS.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <div style={{ padding: 8, fontSize: 11, color: 'var(--color-text-secondary)' }}>{hour}:00</div>
                  {DAYS.map((day) => {
                    const avail = defaultAvailability.find((a) => a.day === day);
                    const isAvailable = avail && hour >= avail.start && hour < avail.end;
                    return (
                      <div
                        key={day}
                        style={{ borderLeft: '1px solid var(--color-border)', padding: 8, backgroundColor: isAvailable ? 'rgba(var(--color-primary-rgb, 130, 80, 255), 0.1)' : undefined, cursor: 'pointer' }}
                        onClick={() => { setEditDay(day); setEditAvailOpen(true); }}
                      >
                        {isAvailable && <div style={{ height: '100%', borderRadius: 4, backgroundColor: 'rgba(var(--color-primary-rgb, 130, 80, 255), 0.2)' }} />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "body-charts" && (
          <div style={{ maxWidth: 672 }}>
            <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>Body chart templates</h3>
              <Button>+ New template</Button>
            </Flex>
            <Flex vertical gap={8}>
              {bodyChartTemplates.map((t) => (
                <Card key={t.id} padding="none">
                  <Flex align="center" justify="space-between" style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 14, color: 'var(--color-primary)' }}>{t.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Updated {t.updatedAt}</span>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </div>
        )}
      </div>

      <Modal open={editAvailOpen} onClose={() => setEditAvailOpen(false)} title="Edit availability">
        <Flex vertical gap={16}>
          <FormSelect label="Day" value={editDay} onChange={setEditDay} options={DAYS.map((d) => ({ value: d, label: d }))} />
          <Grid cols={2} gap="md">
            <FormInput label="Start time" type="time" value={editStart} onChange={(e) => setEditStart(e.target.value)} />
            <FormInput label="End time" type="time" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} />
          </Grid>
          <FormSelect label="Apply to" value={editApplyTo} onChange={setEditApplyTo} options={applyToOptions} />
          <Flex justify="flex-end" gap={8}>
            <Button onClick={() => setEditAvailOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={() => setEditAvailOpen(false)}>Save</Button>
          </Flex>
        </Flex>
      </Modal>
    </div>
  );
}
