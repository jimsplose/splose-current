import type { Meta, StoryObj } from "@storybook/react";
import { UploadOutlined, PictureOutlined, CameraOutlined } from "@ant-design/icons";
import FileUpload from "../FileUpload";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof FileUpload> = {
  title: "Forms/FileUpload",
  component: FileUpload,
  argTypes: {
    label: {
      control: "text",
      description: 'Button label text (default: "Upload")',
    },
  },
  parameters: {
    layout: "centered",
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
    <div className="w-80">
      <p className="mb-2 text-label-lg text-text">Profile photo</p>
      <FileUpload
        icon={<CameraOutlined style={{ fontSize: 40, color: 'rgba(var(--color-primary), 0.4)' }} />}
        label="Upload photo"
        className="h-40"
      />
      <p className="mt-2 text-caption-md text-text-secondary">
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
    <div className="flex gap-8">
      <div className="flex-1 space-y-4">
        <div>
          <label className="mb-1 block text-label-lg text-text">
            Business name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            defaultValue="Hands Together Therapies"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            readOnly
          />
        </div>
        <div>
          <label className="mb-1 block text-label-lg text-text">Workspace URL</label>
          <input
            type="text"
            defaultValue="acme.splose.com"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            readOnly
          />
        </div>
      </div>
      <div className="w-48 shrink-0">
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
    <div className="flex gap-6">
      <div className="flex-1 space-y-4">
        <div>
          <label className="mb-1 block text-label-lg text-text">First name *</label>
          <input
            type="text"
            defaultValue="Liam"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none"
            readOnly
          />
        </div>
        <div>
          <label className="mb-1 block text-label-lg text-text">Last name *</label>
          <input
            type="text"
            defaultValue="Nguyen"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none"
            readOnly
          />
        </div>
      </div>
      <div className="shrink-0 pt-6 text-center">
        <FileUpload
          icon={<span className="text-body-md text-text-secondary">Profile photo</span>}
          label="Upload"
          className="h-32 w-32 p-0"
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
    <div className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block text-label-lg text-text">Booking page name</label>
        <input
          type="text"
          defaultValue="Standard Booking"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none"
          readOnly
        />
      </div>
      <div>
        <label className="mb-2 block text-label-lg text-text">Logo / Header image</label>
        <FileUpload
          icon={<UploadOutlined style={{ fontSize: 32 }} className="text-text-secondary" />}
          label="Click or drag to upload"
          className="h-32"
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
    <div className="max-w-2xl space-y-4">
      <h3 className="text-heading-md text-text">Upload CSV file</h3>
      <FileUpload
        icon={<UploadOutlined style={{ fontSize: 32 }} className="text-text-secondary" />}
        label="Click to upload or drag and drop"
        className="py-12"
      />
      <p className="text-caption-md text-text-secondary">CSV files only, max 10MB</p>
    </div>
  ),
  parameters: { layout: "padded" },
};
