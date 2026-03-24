"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Navbar, Card, FormInput, FormTextarea } from "@/components/ds";

export default function NewContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    organisation: "",
    jobTitle: "",
    email: "",
    phone: "",
    mobile: "",
    fax: "",
    address: "",
    notes: "",
  });

  const setField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    router.push("/contacts");
  };

  return (
    <div>
      <Navbar backHref="/contacts" title="New contact">
        <Button variant="secondary" onClick={() => router.push("/contacts")}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Navbar>

      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <Card title="General details">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="First name"
              value={form.firstName}
              onChange={(e) => setField("firstName", e.target.value)}
            />
            <FormInput
              label="Last name"
              value={form.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
            />
            <FormInput
              label="Organisation"
              value={form.organisation}
              onChange={(e) => setField("organisation", e.target.value)}
            />
            <FormInput
              label="Job title"
              value={form.jobTitle}
              onChange={(e) => setField("jobTitle", e.target.value)}
            />
          </div>
        </Card>

        <Card title="Contact details">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
            />
            <FormInput
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
            />
            <FormInput
              label="Mobile"
              type="tel"
              value={form.mobile}
              onChange={(e) => setField("mobile", e.target.value)}
            />
            <FormInput
              label="Fax"
              type="tel"
              value={form.fax}
              onChange={(e) => setField("fax", e.target.value)}
            />
          </div>
          <div className="mt-4">
            <FormInput
              label="Address"
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
            />
          </div>
        </Card>

        <Card title="Notes">
          <FormTextarea
            label="Notes"
            rows={4}
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
            placeholder="Add any notes about this contact..."
          />
        </Card>
      </div>
    </div>
  );
}
