"use client";

import { useState } from "react";
import {
  Button,
  FormInput,
  FormSelect,
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

export default function EditServiceClient({ id }: { id: string }) {
  const service = serviceData[id] || serviceData["1"];

  const [onlineBookingEnabled, setOnlineBookingEnabled] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar backHref="/settings/services" title="Edit service">
        <Button variant="primary">Save</Button>
      </Navbar>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-0">
          {/* General */}
          <Collapse title="General" defaultOpen>
            <div className="space-y-4">
              <FormInput label="Name" defaultValue={service.name} />
              <FormSelect
                label="Type"
                options={serviceTypeOptions}
                defaultValue={service.type}
              />
              <FormInput label="Item code" defaultValue={service.itemCode} />
              <div>
                <label className="mb-1 block text-label-md text-text">
                  Color
                </label>
                <input
                  type="color"
                  defaultValue={service.color}
                  className="h-10 w-14 cursor-pointer rounded-md border border-border bg-white p-1"
                />
              </div>
            </div>
          </Collapse>

          {/* Pricing */}
          <Collapse title="Pricing" defaultOpen>
            <div className="space-y-4">
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
            </div>
          </Collapse>

          {/* Online booking */}
          <Collapse title="Online booking" defaultOpen>
            <div className="py-1">
              <Toggle
                checked={onlineBookingEnabled}
                onChange={setOnlineBookingEnabled}
                label="Enable online booking"
              />
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  );
}
