"use client";

import { useState } from "react";
import { Button, Flex } from "antd";
import { FormInput, FormSelect, Tab, Toggle, Modal, Card, Grid, Divider, Text, Checkbox } from "@/components/ds";
import styles from "./UserDetail.module.css";

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
    <div className={styles.shell}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Account details</h1>
      </div>

      <div className={styles.tabRow}>
        <Tab items={tabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <div className={styles.body}>
        {activeTab === "details" && (
          <div className={styles.detailsCol}>
            <Flex gap={16}>
              {/* Profile photo */}
              <Flex vertical gap={16} className={styles.formCol}>
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
                  <Text variant="label/lg" as="label" color="text" mb={4} className={styles.labelBlock}>Date of birth</Text>
                  <Grid cols={3} gap="sm">
                    <FormSelect options={dayOptions} />
                    <FormSelect options={monthOptions} />
                    <FormSelect options={yearOptions} />
                  </Grid>
                </div>

                {/* Phone numbers */}
                <div>
                  <Text variant="label/lg" as="label" color="text" mb={4} className={styles.labelBlock}>Phone numbers</Text>
                  <Button className={styles.addPhoneBtn}>+ Add new phone number</Button>
                </div>

                <FormInput label="Professional title (Occupational Therapist, Physiotherapist, etc.) *" defaultValue="Registered Physiotherapist" />

                <FormInput label="Groups" defaultValue={group} />
              </Flex>

              {/* Profile photo placeholder */}
              <div className={styles.uploadCol}>
                <div className={styles.photoBox}>
                  <Text variant="display/lg" color="secondary">Photo</Text>
                </div>
                <Button className={styles.uploadBtn}>Upload</Button>
              </div>
            </Flex>

            <Divider variant="primary" className={styles.divider} />

            {/* Timezone */}
            <div className={styles.section}>
              <Text variant="heading/lg" as="h2" mb={8}>Timezone</Text>
              <Text variant="body/md" color="secondary" mb={16}>The timezone is used for calendar and time information on PDF downloads. The location timezone is recommended.</Text>
              <Flex align="center" gap={8} className={styles.checkboxRow}>
                <Checkbox checked />
                <Text variant="body/md">Automatic timezone</Text>
              </Flex>
              <FormSelect options={timezoneOptions} defaultValue="Australia/Adelaide" />
            </div>

            <Divider variant="primary" className={styles.divider} />

            {/* Account role */}
            <div className={styles.section}>
              <Text variant="heading/lg" as="h2" mb={16}>Account role</Text>
              <FormSelect options={roleNameOptions} value={roleName} onChange={setRoleName} />
            </div>

            <Divider variant="primary" className={styles.divider} />

            {/* Practitioner settings */}
            <div className={styles.section}>
              <Text variant="heading/lg" as="h2" mb={16}>Practitioner settings</Text>
              <Text variant="label/lg" as="label" color="text" mb={8} className={styles.labelBlock}>Locations practitioner works at</Text>
              <Flex vertical gap={8} className={styles.locationsList}>
                {locationsList.map(loc => (
                  <Flex key={loc} align="center" gap={8}>
                    <Checkbox checked={selectedLocations.has(loc)} onChange={() => toggleLocation(loc)} />
                    <Text variant="body/md">{loc}</Text>
                  </Flex>
                ))}
              </Flex>
            </div>

            {/* Footer actions */}
            <Flex align="center" gap={16} className={styles.footerActions}>
              <Button type="primary">Save details</Button>
              <Button type="link">View user change log</Button>
            </Flex>
          </div>
        )}

        {activeTab === "availability" && (
          <div className={styles.availabilityCol}>
            <Flex align="center" justify="space-between" className={styles.availabilityHeader}>
              <h3 className={styles.bodyChartsHeading}>Weekly availability</h3>
              <Button onClick={() => setEditAvailOpen(true)}>Edit availability</Button>
            </Flex>

            <div className={styles.availabilityTable}>
              <div className={styles.availabilityHeadRow}>
                <div className={styles.availabilityHeadCell}>Time</div>
                {DAYS.map((day) => (
                  <div key={day} className={styles.availabilityHeadCellCenter}>{day}</div>
                ))}
              </div>
              {HOURS.map((hour, hourIdx) => (
                <div key={hour} className={hourIdx < HOURS.length - 1 ? styles.availabilityRow : styles.availabilityRowLast}>
                  <div className={styles.availabilityTimeCell}>{hour}:00</div>
                  {DAYS.map((day) => {
                    const avail = defaultAvailability.find((a) => a.day === day);
                    const isAvailable = avail && hour >= avail.start && hour < avail.end;
                    return (
                      <div
                        key={day}
                        className={`${styles.availabilityCell} ${isAvailable ? styles.availabilityCellActive : ""}`}
                        onClick={() => { setEditDay(day); setEditAvailOpen(true); }}
                      >
                        {isAvailable && <div className={styles.availabilityFill} />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "body-charts" && (
          <div className={styles.bodyChartsCol}>
            <Flex align="center" justify="space-between" className={styles.bodyChartsHeader}>
              <h3 className={styles.bodyChartsHeading}>Body chart templates</h3>
              <Button>+ New template</Button>
            </Flex>
            <Flex vertical gap={8}>
              {bodyChartTemplates.map((t) => (
                <Card key={t.id} padding="none">
                  <Flex align="center" justify="space-between" className={styles.bodyChartRow}>
                    <span className={styles.bodyChartName}>{t.name}</span>
                    <span className={styles.bodyChartUpdated}>Updated {t.updatedAt}</span>
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
