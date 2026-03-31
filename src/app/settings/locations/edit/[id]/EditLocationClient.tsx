"use client";

import { useState } from "react";
import Link from "next/link";
import { Flex } from "antd";
import { Button, Checkbox, FormInput, FormSelect, Toggle, Collapse } from "@/components/ds";

const services = [
  "ACC - Acupuncture Initial Consultation",
  "ACC - Allied Health Initial Assessment",
  "ACC - Exercise Physiology Initial Consultation",
  "ACC - Myotherapy Initial Consultation",
  "ACC - Occupational Therapy Initial Consultation",
  "ACC - Osteopathy Initial Consultation",
  "ACC - Physiotherapy Initial Consultation",
  "ACC - Podiatry Initial Consultation",
  "ACC - Psychology Initial Consultation",
  "ACC - Remedial Massage Initial Consultation",
  "ACC - Speech Pathology Initial Consultation",
  "Better Access - Psychological Therapy (50min)",
  "Better Access - Psychological Therapy (60min+)",
  "Block appointment",
  "CDMP - Allied Health Initial Assessment",
  "CDMP - Dietetics",
  "CDMP - Exercise Physiology",
  "CDMP - Occupational Therapy",
  "CDMP - Osteopathy",
  "CDMP - Physiotherapy",
  "CDMP - Podiatry",
  "CDMP - Psychology",
  "CDMP - Remedial Massage",
  "CDMP - Speech Pathology",
  "Chiropractic - Initial Consultation",
  "Chiropractic - Standard Consultation",
  "Counselling - Initial Consultation",
  "Counselling - Standard Consultation",
  "Dietetics - Initial Consultation",
  "Dietetics - Standard Consultation",
  "DVA - Allied Health Initial Assessment",
  "DVA - Dietetics",
  "DVA - Exercise Physiology",
  "DVA - Occupational Therapy",
  "DVA - Osteopathy",
  "DVA - Physiotherapy",
  "DVA - Podiatry",
  "DVA - Psychology",
  "DVA - Remedial Massage",
  "DVA - Speech Pathology",
  "Exercise Physiology - Group Session",
  "Exercise Physiology - Initial Consultation",
  "Exercise Physiology - Standard Consultation",
  "GP Management Plan Review",
  "Mental Health - Initial Consultation",
  "Mental Health - Standard Consultation",
  "Myotherapy - Initial Consultation",
  "Myotherapy - Standard Consultation",
  "NDIS - Art Therapy",
  "NDIS - Assistive Technology Assessment",
  "NDIS - Behaviour Support",
  "NDIS - Capacity Building",
  "NDIS - Core Support",
  "NDIS - Counselling",
  "NDIS - Dietetics",
  "NDIS - Exercise Physiology",
  "NDIS - Group Session",
  "NDIS - Music Therapy",
  "NDIS - Occupational Therapy",
  "NDIS - Physiotherapy",
  "NDIS - Plan Management",
  "NDIS - Podiatry",
  "NDIS - Psychology",
  "NDIS - Report Writing",
  "NDIS - Speech Pathology",
  "NDIS - Support Coordination",
  "NDIS - Travel",
  "Occupational Therapy - Initial Consultation",
  "Occupational Therapy - Standard Consultation",
  "Osteopathy - Initial Consultation",
  "Osteopathy - Standard Consultation",
  "Physiotherapy - Group Session",
  "Physiotherapy - Initial Consultation",
  "Physiotherapy - Standard Consultation",
  "Podiatry - Initial Consultation",
  "Podiatry - Standard Consultation",
  "Psychology - Initial Consultation (60min)",
  "Psychology - Initial Consultation (90min)",
  "Psychology - Standard Consultation (50min)",
  "Psychology - Standard Consultation (60min)",
  "Remedial Massage - 30min",
  "Remedial Massage - 45min",
  "Remedial Massage - 60min",
  "Remedial Massage - 90min",
  "Speech Pathology - Group Session",
  "Speech Pathology - Initial Consultation",
  "Speech Pathology - Standard Consultation",
  "TAC - Allied Health Initial Assessment",
  "TAC - Dietetics",
  "TAC - Exercise Physiology",
  "TAC - Occupational Therapy",
  "TAC - Osteopathy",
  "TAC - Physiotherapy",
  "TAC - Podiatry",
  "TAC - Psychology",
  "TAC - Remedial Massage",
  "TAC - Speech Pathology",
  "Telehealth - Dietetics",
  "Telehealth - Exercise Physiology",
  "Telehealth - Occupational Therapy",
  "Telehealth - Physiotherapy",
  "Telehealth - Psychology",
  "Telehealth - Speech Pathology",
  "Workers Comp - Allied Health Initial Assessment",
  "Workers Comp - Dietetics",
  "Workers Comp - Exercise Physiology",
  "Workers Comp - Occupational Therapy",
  "Workers Comp - Osteopathy",
  "Workers Comp - Physiotherapy",
  "Workers Comp - Podiatry",
  "Workers Comp - Psychology",
  "Workers Comp - Remedial Massage",
  "Workers Comp - Speech Pathology",
];

interface LocationInfo {
  name: string;
  abn: string;
  email: string;
  phone: string;
  fax: string;
  web: string;
  address: string;
  suburb: string;
  state: string;
  postCode: string;
  country: string;
}

const locationData: Record<string, LocationInfo> = {
  "128": {
    name: "East Clinics",
    abn: "",
    email: "",
    phone: "",
    fax: "",
    web: "",
    address: "",
    suburb: "",
    state: "",
    postCode: "",
    country: "Australia",
  },
  "129": {
    name: "Splose OT",
    abn: "",
    email: "",
    phone: "",
    fax: "",
    web: "",
    address: "",
    suburb: "",
    state: "",
    postCode: "",
    country: "Australia",
  },
  "130": {
    name: "Ploc",
    abn: "",
    email: "",
    phone: "",
    fax: "",
    web: "",
    address: "",
    suburb: "",
    state: "",
    postCode: "",
    country: "Australia",
  },
  "131": {
    name: "Tasks",
    abn: "",
    email: "",
    phone: "",
    fax: "",
    web: "",
    address: "",
    suburb: "",
    state: "",
    postCode: "",
    country: "Australia",
  },
  "132": {
    name: "Sharon\u2019s",
    abn: "",
    email: "",
    phone: "",
    fax: "",
    web: "",
    address: "",
    suburb: "",
    state: "",
    postCode: "",
    country: "Australia",
  },
  "133": {
    name: "One service only",
    abn: "",
    email: "",
    phone: "",
    fax: "",
    web: "",
    address: "297 Pirie St",
    suburb: "Adelaide",
    state: "SA",
    postCode: "5000",
    country: "Australia",
  },
};

const stateOptions = [
  { value: "", label: "Select state" },
  { value: "ACT", label: "ACT" },
  { value: "NSW", label: "NSW" },
  { value: "NT", label: "NT" },
  { value: "QLD", label: "QLD" },
  { value: "SA", label: "SA" },
  { value: "TAS", label: "TAS" },
  { value: "VIC", label: "VIC" },
  { value: "WA", label: "WA" },
];

export default function EditLocationClient({ id }: { id: string }) {
  const location = locationData[id] || locationData["128"];

  const [enabledServices, setEnabledServices] = useState<Set<string>>(
    new Set(services),
  );
  const [onlineBookingsEnabled, setOnlineBookingsEnabled] = useState(true);
  const [phoneNotice, setPhoneNotice] = useState(true);
  const [emailNotice, setEmailNotice] = useState(true);

  const toggleService = (service: string) => {
    setEnabledServices((prev) => {
      const next = new Set(prev);
      if (next.has(service)) {
        next.delete(service);
      } else {
        next.add(service);
      }
      return next;
    });
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Flex align="center" justify="space-between" style={{ marginBottom: 24 }}>
        <Flex align="center" gap={12}>
          <Link
            href="/settings/locations"
            style={{ display: 'inline-flex', height: 32, width: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', transition: 'all 0.2s' }}
          >
            <svg
              style={{ height: 16, width: 16 }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-display-lg">{location.name}</h1>
        </Flex>
        <Flex align="center" gap={12}>
          <Button variant="danger">Delete</Button>
          <Button variant="primary">Save</Button>
        </Flex>
      </Flex>

      {/* Form */}
      <Flex vertical gap={20} style={{ maxWidth: 672 }}>
        <FormInput label="Name" defaultValue={location.name} />
        <FormInput label="ABN" defaultValue={location.abn} />
        <FormInput label="Email" type="email" defaultValue={location.email} />
        <FormInput label="Phone" type="tel" defaultValue={location.phone} />
        <FormInput label="Fax" defaultValue={location.fax} />
        <FormInput label="Web address" type="url" defaultValue={location.web} />

        {/* Location address section */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20 }}>
          <h2 className="text-heading-lg text-text" style={{ marginBottom: 4 }}>
            Location address
          </h2>
          <p className="text-body-md text-text-secondary" style={{ marginBottom: 16 }}>
            Enter your location address below to enable timezone detection for
            online bookings so that clients booking from a different timezone see
            the correct times on your booking page.
          </p>
          <Flex vertical gap={16}>
            <FormInput label="Address" defaultValue={location.address} />
            <FormInput label="Suburb" defaultValue={location.suburb} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormSelect
                label="State"
                options={stateOptions}
                defaultValue={location.state}
              />
              <FormInput label="Post code" defaultValue={location.postCode} />
            </div>
            <FormInput label="Country" defaultValue={location.country} />
          </Flex>
        </div>

        {/* Services available at this location */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20 }}>
          <Collapse title="Services available at this location" defaultOpen>
            <Flex vertical gap={8}>
              {services.map((service) => (
                <div key={service} style={{ borderRadius: 4, padding: '4px 4px' }}>
                  <Checkbox
                    label={service}
                    checked={enabledServices.has(service)}
                    onChange={() => toggleService(service)}
                  />
                </div>
              ))}
            </Flex>
          </Collapse>
        </div>

        {/* Online bookings */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20 }}>
          <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>
            Online bookings
          </h2>
          <Toggle
            checked={onlineBookingsEnabled}
            onChange={setOnlineBookingsEnabled}
            label="Enable online bookings for this location"
          />
        </div>

        {/* Notices */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20, paddingBottom: 32 }}>
          <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Notices</h2>
          <Flex vertical gap={12}>
            <Toggle
              checked={phoneNotice}
              onChange={setPhoneNotice}
              label="Phone"
            />
            <Toggle
              checked={emailNotice}
              onChange={setEmailNotice}
              label="Email"
            />
          </Flex>
        </div>
      </Flex>
    </div>
  );
}
