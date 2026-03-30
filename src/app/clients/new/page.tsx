"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flex } from "antd";
import {
  Button,
  Card,
  FormInput,
  FormSelect,
  Navbar,
  Select,
} from "@/components/ds";

const titleOptions = [
  { value: "", label: "Select title" },
  { value: "Mr", label: "Mr" },
  { value: "Mrs", label: "Mrs" },
  { value: "Ms", label: "Ms" },
  { value: "Dr", label: "Dr" },
  { value: "Prof", label: "Prof" },
];

const genderOptions = [
  { value: "", label: "Select gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
  { value: "prefer-not", label: "Prefer not to say" },
];

const stateOptions = [
  { value: "", label: "Select state" },
  { value: "NSW", label: "NSW" },
  { value: "VIC", label: "VIC" },
  { value: "QLD", label: "QLD" },
  { value: "SA", label: "SA" },
  { value: "WA", label: "WA" },
  { value: "TAS", label: "TAS" },
  { value: "NT", label: "NT" },
  { value: "ACT", label: "ACT" },
];

const referralOptions = [
  { value: "", label: "Select referral source" },
  { value: "gp-referral", label: "GP Referral" },
  { value: "specialist-referral", label: "Specialist Referral" },
  { value: "self-referral", label: "Self Referral" },
  { value: "word-of-mouth", label: "Word of Mouth" },
  { value: "online-search", label: "Online Search" },
  { value: "social-media", label: "Social Media" },
  { value: "insurance", label: "Insurance" },
  { value: "other", label: "Other" },
];

const tagOptions = [
  { value: "ndis", label: "NDIS" },
  { value: "medicare", label: "Medicare" },
  { value: "dva", label: "DVA" },
  { value: "private", label: "Private" },
  { value: "workers-comp", label: "Workers Comp" },
  { value: "telehealth", label: "Telehealth" },
  { value: "paediatric", label: "Paediatric" },
];

const practitionerOptions = [
  { value: "", label: "Select practitioner" },
  { value: "sarah-chen", label: "Sarah Chen" },
  { value: "james-wilson", label: "James Wilson" },
  { value: "emma-thompson", label: "Emma Thompson" },
  { value: "rachel-kim", label: "Rachel Kim" },
  { value: "marcus-chen", label: "Marcus Chen" },
  { value: "priya-sharma", label: "Priya Sharma" },
  { value: "daniel-obrien", label: "Daniel O'Brien" },
  { value: "mei-lin", label: "Mei Lin" },
  { value: "ben-torres", label: "Ben Torres" },
  { value: "zara-patel", label: "Zara Patel" },
];

export default function NewClientPage() {
  const router = useRouter();

  // General details
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  // Contact details
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");

  // Additional
  const [referralSource, setReferralSource] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [practitioner, setPractitioner] = useState("");

  // Medicare
  const [medicareNumber, setMedicareNumber] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  return (
    <div style={{ minHeight: 'calc(100vh - 3rem)' }}>
      <Navbar backHref="/clients" title="New client">
        <Button variant="secondary" onClick={() => router.push("/clients")}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => router.push("/clients")}>
          Save
        </Button>
      </Navbar>

      <div style={{ maxWidth: '56rem', marginLeft: 'auto', marginRight: 'auto', padding: 24 }}>
        <Flex vertical gap={24}>
          {/* General details */}
          <Card title="General details" headerBar>
            <Flex vertical gap={16}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <FormSelect
                  label="Title"
                  value={title}
                  onChange={setTitle}
                  options={titleOptions}
                />
                <FormInput
                  label="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
                <FormInput
                  label="Preferred name"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  placeholder="Preferred name"
                />
                <FormInput
                  label="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                <FormInput
                  label="Date of birth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
                <FormSelect
                  label="Gender"
                  value={gender}
                  onChange={setGender}
                  options={genderOptions}
                />
              </div>
            </Flex>
          </Card>

          {/* Contact details */}
          <Card title="Contact details" headerBar>
            <Flex vertical gap={16}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                <FormInput
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
                <FormInput
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="02 1234 5678"
                />
              </div>
              <FormInput
                label="Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="0412 345 678"
              />
              <FormInput
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address"
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <FormInput
                  label="Suburb"
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  placeholder="Suburb"
                />
                <FormSelect
                  label="State"
                  value={state}
                  onChange={setState}
                  options={stateOptions}
                />
                <FormInput
                  label="Postcode"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="3000"
                />
              </div>
            </Flex>
          </Card>

          {/* Additional */}
          <Card title="Additional" headerBar>
            <Flex vertical gap={16}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                <FormSelect
                  label="Referral source"
                  value={referralSource}
                  onChange={setReferralSource}
                  options={referralOptions}
                />
                <FormSelect
                  label="Practitioner"
                  value={practitioner}
                  onChange={setPractitioner}
                  options={practitionerOptions}
                />
              </div>
              <Select
                label="Tags"
                options={tagOptions}
                value={tags.join(",")}
                onChange={(val) => {
                  if (!val) {
                    setTags([]);
                  } else if (tags.includes(val)) {
                    setTags(tags.filter((t) => t !== val));
                  } else {
                    setTags([...tags, val]);
                  }
                }}
                placeholder="Select tags"
                searchable
              />
              {tags.length > 0 && (
                <Flex wrap gap={8}>
                  {tags.map((tag) => {
                    const opt = tagOptions.find((o) => o.value === tag);
                    return (
                      <span
                        key={tag}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          borderRadius: 9999,
                          backgroundColor: 'var(--color-primary-bg)',
                          paddingLeft: 12,
                          paddingRight: 12,
                          paddingTop: 4,
                          paddingBottom: 4,
                          fontSize: 14,
                          color: 'var(--color-primary)',
                        }}
                      >
                        {opt?.label || tag}
                        <button
                          type="button"
                          onClick={() => setTags(tags.filter((t) => t !== tag))}
                          style={{ marginLeft: 2 }}
                        >
                          x
                        </button>
                      </span>
                    );
                  })}
                </Flex>
              )}
            </Flex>
          </Card>

          {/* Medicare */}
          <Card title="Medicare" headerBar>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <FormInput
                label="Medicare number"
                value={medicareNumber}
                onChange={(e) => setMedicareNumber(e.target.value)}
                placeholder="1234 56789 0"
              />
              <FormInput
                label="Reference number"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="1"
              />
              <FormInput
                label="Expiry date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </Card>
        </Flex>
      </div>
    </div>
  );
}
