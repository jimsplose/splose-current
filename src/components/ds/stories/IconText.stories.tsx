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
