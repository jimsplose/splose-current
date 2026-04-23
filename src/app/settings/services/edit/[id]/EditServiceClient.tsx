"use client";

import { useState } from "react";
import { Button, Flex } from "antd";
import { FormInput, FormSelect, FormColorPicker, FormTextarea, Toggle, Divider, RadioGroup, Text } from "@/components/ds";

interface ServiceData {
  name: string;
  type: string;
  itemCode: string;
  duration: string;
  price: string;
  rate: string;
  color: string;
}

const serviceData: Record<string, ServiceData> = {
  "1": {
    name: "1:1 Consultation",
    type: "1:1 Consultation",
    itemCode: "299sdsdds3234",
    duration: "40",
    price: "193.00",
    rate: "Hour",
    color: "#22c55e",
  },
  "2": {
    name: "1x Initial 1:1 Assessment, 14 x Group Therapy Sessions, and 1x Review Session",
    type: "Group Package Deal",
    itemCode: "",
    duration: "60",
    price: "1000.00",
    rate: "Each",
    color: "#a855f7",
  },
  "3": {
    name: "2:2 Consultations",
    type: "2:2 Consultations",
    itemCode: "2997952838_61 627l_abc",
    duration: "60",
    price: "193.99",
    rate: "Hour",
    color: "#eab308",
  },
  "4": {
    name: "2. Payment optional - partial - Online booking",
    type: "1. Payment test - Online booking",
    itemCode: "sd",
    duration: "30",
    price: "200.00",
    rate: "Hour",
    color: "#9ca3af",
  },
  "5": {
    name: "3 cases services",
    type: "3 cases service",
    itemCode: "",
    duration: "45",
    price: "120.00",
    rate: "Hour",
    color: "#22c55e",
  },
};

const serviceTypeOptions = [
  { value: "1:1 Consultation", label: "1:1 Consultation" },
  { value: "Group Package Deal", label: "Group Package Deal" },
  { value: "2:2 Consultations", label: "2:2 Consultations" },
  { value: "1. Payment test - Online booking", label: "1. Payment test - Online booking" },
  { value: "3 cases service", label: "3 cases service" },
  { value: "Group", label: "Group" },
];

const rateOptions = [
  { value: "Hour", label: "Hour" },
  { value: "Each", label: "Each" },
  { value: "Session", label: "Session" },
];

const reminderOptions = [
  { value: "none", label: "No reminder" },
  { value: "1-hour", label: "1 hour before" },
  { value: "24-hours", label: "24 hours before" },
  { value: "48-hours", label: "48 hours before" },
  { value: "1-week", label: "1 week before" },
];

const forOptions = [
  { value: "appointment", label: "Appointment" },
  { value: "support-activity", label: "Support activity" },
];

export default function EditServiceClient({ id }: { id: string }) {
  const service = serviceData[id] || serviceData["1"];

  const [serviceFor, setServiceFor] = useState("appointment");
  const [onlineBookingEnabled, setOnlineBookingEnabled] = useState(false);
  const [onlinePayment, setOnlinePayment] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState("optional");
  const [smsReminder, setSmsReminder] = useState("24-hours");
  const [emailReminder, setEmailReminder] = useState("24-hours");
  const [confirmationSms, setConfirmationSms] = useState(true);
  const [confirmationEmail, setConfirmationEmail] = useState(true);

  return (
    <div style={{ minHeight: 'calc(100vh - 3rem)' }}>
      <div style={{ padding: '24px 24px 0' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Edit service</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ maxWidth: 672 }}>
          {/* For (Appointment / Support Activity) */}
          <div style={{ marginBottom: 16 }}>
            <Text variant="label/lg" as="label" color="text" style={{ marginBottom: 8, display: 'block' }}>For *</Text>
            <RadioGroup
              name="serviceFor"
              value={serviceFor}
              onChange={setServiceFor}
              options={forOptions}
            />
          </div>

          <FormInput label="Name *" defaultValue={service.name} />
          <div style={{ marginBottom: 16 }} />
          <FormSelect
            label="Type *"
            options={serviceTypeOptions}
            defaultValue={service.type}
          />
          <div style={{ marginBottom: 16 }} />
          <FormInput label="Item code" defaultValue={service.itemCode} />
          <div style={{ marginBottom: 16 }} />
          <FormInput label="Max number of clients" type="number" defaultValue="1" />
          <div style={{ marginBottom: 16 }} />
          <FormColorPicker
            label="Color"
            value={service.color}
            onChange={() => {}}
          />
          <div style={{ marginBottom: 16 }} />
          <FormTextarea label="Description" rows={3} placeholder="Enter a description for this service..." />

          <Divider variant="primary" style={{ margin: '24px 0' }} />

          {/* Pricing */}
          <Text variant="heading/lg" as="h2" style={{ marginBottom: 16 }}>Pricing</Text>
          <FormInput
            label="Price *"
            type="number"
            defaultValue={service.price}
          />
          <div style={{ marginBottom: 16 }} />
          <FormSelect
            label="Rate"
            options={rateOptions}
            defaultValue={service.rate}
          />
          <div style={{ marginBottom: 16 }} />
          <FormInput
            label="Duration (minutes) *"
            defaultValue={service.duration}
          />

          <Divider variant="primary" style={{ margin: '24px 0' }} />

          {/* Online booking */}
          <Text variant="heading/lg" as="h2" style={{ marginBottom: 16 }}>Online booking</Text>
          <Toggle
            checked={onlineBookingEnabled}
            onChange={setOnlineBookingEnabled}
            label="Enable online booking"
          />

          <Divider variant="primary" style={{ margin: '24px 0' }} />

          {/* Online payment */}
          <Text variant="heading/lg" as="h2" style={{ marginBottom: 16 }}>Online payment</Text>
          <Toggle checked={onlinePayment} onChange={setOnlinePayment} label="Enable online payment" />
          {onlinePayment && (
            <div style={{ marginTop: 16 }}>
              <FormSelect
                label="Payment requirement"
                value={paymentRequired}
                onChange={setPaymentRequired}
                options={[
                  { value: "optional", label: "Optional — client can choose to pay" },
                  { value: "required", label: "Required — must pay to confirm" },
                  { value: "deposit", label: "Deposit — partial payment required" },
                ]}
              />
            </div>
          )}

          <Divider variant="primary" style={{ margin: '24px 0' }} />

          {/* Appointment notifications */}
          <Text variant="heading/lg" as="h2" style={{ marginBottom: 16 }}>Appointment notifications</Text>
          <Flex vertical gap={16}>
            <Toggle checked={confirmationSms} onChange={setConfirmationSms} label="Send SMS confirmation" />
            <Toggle checked={confirmationEmail} onChange={setConfirmationEmail} label="Send email confirmation" />
            <FormSelect label="SMS reminder" value={smsReminder} onChange={setSmsReminder} options={reminderOptions} />
            <FormSelect label="Email reminder" value={emailReminder} onChange={setEmailReminder} options={reminderOptions} />
          </Flex>

          {/* Footer actions */}
          <Flex align="center" gap={16} style={{ marginTop: 32, marginBottom: 32 }}>
            <Button type="primary">Save</Button>
          </Flex>
        </div>
      </div>
    </div>
  );
}
