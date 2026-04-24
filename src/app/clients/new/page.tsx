"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flex, Form, Input, Select } from "antd";
import { Card, FormPage, Grid } from "@/components/ds";

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
  const [form] = Form.useForm();

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
    <FormPage
      title="New client"
      backHref="/clients"
      maxWidth={896}
      style={{ minHeight: 'calc(100vh - 3rem)' }}
      actions={
        <>
          <Button onClick={() => router.push("/clients")}>
            Cancel
          </Button>
          <Button type="primary" onClick={() => router.push("/clients")}>
            Save
          </Button>
        </>
      }
    >
        <Flex vertical gap={24}>
          {/* General details */}
          <Card title="General details" headerBar>
            <Form form={form} layout="vertical">
              <Flex vertical gap={16}>
                <Grid cols={4} gap="md">
                  <Form.Item label="Title">
                    <Select value={title} onChange={setTitle} options={titleOptions} style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item label="First name">
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
                  </Form.Item>
                  <Form.Item label="Preferred name">
                    <Input value={preferredName} onChange={(e) => setPreferredName(e.target.value)} placeholder="Preferred name" />
                  </Form.Item>
                  <Form.Item label="Last name">
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
                  </Form.Item>
                </Grid>
                <Grid cols={2} gap="md">
                  <Form.Item label="Date of birth">
                    <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                  </Form.Item>
                  <Form.Item label="Gender">
                    <Select value={gender} onChange={setGender} options={genderOptions} style={{ width: "100%" }} />
                  </Form.Item>
                </Grid>
              </Flex>
            </Form>
          </Card>

          {/* Contact details */}
          <Card title="Contact details" headerBar>
            <Form form={form} layout="vertical">
              <Flex vertical gap={16}>
                <Grid cols={2} gap="md">
                  <Form.Item label="Email">
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
                  </Form.Item>
                  <Form.Item label="Phone">
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="02 1234 5678" />
                  </Form.Item>
                </Grid>
                <Form.Item label="Mobile">
                  <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="0412 345 678" />
                </Form.Item>
                <Form.Item label="Address">
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address" />
                </Form.Item>
                <Grid cols={3} gap="md">
                  <Form.Item label="Suburb">
                    <Input value={suburb} onChange={(e) => setSuburb(e.target.value)} placeholder="Suburb" />
                  </Form.Item>
                  <Form.Item label="State">
                    <Select value={state} onChange={setState} options={stateOptions} style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item label="Postcode">
                    <Input value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="3000" />
                  </Form.Item>
                </Grid>
              </Flex>
            </Form>
          </Card>

          {/* Additional */}
          <Card title="Additional" headerBar>
            <Form form={form} layout="vertical">
              <Flex vertical gap={16}>
                <Grid cols={2} gap="md">
                  <Form.Item label="Referral source">
                    <Select value={referralSource} onChange={setReferralSource} options={referralOptions} style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item label="Practitioner">
                    <Select value={practitioner} onChange={setPractitioner} options={practitionerOptions} style={{ width: "100%" }} />
                  </Form.Item>
                </Grid>
                <Form.Item label="Tags">
                  <Select
                    options={tagOptions}
                    value={tags.join(",")}
                    onChange={(val: string) => {
                      if (!val) {
                        setTags([]);
                      } else if (tags.includes(val)) {
                        setTags(tags.filter((t) => t !== val));
                      } else {
                        setTags([...tags, val]);
                      }
                    }}
                    placeholder="Select tags"
                    showSearch
                    style={{ width: "100%" }}
                  />
                </Form.Item>
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
            </Form>
          </Card>

          {/* Medicare */}
          <Card title="Medicare" headerBar>
            <Form form={form} layout="vertical">
              <Grid cols={3} gap="md">
                <Form.Item label="Medicare number">
                  <Input value={medicareNumber} onChange={(e) => setMedicareNumber(e.target.value)} placeholder="1234 56789 0" />
                </Form.Item>
                <Form.Item label="Reference number">
                  <Input value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} placeholder="1" />
                </Form.Item>
                <Form.Item label="Expiry date">
                  <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                </Form.Item>
              </Grid>
            </Form>
          </Card>
        </Flex>
    </FormPage>
  );
}
