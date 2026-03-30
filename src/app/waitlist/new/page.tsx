"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flex } from "antd";
import { Button, Card, Checkbox, FormSelect, FormTextarea, Navbar } from "@/components/ds";

const clientOptions = [
  { value: "", label: "Select a client..." },
  { value: "kai-win", label: "kai win" },
  { value: "new-client", label: "New client" },
  { value: "ella-thompson", label: "Ella Thompson" },
  { value: "jenny-jenkins", label: "Jenny Jenkins" },
  { value: "harry-james", label: "Harry James" },
  { value: "hao-wang", label: "Hao Wang" },
  { value: "splose-ruvi", label: "splose Ruvi" },
];

const practitionerOptions = [
  { value: "", label: "Select a practitioner..." },
  { value: "sarah-chen", label: "Dr Sarah Chen" },
  { value: "marcus-johnson", label: "Marcus Johnson" },
  { value: "emily-patel", label: "Emily Patel" },
  { value: "james-wilson", label: "James Wilson" },
  { value: "lisa-nguyen", label: "Lisa Nguyen" },
  { value: "david-kim", label: "David Kim" },
];

const serviceOptions = [
  { value: "", label: "Select a service..." },
  { value: "first-appointment", label: "First Appointment" },
  { value: "1-1-consultation", label: "1:1 Consultation" },
  { value: "speech-therapy", label: "Speech Therapy" },
  { value: "ot-assessment", label: "OT Assessment" },
  { value: "back-realignment", label: "Back Re-Alignment" },
  { value: "group-session", label: "Group Session" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const timeOptions = [
  { value: "any", label: "Any" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export default function WaitlistNewPage() {
  const router = useRouter();
  const [client, setClient] = useState("");
  const [practitioner, setPractitioner] = useState("");
  const [service, setService] = useState("");
  const [priority, setPriority] = useState("low");
  const [preferredDays, setPreferredDays] = useState<Record<string, boolean>>({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });
  const [preferredTime, setPreferredTime] = useState("any");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const handleDayToggle = (day: string) => {
    setPreferredDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSave = () => {
    // In a real app, this would POST to an API
    router.push("/waitlist");
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ant-color-bg-layout)' }}>
      <Navbar backHref="/waitlist" title="Add to waitlist">
        <Button variant="secondary" onClick={() => router.push("/waitlist")}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Navbar>

      <Flex vertical gap={24} style={{ maxWidth: 672, margin: '0 auto', padding: 24 }}>
        {/* Client */}
        <Card title="Client" headerBar>
          <Flex vertical gap={16}>
            <FormSelect
              label="Client"
              options={clientOptions}
              value={client}
              onChange={setClient}
            />
            <FormSelect
              label="Preferred practitioner"
              options={practitionerOptions}
              value={practitioner}
              onChange={setPractitioner}
            />
          </Flex>
        </Card>

        {/* Details */}
        <Card title="Details" headerBar>
          <Flex vertical gap={16}>
            <FormSelect
              label="Service"
              options={serviceOptions}
              value={service}
              onChange={setService}
            />
            <FormSelect
              label="Priority"
              options={priorityOptions}
              value={priority}
              onChange={setPriority}
            />
            <div>
              <label className="text-label-lg" style={{ display: 'block', marginBottom: 8, color: 'var(--ant-color-text-secondary)' }}>Preferred days</label>
              <Flex wrap gap={16}>
                {days.map((day) => (
                  <Checkbox
                    key={day}
                    label={day}
                    checked={preferredDays[day]}
                    onChange={() => handleDayToggle(day)}
                  />
                ))}
              </Flex>
            </div>
            <FormSelect
              label="Preferred time"
              options={timeOptions}
              value={preferredTime}
              onChange={setPreferredTime}
            />
          </Flex>
        </Card>

        {/* Notes */}
        <Card title="Notes" headerBar>
          <Flex vertical gap={16}>
            <FormTextarea
              label="Reason for waitlist"
              placeholder="Why is the client being added to the waitlist?"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <FormTextarea
              label="Internal notes"
              placeholder="Any additional notes for staff..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Flex>
        </Card>
      </Flex>
    </div>
  );
}
