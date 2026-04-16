import { RightOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Button, Checkbox, FormInput } from "@/components/ds";

export default function LoginPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "var(--color-purple-300, #d8b4fe)" }}>
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
              className="text-body-md"
              style={{ marginTop: 4, borderRadius: 0, border: 'none', borderBottom: '1px solid #d1d5db', backgroundColor: 'transparent', paddingLeft: 0, paddingRight: 0, paddingTop: 8, paddingBottom: 8, boxShadow: 'none' }}
            />
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ position: "relative" }}>
              <FormInput
                type="password"
                label="Password"
                className="text-body-md"
                style={{ marginTop: 4, borderRadius: 0, border: 'none', borderBottom: '1px solid #d1d5db', backgroundColor: 'transparent', paddingLeft: 0, paddingRight: 32, paddingTop: 8, paddingBottom: 8, boxShadow: 'none' }}
              />
              <EyeInvisibleOutlined style={{ position: "absolute", bottom: 12, right: 0, fontSize: 16, color: "var(--color-text-secondary)" }} />
            </div>
          </div>

          <div className="flex items-center justify-between" style={{ marginTop: 16 }}>
            <Checkbox label="Remember me" />
            <a href="#" className="no-underline" style={{ fontSize: 14, color: "var(--color-primary)" }}>
              Forgot password?
            </a>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="flex w-full justify-between"
            style={{ marginTop: 24, paddingTop: 12, paddingBottom: 12 }}
          >
            Log in
            <RightOutlined style={{ fontSize: 20 }} />
          </Button>
        </div>

        {/* Footer links */}
        <div className="flex justify-center" style={{ marginTop: 16, gap: 24, fontSize: 14, color: "var(--color-primary)" }}>
          <a href="#" className="no-underline" style={{ color: "inherit" }}>
            Terms of Service
          </a>
          <a href="#" className="no-underline" style={{ color: "inherit" }}>
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
