"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import FormColorPicker from "../FormColorPicker";

const meta: Meta<typeof FormColorPicker> = {
  title: "Forms/FormColorPicker",
  component: FormColorPicker,
  argTypes: {
    label: { control: "text" },
    value: { control: "color" },
    variant: {
      control: "select",
      options: ["native", "swatches"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof FormColorPicker>;

/* ── Playground ─────────────────────────────────────────────────────────── */

function PlaygroundDemo(args: { label?: string; value?: string; variant?: "native" | "swatches" }) {
  const [color, setColor] = useState(args.value ?? "#3b82f6");
  return (
    <FormColorPicker
      label={args.label ?? "Colour"}
      value={color}
      onChange={setColor}
      variant={args.variant ?? "native"}
    />
  );
}

export const Playground: Story = {
  args: {
    label: "Colour",
    value: "#3b82f6",
    variant: "native",
  },
  render: (args) => <PlaygroundDemo {...args} />,
};

/* ── Feature Stories ────────────────────────────────────────────────────── */

function NativeDemo() {
  const [color, setColor] = useState("#3b82f6");
  return <FormColorPicker label="Colour" value={color} onChange={setColor} variant="native" />;
}

function SwatchesDemo() {
  const [color, setColor] = useState("#ef4444");
  return <FormColorPicker label="Colour" value={color} onChange={setColor} variant="swatches" />;
}

export const Native: Story = { render: () => <NativeDemo /> };
export const Swatches: Story = { render: () => <SwatchesDemo /> };

/* ── Recipes ────────────────────────────────────────────────────────────── */

function RoomColorPickerRecipe() {
  const [name, setName] = useState("Room 1");
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="max-w-sm space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings/rooms-resources</code> — room
        edit modal uses swatch picker.
      </p>
      <div>
        <label className="mb-1 block text-label-lg text-text-secondary">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary"
        />
      </div>
      <FormColorPicker value={color} onChange={setColor} variant="swatches" />
      <div className="flex items-center gap-2 rounded border border-border p-3">
        <div className="h-6 w-6 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-body-md text-text">{name}</span>
        <span className="text-body-sm text-text-secondary">({color})</span>
      </div>
    </div>
  );
}

function TagColorPickerRecipe() {
  const [name, setName] = useState("Priority");
  const [color, setColor] = useState("#ef4444");

  return (
    <div className="max-w-sm space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings/tags</code> — tag edit modal
        uses native color picker.
      </p>
      <div>
        <label className="mb-1 block text-label-lg text-text-secondary">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary"
        />
      </div>
      <FormColorPicker value={color} onChange={setColor} variant="native" />
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-body-sm font-medium text-white"
          style={{ backgroundColor: color }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}

export const RoomColorPicker: Story = {
  name: "Recipe: Room Color Picker",
  render: () => <RoomColorPickerRecipe />,
};

export const TagColorPicker: Story = {
  name: "Recipe: Tag Color Picker",
  render: () => <TagColorPickerRecipe />,
};

/* ------------------------------------------------------------------ */
/*  BusyTimeColorPicker                                                */
/*  Pattern: Native color picker inside a modal form for creating      */
/*  busy time types with name, color, utilisation, and duration        */
/*  Source: /settings/busy-times/page.tsx                               */
/* ------------------------------------------------------------------ */

function BusyTimeColorPickerRecipe() {
  const [name, setName] = useState("Leave");
  const [color, setColor] = useState("#f97316");
  const [utilisation, setUtilisation] = useState("Excluded");

  return (
    <div className="max-w-sm space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings/busy-times</code> — busy time
        type modal with native color picker alongside utilisation controls.
      </p>
      <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-heading-md text-text">New busy time type</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary"
            />
          </div>
          <FormColorPicker value={color} onChange={setColor} />
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Utilisation</label>
            <select
              value={utilisation}
              onChange={(e) => setUtilisation(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text"
            >
              <option>Excluded</option>
              <option>Included</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Duration (mins)</label>
            <input
              type="number"
              defaultValue={60}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded border border-border p-3">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: color }} />
          <span className="text-body-md text-text">{name}</span>
          <span className="text-caption-md text-text-secondary">({utilisation})</span>
        </div>
      </div>
    </div>
  );
}

export const BusyTimeColorPicker: Story = {
  name: "Recipe: Busy Time Color Picker",
  render: () => <BusyTimeColorPickerRecipe />,
};

/* ------------------------------------------------------------------ */
/*  OnlineBookingButtonColor                                           */
/*  Pattern: Native color picker used to customise a booking widget    */
/*  button colour, with a live preview of the styled button            */
/*  Source: /settings/online-bookings/[id]/page.tsx                    */
/* ------------------------------------------------------------------ */

function OnlineBookingButtonColorRecipe() {
  const [buttonColor, setButtonColor] = useState("#7c3aed");
  const [buttonText, setButtonText] = useState("Book now");

  return (
    <div className="max-w-md space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings/online-bookings/[id]</code> —
        button colour customisation with live preview.
      </p>
      <div className="rounded-lg border border-border bg-white p-6">
        <h3 className="mb-4 text-heading-md text-text">Widget Appearance</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormColorPicker label="Button colour" value={buttonColor} onChange={setButtonColor} />
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Button text</label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-border p-4">
          <h4 className="mb-3 text-heading-sm text-text">Preview</h4>
          <button
            className="rounded-lg px-6 py-2.5 text-label-lg text-white"
            style={{ backgroundColor: buttonColor }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export const OnlineBookingButtonColor: Story = {
  name: "Recipe: Online Booking Button Color",
  render: () => <OnlineBookingButtonColorRecipe />,
};

/* ------------------------------------------------------------------ */
/*  FormDesignThemeColor                                               */
/*  Pattern: Native color picker for theming a form's appearance,      */
/*  used alongside a toggle for header image visibility                */
/*  Source: /settings/forms/[id]/page.tsx                               */
/* ------------------------------------------------------------------ */

function FormDesignThemeColorRecipe() {
  const [themeColor, setThemeColor] = useState("#7c3aed");
  const [headerImage, setHeaderImage] = useState(true);

  return (
    <div className="max-w-md space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings/forms/[id]</code> — form
        design settings with theme colour and header image toggle.
      </p>
      <div className="rounded-lg border border-border bg-white p-6">
        <h3 className="mb-3 text-heading-md text-text">Design</h3>
        <div className="space-y-4">
          <FormColorPicker label="Theme colour" value={themeColor} onChange={setThemeColor} />
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHeaderImage(!headerImage)}
              className={`h-5 w-9 rounded-full transition-colors ${headerImage ? "bg-primary" : "bg-gray-300"}`}
            >
              <div className={`h-4 w-4 rounded-full bg-white transition-transform ${headerImage ? "translate-x-4" : "translate-x-0.5"}`} />
            </button>
            <span className="text-body-md text-text">Show header image</span>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-border overflow-hidden">
          <div className="h-3" style={{ backgroundColor: themeColor }} />
          <div className="p-4">
            <p className="text-body-sm text-text-secondary">
              Form preview with theme colour applied to the header bar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const FormDesignThemeColor: Story = {
  name: "Recipe: Form Design Theme Color",
  render: () => <FormDesignThemeColorRecipe />,
};

/* ------------------------------------------------------------------ */
/*  ServiceEditColor                                                   */
/*  Pattern: Native color picker inside a service edit form's General  */
/*  collapse section alongside name, type, and item code fields        */
/*  Source: /settings/services/edit/[id]/EditServiceClient.tsx          */
/* ------------------------------------------------------------------ */

function ServiceEditColorRecipe() {
  const [color, setColor] = useState("#8b5cf6");

  return (
    <div className="max-w-md space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings/services/edit/[id]</code> —
        service colour selection in the General section.
      </p>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-label-lg text-text-secondary">Name</label>
          <input
            type="text"
            defaultValue="Initial Consultation"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-label-lg text-text-secondary">Item code</label>
          <input
            type="text"
            defaultValue="93010"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary"
          />
        </div>
        <FormColorPicker label="Color" value={color} onChange={setColor} />
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-border p-3">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-body-md text-text">Initial Consultation</span>
        <span className="text-caption-md text-text-secondary">93010</span>
      </div>
    </div>
  );
}

export const ServiceEditColor: Story = {
  name: "Recipe: Service Edit Color",
  render: () => <ServiceEditColorRecipe />,
};
