import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import SignaturePad from "../SignaturePad";
import { Button } from "antd";
import FormInput from "../FormInput";

const meta: Meta<typeof SignaturePad> = {
  title: "Forms/SignaturePad",
  component: SignaturePad,
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "Drawable canvas that captures a handwritten signature for invoices and consent forms.",
      whatToUseInstead:
        "No current equivalent — signatures handled out-of-app or typed today.",
      referenceLibrary: "signature-pad",
      plan: "docs/ds-plans/SignaturePad.md",
      source: "src/components/ds/SignaturePad.tsx",
    },
  },
};
export default meta;
type Story = StoryObj<typeof SignaturePad>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  render: () => {
    const Inner = () => {
      const [value, setValue] = useState<string | null>(null);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SignaturePad label="Signature" value={value} onChange={setValue} required />
          <div style={{ fontSize: 12, color: "#6E6E64" }}>
            {value ? "Signed ✓ (base64 data URL captured)" : "Empty"}
          </div>
        </div>
      );
    };
    return <Inner />;
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Empty: Story = {
  name: "Feature: Empty",
  render: () => <SignaturePad label="Signature" />,
};

export const Drawn: Story = {
  name: "Feature: Drawn",
  render: () => (
    <SignaturePad
      label="Signature"
      defaultValue="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAADwCAYAAABxLb1rAAAAGElEQVR4nO3BAQEAAACCIP+vbkhAAQAAvwYCPgAB7jO9AwAAAABJRU5ErkJggg=="
    />
  ),
};

export const Disabled: Story = {
  name: "Feature: Disabled",
  render: () => <SignaturePad label="Signature" disabled />,
};

export const Error: Story = {
  name: "Feature: Error",
  render: () => (
    <SignaturePad
      label="Signature"
      required
      error="Signature is required before saving."
    />
  ),
};

export const CustomDimensions: Story = {
  name: "Feature: Custom Dimensions",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SignaturePad label="Small" width={240} height={80} />
      <SignaturePad label="Default" />
      <SignaturePad label="Large" width={560} height={180} />
    </div>
  ),
};

export const TypeMode: Story = {
  name: "Feature: Type-mode fallback",
  render: () => {
    const Inner = () => {
      const [mode, setMode] = useState<"draw" | "type">("draw");
      const [typed, setTyped] = useState("");
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              type={mode === "draw" ? "primary" : "default"}
              size="small"
              onClick={() => setMode("draw")}
            >
              Draw
            </Button>
            <Button
              type={mode === "type" ? "primary" : "default"}
              size="small"
              onClick={() => setMode("type")}
            >
              Type
            </Button>
          </div>
          {mode === "draw" ? (
            <SignaturePad label="Signature" />
          ) : (
            <div>
              <FormInput
                label="Typed signature"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Type your full name"
              />
              {typed ? (
                <div
                  style={{
                    marginTop: 8,
                    padding: "18px 16px",
                    border: "1px solid #e5e5e5",
                    borderRadius: 6,
                    fontFamily: "'Brush Script MT', cursive",
                    fontSize: 36,
                    color: "#2C2C2C",
                  }}
                >
                  {typed}
                </div>
              ) : null}
            </div>
          )}
        </div>
      );
    };
    return <Inner />;
  },
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const InvoiceSignOff: Story = {
  name: "Recipe: Invoice Sign-off",
  render: () => (
    <div
      style={{
        padding: 24,
        maxWidth: 440,
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600 }}>Sign & lock invoice INV-14130707</div>
      <SignaturePad label="Practitioner signature" required />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Sign & lock</Button>
      </div>
    </div>
  ),
};

export const ConsentForm: Story = {
  name: "Recipe: Consent Form",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 440 }}>
      <div style={{ fontSize: 15 }}>
        I consent to the assessment and treatment described above.
      </div>
      <SignaturePad label="Patient signature" required />
      <SignaturePad label="Witness signature" />
    </div>
  ),
};

export const FinalNoteSign: Story = {
  name: "Recipe: Final Note Sign-off",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 440 }}>
      <div style={{ fontSize: 13, color: "#6E6E64" }}>
        Note finalised by Dr Sarah Kim · 22/04/2026
      </div>
      <SignaturePad label="Signature" />
    </div>
  ),
};
