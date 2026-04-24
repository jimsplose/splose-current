"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flex, Form, Input } from "antd";
import { FormPage, Card, Grid } from "@/components/ds";

export default function NewContactPage() {
  const router = useRouter();
  const [antForm] = Form.useForm();
  const [contactForm, setContactForm] = useState({
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
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    router.push("/contacts");
  };

  return (
    <FormPage
      title="New contact"
      backHref="/contacts"
      maxWidth={768}
      actions={
        <>
          <Button onClick={() => router.push("/contacts")}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </>
      }
    >
      <Flex vertical gap={24}>
        <Card title="General details">
          <Form form={antForm} layout="vertical">
            <Grid cols={2} gap="md">
              <Form.Item label="First name">
                <Input value={contactForm.firstName} onChange={(e) => setField("firstName", e.target.value)} />
              </Form.Item>
              <Form.Item label="Last name">
                <Input value={contactForm.lastName} onChange={(e) => setField("lastName", e.target.value)} />
              </Form.Item>
              <Form.Item label="Organisation">
                <Input value={contactForm.organisation} onChange={(e) => setField("organisation", e.target.value)} />
              </Form.Item>
              <Form.Item label="Job title">
                <Input value={contactForm.jobTitle} onChange={(e) => setField("jobTitle", e.target.value)} />
              </Form.Item>
            </Grid>
          </Form>
        </Card>

        <Card title="Contact details">
          <Form form={antForm} layout="vertical">
            <Grid cols={2} gap="md">
              <Form.Item label="Email">
                <Input type="email" value={contactForm.email} onChange={(e) => setField("email", e.target.value)} />
              </Form.Item>
              <Form.Item label="Phone">
                <Input type="tel" value={contactForm.phone} onChange={(e) => setField("phone", e.target.value)} />
              </Form.Item>
              <Form.Item label="Mobile">
                <Input type="tel" value={contactForm.mobile} onChange={(e) => setField("mobile", e.target.value)} />
              </Form.Item>
              <Form.Item label="Fax">
                <Input type="tel" value={contactForm.fax} onChange={(e) => setField("fax", e.target.value)} />
              </Form.Item>
            </Grid>
            <div style={{ marginTop: 16 }}>
              <Form.Item label="Address">
                <Input value={contactForm.address} onChange={(e) => setField("address", e.target.value)} />
              </Form.Item>
            </div>
          </Form>
        </Card>

        <Card title="Notes">
          <Form form={antForm} layout="vertical">
            <Form.Item label="Notes">
              <Input.TextArea
                rows={4}
                value={contactForm.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="Add any notes about this contact..."
              />
            </Form.Item>
          </Form>
        </Card>
      </Flex>
    </FormPage>
  );
}
