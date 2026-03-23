"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  FormInput,
  FormSelect,
  Toggle,
  Collapse,
  Navbar,
} from "@/components/ds";

const stateOptions = [
  { value: "", label: "Select state" },
  { value: "SA", label: "South Australia" },
  { value: "VIC", label: "Victoria" },
  { value: "NSW", label: "New South Wales" },
  { value: "QLD", label: "Queensland" },
  { value: "WA", label: "Western Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "NT", label: "Northern Territory" },
  { value: "ACT", label: "Australian Capital Territory" },
];

const countryOptions = [
  { value: "AU", label: "Australia" },
  { value: "NZ", label: "New Zealand" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
];

export default function NewLocationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [abn, setAbn] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [web, setWeb] = useState("");
  const [address, setAddress] = useState("");
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("AU");
  const [onlineBooking, setOnlineBooking] = useState(false);

  return (
    <div>
      <Navbar backHref="/settings/locations" title="New location">
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => router.push("/settings/locations")}>Cancel</Button>
          <Button variant="primary" onClick={() => router.push("/settings/locations")}>Save</Button>
        </div>
      </Navbar>

      <div className="mx-auto max-w-3xl space-y-4 p-6">
        <Collapse title="General" defaultOpen>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. East Clinics" />
              <FormInput label="ABN" value={abn} onChange={(e) => setAbn(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <FormInput label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Fax" value={fax} onChange={(e) => setFax(e.target.value)} />
              <FormInput label="Website" value={web} onChange={(e) => setWeb(e.target.value)} />
            </div>
          </div>
        </Collapse>

        <Collapse title="Address" defaultOpen>
          <div className="space-y-4">
            <FormInput label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <div className="grid grid-cols-3 gap-4">
              <FormInput label="Suburb" value={suburb} onChange={(e) => setSuburb(e.target.value)} />
              <FormSelect label="State" value={state} onChange={(e) => setState(e.target.value)} options={stateOptions} />
              <FormInput label="Post code" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
            </div>
            <FormSelect label="Country" value={country} onChange={(e) => setCountry(e.target.value)} options={countryOptions} />
          </div>
        </Collapse>

        <Collapse title="Online booking">
          <Toggle label="Enable online booking for this location" checked={onlineBooking} onChange={setOnlineBooking} />
        </Collapse>
      </div>
    </div>
  );
}
