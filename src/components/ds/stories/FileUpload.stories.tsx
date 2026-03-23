import type { Meta, StoryObj } from "@storybook/react";
import { Upload, Image } from "lucide-react";
import FileUpload from "../FileUpload";

const meta: Meta<typeof FileUpload> = {
  title: "Forms/FileUpload",
  component: FileUpload,
};
export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: { icon: <Upload className="h-8 w-8 text-primary/40" />, label: "Upload" },
};

export const WithImage: Story = {
  args: { icon: <Image className="h-10 w-10 text-primary/40" />, label: "Choose image" },
};

export const NoLabel: Story = {
  args: { icon: <Upload className="h-8 w-8 text-primary/40" /> },
};
