import { RightOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Button, Checkbox, FormInput } from "@/components/ds";

export default function LoginPage() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-purple-300, #d8b4fe)" }}>
      <div style={{ width: "100%", maxWidth: 448 }}>
        {/* Header banner */}
        <div style={{ position: "relative", overflow: "hidden", borderRadius: "16px 16px 0 0", background: "var(--color-primary)", padding: "40px 32px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/splose logo.svg" alt="splose" style={{ height: 56, filter: "brightness(0) invert(1)" }} />
          {/* Settings illustration */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/settings.png" alt="" style={{ position: "absolute", top: "50%", right: 24, height: 80, transform: "translateY(-50%)", objectFit: "contain" }} />
        </div>

        {/* Form card */}
        <div style={{ borderRadius: "0 0 16px 16px", background: "#fff", padding: "32px 32px" }}>
          <p style={{ fontSize: 14, color: "var(--color-primary)" }}>You are logging into</p>
          <p style={{ marginTop: 4, fontSize: "var(--font-size-heading-lg)", fontWeight: "var(--font-weight-heading-lg)", color: "var(--color-text)" }}>acme.splose.com</p>

          <div style={{ marginTop: 24 }}>
            <FormInput
              type="email"
              label="Email"
              className="mt-1 rounded-none border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-body-md shadow-none ring-0 focus:border-primary focus:ring-0"
            />
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ position: "relative" }}>
              <FormInput
                type="password"
                label="Password"
                className="mt-1 rounded-none border-0 border-b border-gray-300 bg-transparent px-0 py-2 pr-8 text-body-md shadow-none ring-0 focus:border-primary focus:ring-0"
              />
              <EyeInvisibleOutlined style={{ position: "absolute", bottom: 12, right: 0, fontSize: 16, color: "var(--color-text-secondary)" }} />
            </div>
          </div>

          <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Checkbox label="Remember me" />
            <a href="#" style={{ fontSize: 14, color: "var(--color-primary)", textDecoration: "none" }}>
              Forgot password?
            </a>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="mt-6 flex w-full justify-between py-3"
          >
            Log in
            <RightOutlined style={{ fontSize: 20 }} />
          </Button>
        </div>

        {/* Footer links */}
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 24, fontSize: 14, color: "var(--color-primary)" }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Terms of Service
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
