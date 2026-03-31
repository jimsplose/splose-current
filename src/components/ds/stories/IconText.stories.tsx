import type { Meta, StoryObj } from "@storybook/react";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, GlobalOutlined, ClockCircleOutlined } from "@ant-design/icons";
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
    icon: <MailOutlined style={{ fontSize: 16 }} />,
    children: "hello@splose.com",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Email: Story = {
  args: { icon: <MailOutlined style={{ fontSize: 16 }} />, children: "hello@splose.com" },
};

export const PhoneNumber: Story = {
  args: { icon: <PhoneOutlined style={{ fontSize: 16 }} />, children: "0412 345 678" },
};

export const Location: Story = {
  args: { icon: <EnvironmentOutlined style={{ fontSize: 16 }} />, children: "123 Main St, Melbourne VIC 3000" },
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
    <div style={{ width: 320, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h3 className="text-text" style={{ fontWeight: 600 }}>Joseph Go</h3>
        <p className="text-text-secondary" style={{ fontSize: 12 }}>Occupational Therapist</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <IconText icon={<MailOutlined style={{ fontSize: 16 }} />}>joseph.go@splose.com</IconText>
        <IconText icon={<PhoneOutlined style={{ fontSize: 16 }} />}>0412 345 678</IconText>
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
    <div style={{ width: 384, display: 'flex', flexDirection: 'column', gap: 16, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h3 className="text-heading-lg text-text">Contact Information</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <IconText icon={<MailOutlined style={{ fontSize: 16 }} />}>emma.thompson@handstogether.com.au</IconText>
        <IconText icon={<PhoneOutlined style={{ fontSize: 16 }} />}>0408 123 456</IconText>
        <IconText icon={<EnvironmentOutlined style={{ fontSize: 16 }} />}>4 Williamstown Rd, Adelaide SA 5000</IconText>
        <IconText icon={<GlobalOutlined style={{ fontSize: 16 }} />}>www.handstogether.com.au</IconText>
        <IconText icon={<ClockCircleOutlined style={{ fontSize: 16 }} />}>Mon-Fri, 9:00 am - 5:00 pm</IconText>
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
    <div style={{ display: 'grid', width: 700, gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
      {[
        { name: "Joseph Go", role: "Occupational Therapist", email: "joseph.go@splose.com", phone: "0412 345 678", specialty: "Paediatrics" },
        { name: "Sarah Chen", role: "Speech Pathologist", email: "sarah.chen@splose.com", phone: "0408 999 111", specialty: null },
      ].map((p) => (
        <div key={p.name} style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="bg-primary" style={{ display: 'flex', height: 48, width: 48, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: 18, fontWeight: 600, color: '#fff' }}>
              {p.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 className="text-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{p.name}</h3>
              <p className="text-text-secondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>{p.role}</p>
              {p.specialty && (
                <span style={{ marginTop: 4, display: 'inline-block', borderRadius: '50%', backgroundColor: '#f3e8ff', paddingLeft: 8, paddingRight: 8, paddingTop: 2, paddingBottom: 2, fontSize: 11, color: '#7e22ce' }}>
                  {p.specialty}
                </span>
              )}
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <IconText icon={<MailOutlined style={{ fontSize: 16 }} />}>{p.email}</IconText>
            <IconText icon={<PhoneOutlined style={{ fontSize: 16 }} />}>{p.phone}</IconText>
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
    <div style={{ width: 500, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Contact information</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
        <div style={{ display: 'flex', gap: 64 }}>
          <span className="text-text-secondary" style={{ width: 112, flexShrink: 0 }}>Email:</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MailOutlined style={{ fontSize: 14 }} className="text-text-secondary" />
            <span className="text-primary">cheng@splose.com</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 64 }}>
          <span className="text-text-secondary" style={{ width: 112, flexShrink: 0 }}>Mobile phone:</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <PhoneOutlined style={{ fontSize: 14 }} className="text-text-secondary" />
            <span className="text-primary">+61 423 939 047</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 64 }}>
          <span className="text-text-secondary" style={{ width: 112, flexShrink: 0 }}>Address:</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <EnvironmentOutlined style={{ fontSize: 14 }} className="text-text-secondary" />
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
    <div style={{ width: 320, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h4 className="text-heading-sm text-text" style={{ marginBottom: 12 }}>With phone</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <IconText icon={<MailOutlined style={{ fontSize: 16 }} />}>alex@splose.com</IconText>
        <IconText icon={<PhoneOutlined style={{ fontSize: 16 }} />}>0412 345 678</IconText>
      </div>

      <hr className="border-border" style={{ marginTop: 16, marginBottom: 16 }} />

      <h4 className="text-heading-sm text-text" style={{ marginBottom: 12 }}>Without phone</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <IconText icon={<MailOutlined style={{ fontSize: 16 }} />}>sarah@splose.com</IconText>
        <p className="text-body-sm text-text-secondary">No phone number on file</p>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
