import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import EmailPreview from "../EmailPreview";
import Button from "../Button";

const meta: Meta<typeof EmailPreview> = {
  title: "Overlays/EmailPreview",
  component: EmailPreview,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof EmailPreview>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Email Preview</Button>
        <EmailPreview
          open={open}
          onClose={() => setOpen(false)}
          subject="Your appointment confirmation"
          recipientName="Sarah Johnson"
          body={"Hi Sarah,\n\nThis is to confirm your appointment on Monday 14 April at 10:00 AM with Dr Emma Thompson at East Clinics.\n\nPlease arrive 10 minutes early.\n\nKind regards,\nHands Together Therapies"}
        />
      </>
    );
  },
};

export const CustomSender: Story = {
  name: "Custom Sender",
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Email Preview</Button>
        <EmailPreview
          open={open}
          onClose={() => setOpen(false)}
          subject="Progress note summary"
          recipientName="Dr James Wilson"
          senderName="Splose OT Practice"
          body={"Dear Dr Wilson,\n\nPlease find attached the progress note summary for your patient.\n\nRegards,\nSplose OT Practice"}
        />
      </>
    );
  },
};
