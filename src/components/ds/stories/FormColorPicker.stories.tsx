"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import FormColorPicker from "../FormColorPicker";

const meta: Meta<typeof FormColorPicker> = {
  title: "Forms/FormColorPicker",
  component: FormColorPicker,
  tags: ["custom"],
  parameters: {
    appPages: [
      { label: "Settings — Online bookings (edit)", vercel: "https://splose-current.vercel.app/settings/online-bookings/1", localhost: "http://localhost:3000/settings/online-bookings/1", production: "https://acme.splose.com/settings/online-bookings" },
      { label: "Settings — Tags", vercel: "https://splose-current.vercel.app/settings/tags", localhost: "http://localhost:3000/settings/tags", production: "https://acme.splose.com/settings/tags" },
      { label: "Settings — Rooms & resources", vercel: "https://splose-current.vercel.app/settings/rooms-resources", localhost: "http://localhost:3000/settings/rooms-resources", production: "https://acme.splose.com/settings/rooms-resources" },
      { label: "Settings — Busy times", vercel: "https://splose-current.vercel.app/settings/busy-times", localhost: "http://localhost:3000/settings/busy-times", production: "https://acme.splose.com/settings/busy-times" },
    ],
    referenceUrl: null,
  },
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
    <div style={{ maxWidth: 384, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>settings/rooms-resources</code> — room
        edit modal uses swatch picker.
      </p>
      <div>
        <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' }}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none' }}
        />
      </div>
      <FormColorPicker value={color} onChange={setColor} variant="swatches" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 4, border: '1px solid var(--color-border)', padding: 12 }}>
        <div style={{height: 24, width: 24, borderRadius: '50%', backgroundColor: color }} />
        <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>{name}</span>
        <span style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>({color})</span>
      </div>
    </div>
  );
}

function TagColorPickerRecipe() {
  const [name, setName] = useState("Priority");
  const [color, setColor] = useState("#ef4444");

  return (
    <div style={{ maxWidth: 384, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>settings/tags</code> — tag edit modal
        uses native color picker.
      </p>
      <div>
        <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' }}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none' }}
        />
      </div>
      <FormColorPicker value={color} onChange={setColor} variant="native" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{ fontSize: 12, lineHeight: 1.67, display: 'inline-flex', alignItems: 'center', borderRadius: '50%', paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, fontWeight: 500, color: '#fff', backgroundColor: color }}
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
    <div style={{ maxWidth: 384, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>settings/busy-times</code> — busy time
        type modal with native color picker alongside utilisation controls.
      </p>
      <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text)', marginBottom: 16 }}>New busy time type</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none' }}
            />
          </div>
          <FormColorPicker value={color} onChange={setColor} />
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' }}>Utilisation</label>
            <select
              value={utilisation}
              onChange={(e) => setUtilisation(e.target.value)}
              style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}
            >
              <option>Excluded</option>
              <option>Included</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' }}>Duration (mins)</label>
            <input
              type="number"
              defaultValue={60}
              style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none' }}
            />
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, borderRadius: 4, border: '1px solid var(--color-border)', padding: 12 }}>
          <div style={{height: 16, width: 16, borderRadius: 4, backgroundColor: color }} />
          <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>{name}</span>
          <span style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>({utilisation})</span>
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
    <div style={{ maxWidth: 448, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>settings/online-bookings/[id]</code> —
        button colour customisation with live preview.
      </p>
      <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text)', marginBottom: 16 }}>Widget Appearance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <FormColorPicker label="Button colour" value={buttonColor} onChange={setButtonColor} />
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' }}>Button text</label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none' }}
            />
          </div>
        </div>
        <div style={{ marginTop: 16, borderRadius: 8, border: '1px solid var(--color-border)', padding: 16 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 12 }}>Preview</h4>
          <button
            style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, borderRadius: 8, paddingLeft: 24, paddingRight: 24, paddingTop: 10, paddingBottom: 10, color: '#fff', backgroundColor: buttonColor }}
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
    <div style={{ maxWidth: 448, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>settings/forms/[id]</code> — form
        design settings with theme colour and header image toggle.
      </p>
      <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text)', marginBottom: 12 }}>Design</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormColorPicker label="Theme colour" value={themeColor} onChange={setThemeColor} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setHeaderImage(!headerImage)}
              style={{ height: 20, width: 36, borderRadius: 9999, transition: 'background-color 0.2s', backgroundColor: headerImage ? 'var(--ant-color-primary, #8250FF)' : '#d1d5db', position: 'relative' }}
            >
              <div style={{ height: 16, width: 16, borderRadius: 9999, backgroundColor: '#fff', transition: 'transform 0.2s', transform: headerImage ? 'translateX(16px)' : 'translateX(2px)' }} />
            </button>
            <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>Show header image</span>
          </div>
        </div>
        <div style={{ marginTop: 16, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{height: 12, backgroundColor: themeColor }} />
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
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
    <div style={{ maxWidth: 448, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>settings/services/edit/[id]</code> —
        service colour selection in the General section.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' }}>Name</label>
          <input
            type="text"
            defaultValue="Initial Consultation"
            style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' }}>Item code</label>
          <input
            type="text"
            defaultValue="93010"
            style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none' }}
          />
        </div>
        <FormColorPicker label="Color" value={color} onChange={setColor} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 8, border: '1px solid var(--color-border)', padding: 12 }}>
        <div style={{height: 12, width: 12, borderRadius: '50%', backgroundColor: color }} />
        <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>Initial Consultation</span>
        <span style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>93010</span>
      </div>
    </div>
  );
}

export const ServiceEditColor: Story = {
  name: "Recipe: Service Edit Color",
  render: () => <ServiceEditColorRecipe />,
};
