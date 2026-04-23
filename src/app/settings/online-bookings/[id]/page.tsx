"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flex } from "antd";
import { UploadOutlined, LinkOutlined, CopyOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import {
  Button,
  Card,
  ColorDot,
  FormInput,
  FormSelect,
  FormTextarea,
  Toggle,
  Tab,
  FormPage,
  FormColorPicker,
  Modal,
  RadioGroup,
  Text,
  Grid,
} from "@/components/ds";
import FormLabel from "@/components/ds/FormLabel";

const designTabs = [
  { label: "Design", value: "design" },
  { label: "Settings", value: "settings" },
  { label: "Builder", value: "builder" },
  { label: "Share", value: "share" },
];

const brandingOptions = [
  { value: "none", label: "Display none" },
  { value: "map", label: "Display map" },
  { value: "logo", label: "Display logo / image" },
];

const COLOR_SWATCHES = [
  "#8250ff",
  "#6366f1",
  "#2563eb",
  "#0891b2",
  "#059669",
  "#ea580c",
  "#dc2626",
  "#ec4899",
];

export default function EditOnlineBookingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("design");
  const [name, setName] = useState("Standard Booking");
  const [buttonColor, setButtonColor] = useState("#8250ff");
  const [secondaryColor, setSecondaryColor] = useState("#f3f0ff");
  const [buttonText, setButtonText] = useState("Book Now");
  const [headerImage, setHeaderImage] = useState("");
  const [brandingMode, setBrandingMode] = useState("none");
  const [termsEnabled, setTermsEnabled] = useState(true);
  const [terms, setTerms] = useState("By booking an appointment, you agree to our cancellation policy. Cancellations made less than 24 hours before the appointment may incur a fee.");
  const [confirmationMsg, setConfirmationMsg] = useState("Thank you for your booking! You will receive a confirmation email shortly.");
  const [noticeEnabled, setNoticeEnabled] = useState(true);
  const [noticeText, setNoticeText] = useState("Due to high demand, please book at least 48 hours in advance.");
  const [autoRisk, setAutoRisk] = useState(false);
  const [serviceRating, setServiceRating] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(false);
  const [gtmId, setGtmId] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const shareUrl = "https://acme.splose.com/online-booking/7b2c0db8-cb7b-40de-991e-631ecdb30cf0";

  return (
    <FormPage
      backHref="/settings/online-bookings"
      title="Edit online booking"
      maxWidth={99999}
      actions={
        <Flex align="center" gap={8}>
          <Button variant="secondary" onClick={() => router.push("/settings/online-bookings")}>Cancel</Button>
          <Button variant="secondary" onClick={() => setShowPreview(!showPreview)}>Preview</Button>
          <Button variant="primary" onClick={() => router.push("/settings/online-bookings")}>Save</Button>
        </Flex>
      }
    >
      <div style={{ borderBottom: '1px solid var(--color-border)', padding: '0 24px', margin: '-24px -24px 0' }}>
        <Tab items={designTabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <Flex style={{ margin: '0 -24px -24px' }}>
      <div style={{ padding: 24, flex: showPreview ? 1 : undefined, maxWidth: showPreview ? undefined : 768, width: showPreview ? undefined : '100%', margin: showPreview ? undefined : '0 auto' }}>
        {activeTab === "design" && (
          <Flex vertical gap={24}>
            <FormInput label="Booking page name" value={name} onChange={(e) => setName(e.target.value)} />

            {/* Branding section */}
            <Flex vertical gap={12}>
              <div>
                <Text variant="heading/sm" as="h3">Set your branding</Text>
                <Text variant="body/sm" color="secondary">Select a look for the branding</Text>
              </div>
              <RadioGroup
                name="brandingMode"
                options={brandingOptions}
                value={brandingMode}
                onChange={setBrandingMode}
              />
              {brandingMode === "logo" && (
                <div>
                  <FormLabel size="sm" mb={8}>Logo / Header image</FormLabel>
                  <Card variant="dashed" tint="muted" padding="none">
                    <Flex align="center" justify="center" style={{ height: 128 }}>
                      <div style={{ textAlign: 'center' }}>
                        <Icon as={UploadOutlined} size="3xl" tone="secondary" style={{ display: 'block', margin: '0 auto 4px' }} />
                        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Click or drag to upload</span>
                      </div>
                    </Flex>
                  </Card>
                </div>
              )}
            </Flex>

            {/* Button styling section */}
            <Flex vertical gap={12}>
              <div>
                <Text variant="heading/sm" as="h3">Button styling</Text>
              </div>
              <div>
                <Text variant="label/lg" color="secondary" style={{ marginBottom: 8 }}>Colours</Text>
                <Grid cols={2} gap="md">
                  <FormColorPicker label="Primary" value={buttonColor} onChange={setButtonColor} />
                  <FormColorPicker label="Secondary" value={secondaryColor} onChange={setSecondaryColor} />
                </Grid>
              </div>
              <div>
                <Text variant="label/md" color="secondary" style={{ marginBottom: 8 }}>Accessible colour suggestions</Text>
                <Flex wrap="wrap" gap={8}>
                  {COLOR_SWATCHES.map((color) => (
                    <ColorDot
                      key={color}
                      color={color}
                      size="xl"
                      shape="circle"
                      interactive
                      selected={buttonColor === color}
                      onClick={() => setButtonColor(color)}
                    />
                  ))}
                </Flex>
              </div>
            </Flex>

            {/* Button preview */}
            <Card>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Preview</h3>
              <Flex align="center" gap={12}>
                <button style={{ borderRadius: 8, padding: '10px 24px', color: 'white', backgroundColor: buttonColor, fontSize: 12, fontWeight: 500 }}>
                  {buttonText}
                </button>
                <button style={{ borderRadius: 8, padding: '10px 24px', backgroundColor: secondaryColor, color: buttonColor, fontSize: 12, fontWeight: 500 }}>
                  {buttonText}
                </button>
              </Flex>
            </Card>

            {/* Important notice banner */}
            <Flex vertical gap={12}>
              <Toggle label="Important notice banner" checked={noticeEnabled} onChange={setNoticeEnabled} />
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                This message appears on the online bookings page to inform clients of important updates, policies or any changes to the service.
              </p>
              {noticeEnabled && (
                <FormTextarea
                  label="Notice content"
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  rows={3}
                  placeholder="e.g. Due to high demand, please book at least 48 hours in advance."
                />
              )}
            </Flex>

            {/* Auto Risk */}
            <Flex vertical gap={8}>
              <Toggle label="Auto Risk" checked={autoRisk} onChange={setAutoRisk} />
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                Auto-assign clients are required to review practice at the time of service.
              </p>
            </Flex>

            {/* Service rating */}
            <Flex vertical gap={8}>
              <Toggle label="Service rating" checked={serviceRating} onChange={setServiceRating} />
            </Flex>

            {/* Download online booking notice */}
            <Flex vertical gap={12}>
              <Toggle label="Download online booking notice" checked={downloadNotice} onChange={setDownloadNotice} />
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                The notice message will display if you turn this online booking page.
              </p>
              {downloadNotice && (
                <Flex vertical gap={16}>
                  <FormInput label="Online Booking Document" value="" onChange={() => {}} />
                  <FormTextarea
                    label="Notice content"
                    value=""
                    onChange={() => {}}
                    rows={4}
                    placeholder="By proceeding with this online booking, you acknowledge and agree to our booking terms and conditions."
                  />
                  <Flex vertical gap={8}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox" style={{ height: 16, width: 16, borderRadius: 4 }} />
                      <span style={{ fontSize: 14 }}>I have read and agree to the terms</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox" style={{ height: 16, width: 16, borderRadius: 4 }} />
                      <span style={{ fontSize: 14 }}>I accept the privacy policy</span>
                    </label>
                  </Flex>
                </Flex>
              )}
            </Flex>

            {/* Terms & policies */}
            <Flex vertical gap={16}>
              <Toggle label="Enable booking terms & policies" checked={termsEnabled} onChange={setTermsEnabled} />
              {termsEnabled && (
                <FormTextarea label="Terms & policies" value={terms} onChange={(e) => setTerms(e.target.value)} rows={4} />
              )}
            </Flex>

            <FormTextarea label="Confirmation message" value={confirmationMsg} onChange={(e) => setConfirmationMsg(e.target.value)} rows={3} />
          </Flex>
        )}

        {activeTab === "settings" && (
          <Flex vertical gap={24}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Booking preferences</h3>
              <Flex vertical gap={16}>
                <Toggle label="Allow clients to select a practitioner" checked={true} onChange={() => {}} />
                <Toggle label="Allow clients to add to waitlist" checked={true} onChange={() => {}} />
                <Toggle label="Require phone number" checked={true} onChange={() => {}} />
                <Toggle label="Require date of birth" checked={false} onChange={() => {}} />
              </Flex>
            </div>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Scheduling</h3>
              <Grid cols={2} gap="md">
                <FormSelect
                  label="Minimum notice"
                  options={[
                    { value: "1h", label: "1 hour" },
                    { value: "2h", label: "2 hours" },
                    { value: "4h", label: "4 hours" },
                    { value: "24h", label: "24 hours" },
                    { value: "48h", label: "48 hours" },
                  ]}
                  value="24h"
                  onChange={() => {}}
                />
                <FormSelect
                  label="Maximum advance booking"
                  options={[
                    { value: "1w", label: "1 week" },
                    { value: "2w", label: "2 weeks" },
                    { value: "1m", label: "1 month" },
                    { value: "3m", label: "3 months" },
                    { value: "6m", label: "6 months" },
                  ]}
                  value="3m"
                  onChange={() => {}}
                />
              </Grid>
            </div>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Notifications</h3>
              <Flex vertical gap={16}>
                <Toggle label="Send confirmation email to client" checked={true} onChange={() => {}} />
                <Toggle label="Send reminder email (24h before)" checked={true} onChange={() => {}} />
                <Toggle label="Notify practitioner of new bookings" checked={true} onChange={() => {}} />
              </Flex>
            </div>
          </Flex>
        )}

        {activeTab === "builder" && (
          <Flex vertical gap={24}>
            <Flex align="center" justify="space-between">
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>Locations</h3>
              <Button variant="secondary" onClick={() => setShowLocationModal(true)}>Manage locations</Button>
            </Flex>
            <Flex vertical gap={8}>
              {["East Clinics", "West Clinics", "North Clinics"].map((loc) => (
                <Flex key={loc} align="center" justify="space-between" style={{ borderRadius: 8, border: '1px solid var(--color-border)', padding: '12px 16px' }}>
                  <span style={{ fontSize: 14 }}>{loc}</span>
                  <Toggle checked={loc !== "North Clinics"} onChange={() => {}} />
                </Flex>
              ))}
            </Flex>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Services</h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>All services are displayed by default. Configure visibility per service in Settings &rarr; Services.</p>
            </div>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Practitioners</h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>All practitioners are available by default. Configure availability per practitioner in their profile.</p>
            </div>
          </Flex>
        )}

        {activeTab === "share" && (
          <Flex vertical gap={24}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Shareable link</h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 12 }}>Share this link with your clients to allow them to book online.</p>
              <Flex align="center" gap={8}>
                <Card tint="muted" padding="sm" style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, color: 'var(--color-primary)', wordBreak: 'break-all' }}>{shareUrl}</span>
                </Card>
                <Button variant="secondary" onClick={() => navigator.clipboard?.writeText(shareUrl)}>
                  <Icon as={CopyOutlined} /> Copy
                </Button>
                <Button variant="secondary" onClick={() => window.open(shareUrl, "_blank")}>
                  <Icon as={LinkOutlined} /> Open
                </Button>
              </Flex>
            </div>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Embed code</h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 12 }}>Add this code to your website to embed the booking widget.</p>
              <pre style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-fill-tertiary)', fontSize: 12, padding: 16 }}>
{`<iframe
  src="${shareUrl}"
  width="100%"
  height="800"
  frameBorder="0"
></iframe>`}
              </pre>
            </div>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Google Tag Manager ID</h3>
              <FormInput
                label=""
                value={gtmId}
                onChange={(e) => setGtmId(e.target.value)}
                placeholder="GTM-TEST131"
              />
            </div>
          </Flex>
        )}
      </div>

      {/* Live preview panel */}
      {showPreview && (
        <div style={{ flexShrink: 0, padding: 24, width: 400, borderLeft: '1px solid var(--color-border)', backgroundColor: 'var(--color-fill-tertiary)' }}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Preview</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </Flex>
          <Card shadow padding="none">
            <div style={{ padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Select a location</h2>
              <Flex vertical gap={8}>
                {["East Clinics", "West Clinics"].map((loc) => (
                  <Flex key={loc} align="center" justify="space-between" style={{ borderRadius: 12, border: '1px solid var(--color-border)', padding: 12 }}>
                    <Flex align="center" gap={12}>
                      <Flex align="center" justify="center" style={{ height: 40, width: 40, borderRadius: 8, backgroundColor: '#1f2937', fontSize: 18 }}>
                        🔥
                      </Flex>
                      <div>
                        <Text variant="label/lg" as="div" color="text">{loc}</Text>
                        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Mobile and/or telehealth</div>
                      </div>
                    </Flex>
                    <button
                      style={{ borderRadius: 8, padding: '6px 12px', color: 'white', backgroundColor: buttonColor, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer' }}
                    >
                      {buttonText || "Select"}
                    </button>
                  </Flex>
                ))}
              </Flex>
              <div style={{ marginTop: 16 }}>
                <button
                  disabled
                  style={{ borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.25)', padding: '8px 12px', color: 'white', cursor: 'not-allowed', fontWeight: 500, border: 'none', fontSize: 14, width: '100%' }}
                >
                  Continue
                </button>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)', padding: '12px 20px', textAlign: 'center', fontSize: 11, color: 'var(--color-text-secondary)' }}>
              Powered by <Text variant="label/lg" as="span" color="primary">splose</Text>
            </div>
          </Card>
        </div>
      )}
      </Flex>

      <Modal open={showLocationModal} onClose={() => setShowLocationModal(false)} title="Manage locations displayed">
        <Flex vertical gap={8}>
          {["East Clinics", "West Clinics", "North Clinics", "Telehealth"].map((loc) => (
            <label key={loc} style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 8, border: '1px solid var(--color-border)', padding: '12px 16px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked={loc !== "Telehealth"} style={{ height: 16, width: 16, borderRadius: 4 }} />
              <span style={{ fontSize: 14 }}>{loc}</span>
            </label>
          ))}
        </Flex>
      </Modal>
    </FormPage>
  );
}
