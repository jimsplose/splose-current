"use client";

import { useState } from "react";
import { Flex } from "antd";
import {
  Button,
  FormInput,
  FormSelect,
  FormColorPicker,
  FormTextarea,
  Toggle,
  Collapse,
  Navbar,
} from "@/components/ds";

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

export default function EditServiceClient({ id }: { id: string }) {
  const service = serviceData[id] || serviceData["1"];

  const [onlineBookingEnabled, setOnlineBookingEnabled] = useState(false);
  const [onlinePayment, setOnlinePayment] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState("optional");
  const [smsReminder, setSmsReminder] = useState("24-hours");
  const [emailReminder, setEmailReminder] = useState("24-hours");
  const [confirmationSms, setConfirmationSms] = useState(true);
  const [confirmationEmail, setConfirmationEmail] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar backHref="/settings/services" title="Edit service">
        <Button variant="primary">Save</Button>
      </Navbar>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ maxWidth: 672 }}>
          {/* General */}
          <Collapse title="General" defaultOpen>
            <Flex vertical gap={16}>
              <FormInput label="Name" defaultValue={service.name} />
              <FormSelect
                label="Type"
                options={serviceTypeOptions}
                defaultValue={service.type}
              />
              <FormInput label="Item code" defaultValue={service.itemCode} />
              <FormColorPicker
                label="Color"
                value={service.color}
                onChange={() => {}}
              />
            </Flex>
          </Collapse>

          {/* Pricing */}
          <Collapse title="Pricing" defaultOpen>
            <Flex vertical gap={16}>
              <FormInput
                label="Price"
                type="number"
                defaultValue={service.price}
              />
              <FormSelect
                label="Rate"
                options={rateOptions}
                defaultValue={service.rate}
              />
              <FormInput
                label="Duration (minutes)"
                defaultValue={service.duration}
              />
            </Flex>
          </Collapse>

          {/* Online booking */}
          <Collapse title="Online booking" defaultOpen>
            <div style={{ padding: '4px 0' }}>
              <Toggle
                checked={onlineBookingEnabled}
                onChange={setOnlineBookingEnabled}
                label="Enable online booking"
              />
            </div>
          </Collapse>

          {/* Online payment */}
          <Collapse title="Online payment">
            <Flex vertical gap={16}>
              <Toggle checked={onlinePayment} onChange={setOnlinePayment} label="Enable online payment" />
              {onlinePayment && (
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
              )}
            </Flex>
          </Collapse>

          {/* Appointment notifications */}
          <Collapse title="Appointment notifications">
            <Flex vertical gap={16}>
              <Toggle checked={confirmationSms} onChange={setConfirmationSms} label="Send SMS confirmation" />
              <Toggle checked={confirmationEmail} onChange={setConfirmationEmail} label="Send email confirmation" />
              <FormSelect label="SMS reminder" value={smsReminder} onChange={setSmsReminder} options={reminderOptions} />
              <FormSelect label="Email reminder" value={emailReminder} onChange={setEmailReminder} options={reminderOptions} />
            </Flex>
          </Collapse>
        </div>
      </div>
    </div>
  );
}
