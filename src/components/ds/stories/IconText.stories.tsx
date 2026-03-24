import type { Meta, StoryObj } from "@storybook/react";
import { Mail, Phone, MapPin, Globe, Clock } from "lucide-react";
import IconText from "../IconText";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof IconText> = {
  title: "Data Display/IconText",
  component: IconText,
  argTypes: {
    children: {
      control: "text",
      description: "Text content beside the icon",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof IconText>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    icon: <Mail className="h-4 w-4" />,
    children: "hello@splose.com",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Email: Story = {
  args: { icon: <Mail className="h-4 w-4" />, children: "hello@splose.com" },
};

export const PhoneNumber: Story = {
  args: { icon: <Phone className="h-4 w-4" />, children: "0412 345 678" },
};

export const Location: Story = {
  args: { icon: <MapPin className="h-4 w-4" />, children: "123 Main St, Melbourne VIC 3000" },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  PractitionerContactInfo                                            */
/*  Pattern: Email and phone contact info inside practitioner cards     */
/*  Source: /practitioners — email + phone IconText rows below          */
/*  the practitioner name and role                                     */
/* ------------------------------------------------------------------ */

export const PractitionerContactInfo: Story = {
  name: "Recipe: Practitioner Contact Info",
  render: () => (
    <div className="w-80 rounded-lg border border-border bg-white p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-text">Joseph Go</h3>
        <p className="text-sm text-text-secondary">Occupational Therapist</p>
      </div>
      <div className="space-y-2">
        <IconText icon={<Mail className="h-4 w-4" />}>joseph.go@splose.com</IconText>
        <IconText icon={<Phone className="h-4 w-4" />}>0412 345 678</IconText>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ContactDetailsSection                                              */
/*  Pattern: Multiple icon-text rows for a full contact details block   */
/*  Source: practitioner/client detail views — grouped contact info      */
/* ------------------------------------------------------------------ */

export const ContactDetailsSection: Story = {
  name: "Recipe: Contact Details Section",
  render: () => (
    <div className="w-96 space-y-4 rounded-lg border border-border bg-white p-6">
      <h3 className="text-heading-lg text-text">Contact Information</h3>
      <div className="space-y-3">
        <IconText icon={<Mail className="h-4 w-4" />}>emma.thompson@handstogether.com.au</IconText>
        <IconText icon={<Phone className="h-4 w-4" />}>0408 123 456</IconText>
        <IconText icon={<MapPin className="h-4 w-4" />}>4 Williamstown Rd, Adelaide SA 5000</IconText>
        <IconText icon={<Globe className="h-4 w-4" />}>www.handstogether.com.au</IconText>
        <IconText icon={<Clock className="h-4 w-4" />}>Mon-Fri, 9:00 am - 5:00 pm</IconText>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  PractitionerCardGrid                                               */
/*  Pattern: Grid of practitioner cards with Avatar, badge, IconText   */
/*  and stats — the full card layout from the practitioners list page  */
/*  Source: src/app/practitioners/page.tsx                              */
/* ------------------------------------------------------------------ */

export const PractitionerCardGrid: Story = {
  name: "Recipe: Practitioner Card Grid",
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-6">
      {[
        { name: "Joseph Go", role: "Occupational Therapist", email: "joseph.go@splose.com", phone: "0412 345 678", specialty: "Paediatrics" },
        { name: "Sarah Chen", role: "Speech Pathologist", email: "sarah.chen@splose.com", phone: "0408 999 111", specialty: null },
      ].map((p) => (
        <div key={p.name} className="rounded-lg border border-border bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
              {p.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-text">{p.name}</h3>
              <p className="truncate text-sm text-text-secondary">{p.role}</p>
              {p.specialty && (
                <span className="mt-1 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                  {p.specialty}
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <IconText icon={<Mail className="h-4 w-4" />}>{p.email}</IconText>
            <IconText icon={<Phone className="h-4 w-4" />}>{p.phone}</IconText>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ContactDetailInline                                                */
/*  Pattern: Inline email/phone/address with icons inside a label-     */
/*  value detail row — contact info section on /contacts/[id]          */
/*  Source: src/app/contacts/[id]/page.tsx — Contact information        */
/* ------------------------------------------------------------------ */

export const ContactDetailInline: Story = {
  name: "Recipe: Contact Detail Inline",
  render: () => (
    <div className="w-[500px] rounded-lg border border-border bg-white p-6">
      <h2 className="mb-4 text-heading-lg text-text">Contact information</h2>
      <div className="space-y-3 text-sm">
        <div className="flex gap-16">
          <span className="w-28 shrink-0 text-text-secondary">Email:</span>
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-text-secondary" />
            <span className="text-primary">cheng@splose.com</span>
          </span>
        </div>
        <div className="flex gap-16">
          <span className="w-28 shrink-0 text-text-secondary">Mobile phone:</span>
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-text-secondary" />
            <span className="text-primary">+61 423 939 047</span>
          </span>
        </div>
        <div className="flex gap-16">
          <span className="w-28 shrink-0 text-text-secondary">Address:</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-text-secondary" />
            <span className="text-text">45 Collins St, Melbourne VIC 3000</span>
          </span>
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ConditionalPhoneRow                                                */
/*  Pattern: IconText for phone only rendered when the value exists —  */
/*  shows the optional/conditional rendering pattern                    */
/*  Source: src/app/practitioners/page.tsx — conditional phone display  */
/* ------------------------------------------------------------------ */

export const ConditionalPhoneRow: Story = {
  name: "Recipe: Conditional Phone Row",
  render: () => (
    <div className="w-80 rounded-lg border border-border bg-white p-6">
      <h4 className="mb-3 text-heading-sm text-text">With phone</h4>
      <div className="space-y-2">
        <IconText icon={<Mail className="h-4 w-4" />}>alex@splose.com</IconText>
        <IconText icon={<Phone className="h-4 w-4" />}>0412 345 678</IconText>
      </div>

      <hr className="my-4 border-border" />

      <h4 className="mb-3 text-heading-sm text-text">Without phone</h4>
      <div className="space-y-2">
        <IconText icon={<Mail className="h-4 w-4" />}>sarah@splose.com</IconText>
        <p className="text-body-sm text-text-secondary">No phone number on file</p>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
