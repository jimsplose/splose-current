import type { Meta, StoryObj } from "@storybook/react";
import { Mail, Phone, MapPin } from "lucide-react";
import IconText from "../IconText";

const meta: Meta<typeof IconText> = {
  title: "Design System/IconText",
  component: IconText,
};
export default meta;
type Story = StoryObj<typeof IconText>;

export const Email: Story = {
  args: { icon: <Mail className="h-4 w-4" />, children: "hello@splose.com" },
};

export const Phone_: Story = {
  args: { icon: <Phone className="h-4 w-4" />, children: "0412 345 678" },
};

export const Multiple: Story = {
  render: () => (
    <div className="space-y-2">
      <IconText icon={<Mail className="h-4 w-4" />}>hello@splose.com</IconText>
      <IconText icon={<Phone className="h-4 w-4" />}>0412 345 678</IconText>
      <IconText icon={<MapPin className="h-4 w-4" />}>123 Main St, Melbourne</IconText>
    </div>
  ),
};
