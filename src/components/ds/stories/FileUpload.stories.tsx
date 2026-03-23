import type { Meta, StoryObj } from "@storybook/react";
import { Upload, Image, Camera } from "lucide-react";
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
    icon: <Upload className="h-8 w-8 text-primary/40" />,
    label: "Upload",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: { icon: <Upload className="h-8 w-8 text-primary/40" />, label: "Upload" },
};

export const WithIcon: Story = {
  args: { icon: <Image className="h-10 w-10 text-primary/40" />, label: "Choose image" },
};

export const NoLabel: Story = {
  args: { icon: <Upload className="h-8 w-8 text-primary/40" />, label: undefined },
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
        icon={<Camera className="h-10 w-10 text-primary/40" />}
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
