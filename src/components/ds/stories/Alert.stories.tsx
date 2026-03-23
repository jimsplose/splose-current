import type { Meta, StoryObj } from "@storybook/react";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import Alert from "../Alert";

const meta: Meta<typeof Alert> = {
  title: "Design System/Alert",
  component: Alert,
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Info_: Story = {
  args: { variant: "info", icon: <Info className="h-4 w-4" />, children: "Client won't be notified of changes." },
};

export const Warning: Story = {
  args: { variant: "warning", icon: <AlertTriangle className="h-4 w-4" />, children: "This appointment is in the past." },
};

export const Success: Story = {
  args: { variant: "success", icon: <CheckCircle className="h-4 w-4" />, children: "Changes saved successfully." },
};

export const Error_: Story = {
  args: { variant: "error", icon: <XCircle className="h-4 w-4" />, children: "Failed to save changes." },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-3">
      <Alert variant="info" icon={<Info className="h-4 w-4" />}>Informational message.</Alert>
      <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4" />}>Warning message.</Alert>
      <Alert variant="success" icon={<CheckCircle className="h-4 w-4" />}>Success message.</Alert>
      <Alert variant="error" icon={<XCircle className="h-4 w-4" />}>Error message.</Alert>
    </div>
  ),
};
