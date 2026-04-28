import type { Meta, StoryObj } from "@storybook/react";
import { UploadOutlined, PictureOutlined, CameraOutlined } from "@ant-design/icons";
import FileUpload from "../FileUpload";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof FileUpload> = {
  title: "Forms/FileUpload",
  component: FileUpload,
  tags: ["extended"],
  argTypes: {
    label: {
      control: "text",
      description: 'Button label text (default: "Upload")',
    },
  },
  parameters: {
    layout: "centered",
    appPages: [
      { label: "Patient details", vercel: "https://splose-current.vercel.app/clients/cmngtw7n9005eycwg4e67506h", localhost: "http://localhost:3000/clients/cmngtw7n9005eycwg4e67506h", production: "https://acme.splose.com/patients/446604/details" },
      { label: "Settings — Practice details", vercel: "https://splose-current.vercel.app/settings/details", localhost: "http://localhost:3000/settings/details", production: "https://acme.splose.com/settings/details" },
      { label: "Reports — NDIS bulk upload (new)", vercel: "https://splose-current.vercel.app/reports/ndis-bulk-upload/new", localhost: "http://localhost:3000/reports/ndis-bulk-upload/new", production: "https://acme.splose.com/reports/ndis-bulk-upload/new" },
    ],
    referenceUrl: "https://ant.design/components/upload",
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    icon: <UploadOutlined style={{ fontSize: 32, color: 'rgba(var(--color-primary), 0.4)' }} />,
    label: "Upload",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: { icon: <UploadOutlined style={{ fontSize: 32, color: 'rgba(var(--color-primary), 0.4)' }} />, label: "Upload" },
};

export const WithIcon: Story = {
  args: { icon: <PictureOutlined style={{ fontSize: 40, color: 'rgba(var(--color-primary), 0.4)' }} />, label: "Choose image" },
};

export const NoLabel: Story = {
  args: { icon: <UploadOutlined style={{ fontSize: 32, color: 'rgba(var(--color-primary), 0.4)' }} />, label: undefined },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  ProfilePhotoUpload                                                 */
/*  Pattern: Photo upload area for client profile editing               */
/*  Source: /clients/[id] edit mode — camera icon with upload button    */
/* ------------------------------------------------------------------ */

export const ProfilePhotoUpload: Story = {
  name: "Recipe: Profile Photo Upload",
  render: () => (
    <div style={{ width: 320 }}>
      <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 8 }}>Profile photo</p>
      <FileUpload
        icon={<CameraOutlined style={{ fontSize: 40, color: 'rgba(var(--color-primary), 0.4)' }} />}
        label="Upload photo"
        style={{ height: 160 }}
      />
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)', marginTop: 8 }}>
        Recommended: 256x256px, JPG or PNG, max 2MB
      </p>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  SettingsLogoUpload                                                 */
/*  Pattern: Business logo upload on the settings page. Uses an SVG    */
/*  mascot/logo as the icon with the Upload button below.              */
/*  Source: /settings — FileUpload with an SVG icon in the Details     */
/*  section, next to the business name and workspace URL fields         */
/* ------------------------------------------------------------------ */

export const SettingsLogoUpload: Story = {
  name: "Recipe: Settings Logo Upload",
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>
            Business name<span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            defaultValue="Hands Together Therapies"
            style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
            readOnly
          />
        </div>
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>Workspace URL</label>
          <input
            type="text"
            defaultValue="acme.splose.com"
            style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
            readOnly
          />
        </div>
      </div>
      <div style={{ width: 192, flexShrink: 0 }}>
        <FileUpload
          icon={
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="28" fill="#ede9fe" />
              <path d="M22 38c0-6 4-16 10-16s10 10 10 16" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
              <circle cx="28" cy="26" r="2" fill="#7c3aed" />
              <circle cx="36" cy="26" r="2" fill="#7c3aed" />
              <path d="M28 32c2 2 6 2 8 0" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          label="Upload"
        />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ClientProfilePhotoUpload                                           */
/*  Pattern: Small square upload area for client profile photo. Uses   */
/*  a text label as icon and compact sizing with p-0 override.        */
/*  Source: /clients/[id] ClientDetailClient.tsx — FileUpload in the   */
/*  edit form positioned to the right of the name/DOB fields           */
/* ------------------------------------------------------------------ */

export const ClientProfilePhotoUpload: Story = {
  name: "Recipe: Client Profile Photo Upload",
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>First name *</label>
          <input
            type="text"
            defaultValue="Liam"
            style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
            readOnly
          />
        </div>
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>Last name *</label>
          <input
            type="text"
            defaultValue="Nguyen"
            style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
            readOnly
          />
        </div>
      </div>
      <div style={{ flexShrink: 0, paddingTop: 24, textAlign: 'center' }}>
        <FileUpload
          icon={<span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Profile photo</span>}
          label="Upload"
          style={{ height: 128, width: 128, padding: 0 }}
        />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  OnlineBookingHeaderUpload                                          */
/*  Pattern: Header image upload for online booking editor. Uses a     */
/*  wider layout with Upload icon and drag-and-drop hint text.         */
/*  Source: /settings/online-bookings/[id] — logo/header image upload  */
/*  in the Design tab of the online booking editor                     */
/* ------------------------------------------------------------------ */

export const OnlineBookingHeaderUpload: Story = {
  name: "Recipe: Online Booking Header Upload",
  render: () => (
    <div style={{ maxWidth: 672, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>Booking page name</label>
        <input
          type="text"
          defaultValue="Standard Booking"
          style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
          readOnly
        />
      </div>
      <div>
        <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 8, display: 'block' }}>Logo / Header image</label>
        <FileUpload
          icon={<UploadOutlined style={{ fontSize: 32, color: 'var(--color-text-secondary)' }} />}
          label="Click or drag to upload"
          style={{ height: 128 }}
        />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  CSVImportUpload                                                    */
/*  Pattern: File upload zone for CSV data import. A taller drop       */
/*  zone with file type hints, used in the data import settings.       */
/*  Source: /settings/data-import/csv — upload zone for CSV files      */
/*  with drag-and-drop, file type restriction, and size limit hints    */
/* ------------------------------------------------------------------ */

export const CSVImportUpload: Story = {
  name: "Recipe: CSV Import Upload",
  render: () => (
    <div style={{ maxWidth: 672, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text)' }}>Upload CSV file</h3>
      <FileUpload
        icon={<UploadOutlined style={{ fontSize: 32, color: 'var(--color-text-secondary)' }} />}
        label="Click to upload or drag and drop"
        style={{ paddingTop: 48, paddingBottom: 48 }}
      />
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>CSV files only, max 10MB</p>
    </div>
  ),
  parameters: { layout: "padded" },
};
