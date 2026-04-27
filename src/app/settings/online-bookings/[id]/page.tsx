"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flex, Form } from "antd";
import { UploadOutlined, LinkOutlined, CopyOutlined } from "@ant-design/icons";
import { Card, Checkbox, ColorDot, FormInput, FormSelect, FormTextarea, Toggle, Tab, FormPage, FormColorPicker, Modal, RadioGroup, Text, Grid } from "@/components/ds";
import styles from "./OnlineBookingsEdit.module.css";

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
  const [buttonText] = useState("Book Now");
  const [, setHeaderImage] = useState("");
  void setHeaderImage;
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
          <Button onClick={() => router.push("/settings/online-bookings")}>Cancel</Button>
          <Button onClick={() => setShowPreview(!showPreview)}>Preview</Button>
          <Button type="primary" onClick={() => router.push("/settings/online-bookings")}>Save</Button>
        </Flex>
      }
    >
      <div className={styles.tabsRow}>
        <Tab items={designTabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <Flex className={styles.body}>
      <div className={`${styles.formCol} ${showPreview ? styles.formColExpanded : styles.formColCentered}`}>
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
                  <Form.Item label="Logo / Header image" className={styles.formItemTight}>
                    <Card variant="dashed" tint="muted" padding="none">
                      <Flex align="center" justify="center" className={styles.uploadZone}>
                        <div className={styles.uploadCenter}>
                          <UploadOutlined className={styles.uploadIcon} />
                          <span className={styles.uploadHint}>Click or drag to upload</span>
                        </div>
                      </Flex>
                    </Card>
                  </Form.Item>
                </div>
              )}
            </Flex>

            {/* Button styling section */}
            <Flex vertical gap={12}>
              <div>
                <Text variant="heading/sm" as="h3">Button styling</Text>
              </div>
              <div>
                <Text variant="label/lg" color="secondary" mb={8}>Colours</Text>
                <Grid cols={2} gap="md">
                  <FormColorPicker label="Primary" value={buttonColor} onChange={setButtonColor} />
                  <FormColorPicker label="Secondary" value={secondaryColor} onChange={setSecondaryColor} />
                </Grid>
              </div>
              <div>
                <Text variant="label/md" color="secondary" mb={8}>Accessible colour suggestions</Text>
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
              <Text variant="heading/sm" as="h3" mb={12}>Preview</Text>
              <Flex align="center" gap={12}>
                {/* ds-exempt: dynamic user-defined color */}
                <button className={`${styles.previewBtn} ${styles.previewBtnPrimary}`} style={{ backgroundColor: buttonColor }}>
                  {buttonText}
                </button>
                {/* ds-exempt: dynamic user-defined color */}
                <button className={styles.previewBtn} style={{ backgroundColor: secondaryColor, color: buttonColor }}>
                  {buttonText}
                </button>
              </Flex>
            </Card>

            {/* Important notice banner */}
            <Flex vertical gap={12}>
              <Toggle label="Important notice banner" checked={noticeEnabled} onChange={setNoticeEnabled} />
              <Text variant="body/sm" color="secondary">
                This message appears on the online bookings page to inform clients of important updates, policies or any changes to the service.
              </Text>
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
              <Text variant="body/sm" color="secondary">
                Auto-assign clients are required to review practice at the time of service.
              </Text>
            </Flex>

            {/* Service rating */}
            <Flex vertical gap={8}>
              <Toggle label="Service rating" checked={serviceRating} onChange={setServiceRating} />
            </Flex>

            {/* Download online booking notice */}
            <Flex vertical gap={12}>
              <Toggle label="Download online booking notice" checked={downloadNotice} onChange={setDownloadNotice} />
              <Text variant="body/sm" color="secondary">
                The notice message will display if you turn this online booking page.
              </Text>
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
                    <Checkbox label="I have read and agree to the terms" />
                    <Checkbox label="I accept the privacy policy" />
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
              <Text variant="heading/md" as="h3" mb={12}>Booking preferences</Text>
              <Flex vertical gap={16}>
                <Toggle label="Allow clients to select a practitioner" checked={true} onChange={() => {}} />
                <Toggle label="Allow clients to add to waitlist" checked={true} onChange={() => {}} />
                <Toggle label="Require phone number" checked={true} onChange={() => {}} />
                <Toggle label="Require date of birth" checked={false} onChange={() => {}} />
              </Flex>
            </div>

            <div>
              <Text variant="heading/md" as="h3" mb={12}>Scheduling</Text>
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
              <Text variant="heading/md" as="h3" mb={12}>Notifications</Text>
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
              <Text variant="heading/md" as="h3">Locations</Text>
              <Button onClick={() => setShowLocationModal(true)}>Manage locations</Button>
            </Flex>
            <Flex vertical gap={8}>
              {["East Clinics", "West Clinics", "North Clinics"].map((loc) => (
                <Flex key={loc} align="center" justify="space-between" className={styles.locationRow}>
                  <Text as="span" variant="body/md">{loc}</Text>
                  <Toggle checked={loc !== "North Clinics"} onChange={() => {}} />
                </Flex>
              ))}
            </Flex>

            <div>
              <Text variant="heading/md" as="h3" mb={12}>Services</Text>
              <Text variant="body/md" color="secondary">All services are displayed by default. Configure visibility per service in Settings &rarr; Services.</Text>
            </div>

            <div>
              <Text variant="heading/md" as="h3" mb={12}>Practitioners</Text>
              <Text variant="body/md" color="secondary">All practitioners are available by default. Configure availability per practitioner in their profile.</Text>
            </div>
          </Flex>
        )}

        {activeTab === "share" && (
          <Flex vertical gap={24}>
            <div>
              <Text variant="heading/md" as="h3" mb={8}>Shareable link</Text>
              <Text variant="body/md" color="secondary" mb={12}>Share this link with your clients to allow them to book online.</Text>
              <Flex align="center" gap={8}>
                <Card tint="muted" padding="sm" className={styles.shareCard}>
                  <span className={styles.shareUrl}>{shareUrl}</span>
                </Card>
                <Button onClick={() => navigator.clipboard?.writeText(shareUrl)} icon={<CopyOutlined />}>Copy</Button>
                <Button onClick={() => window.open(shareUrl, "_blank")} icon={<LinkOutlined />}>Open</Button>
              </Flex>
            </div>

            <div>
              <Text variant="heading/md" as="h3" mb={8}>Embed code</Text>
              <Text variant="body/md" color="secondary" mb={12}>Add this code to your website to embed the booking widget.</Text>
              <pre className={styles.embedCode}>
{`<iframe
  src="${shareUrl}"
  width="100%"
  height="800"
  frameBorder="0"
></iframe>`}
              </pre>
            </div>

            <div>
              <Text variant="heading/md" as="h3" mb={8}>Google Tag Manager ID</Text>
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
        <div className={styles.previewPanel}>
          <Flex justify="space-between" align="center" className={styles.previewPanelHeader}>
            <Text variant="heading/sm" as="h3">Preview</Text>
            <Button type="text" size="small" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </Flex>
          <Card shadow padding="none">
            <div className={styles.previewBody}>
              <Text variant="heading/lg" as="h2" mb={16}>Select a location</Text>
              <Flex vertical gap={8}>
                {["East Clinics", "West Clinics"].map((loc) => (
                  <Flex key={loc} align="center" justify="space-between" className={styles.previewLocCard}>
                    <Flex align="center" gap={12}>
                      <Flex align="center" justify="center" className={styles.previewLocIcon}>
                        🔥
                      </Flex>
                      <div>
                        <Text variant="label/lg" as="div" color="text">{loc}</Text>
                        <span className={styles.previewLocMeta}>Mobile and/or telehealth</span>
                      </div>
                    </Flex>
                    {/* ds-exempt: dynamic user-defined color */}
                    <button className={styles.previewLocBtn} style={{ backgroundColor: buttonColor }}>
                      {buttonText || "Select"}
                    </button>
                  </Flex>
                ))}
              </Flex>
              <div className={styles.previewContinueWrap}>
                <button disabled className={styles.previewContinueBtn}>
                  Continue
                </button>
              </div>
            </div>
            <div className={styles.previewFooter}>
              Powered by <Text variant="label/lg" as="span" color="primary">splose</Text>
            </div>
          </Card>
        </div>
      )}
      </Flex>

      <Modal open={showLocationModal} onClose={() => setShowLocationModal(false)} title="Manage locations displayed">
        <Flex vertical gap={8}>
          {["East Clinics", "West Clinics", "North Clinics", "Telehealth"].map((loc) => (
            <label key={loc} className={styles.modalCheckboxLabel}>
              <input type="checkbox" defaultChecked={loc !== "Telehealth"} className={styles.modalCheckboxInput} />
              <span className={styles.modalCheckboxText}>{loc}</span>
            </label>
          ))}
        </Flex>
      </Modal>
    </FormPage>
  );
}
