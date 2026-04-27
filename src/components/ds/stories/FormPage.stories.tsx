import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "antd";
import FormPage from "../FormPage";
import { Button } from "antd";
import Card from "../Card";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import FormTextarea from "../FormTextarea";
import Badge from "../Badge";

const meta: Meta<typeof FormPage> = {
  title: "Templates/FormPage",
  component: FormPage,
  tags: ["extended"],
  parameters: {
    layout: "fullscreen",
    appPages: [
      {
        route: "/clients/new",
        vercel: "https://splose-current.vercel.app/clients/new",
        production: "https://acme.splose.com/patients/new",
      },
      {
        route: "/waitlist/new",
        vercel: "https://splose-current.vercel.app/waitlist/new",
        production: "https://acme.splose.com/waitlist/new",
      },
      {
        route: "/settings/forms/[id]",
        vercel: "https://splose-current.vercel.app/settings/forms/cmngtw7n9005eycwg4e67506h",
        production: "https://acme.splose.com/settings/forms/cmngtw7n9005eycwg4e67506h",
      },
      {
        route: "/settings/data-import/csv",
        vercel: "https://splose-current.vercel.app/settings/data-import/csv",
        production: "https://acme.splose.com/settings/data-import/csv",
      },
    ],
    referenceUrl: null,
  },
};

export default meta;
type Story = StoryObj<typeof FormPage>;

export const Playground: Story = {
  args: {
    title: "New payment",
    backHref: "/payments",
    actions: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </>
    ),
    children: (
      <Card title="Payment details">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FormInput label="Amount" placeholder="$0.00" />
          <FormSelect label="Method" options={[{ value: "card", label: "Card" }, { value: "cash", label: "Cash" }, { value: "eft", label: "EFT" }]} />
          <FormInput label="Date" placeholder="dd/mm/yyyy" />
          <FormInput label="Reference" placeholder="Optional" />
        </div>
      </Card>
    ),
  },
};

/*  Source: /invoices/new — multi-section form  */
export const InvoiceFormRecipe: Story = {
  name: "Recipe: New Invoice",
  render: () => (
    <FormPage
      title="New invoice"
      backHref="/invoices"
      badge={<Badge variant="gray">Draft</Badge>}
      actions={
        <>
          <Button variant="secondary">Preview</Button>
          <Button variant="primary">Save</Button>
        </>
      }
    >
      <Flex vertical gap={24}>
        <Card title="Client" headerBar>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormSelect label="Client name" options={[{ value: "michael", label: "Michael Brooks" }]} searchable placeholder="Select client" />
            <FormSelect label="Contact" options={[{ value: "ndis", label: "NDIS — NDIA" }]} />
          </div>
        </Card>
        <Card title="Invoice details" headerBar>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <FormSelect label="Location" options={[{ value: "east", label: "East Clinics" }]} />
            <FormInput label="Invoice date" placeholder="02/04/2026" />
            <FormSelect label="Payment terms" options={[{ value: "14", label: "14 days" }]} />
          </div>
        </Card>
        <Card title="Notes">
          <FormTextarea label="Internal notes" placeholder="Add any internal notes..." />
        </Card>
      </Flex>
    </FormPage>
  ),
};
