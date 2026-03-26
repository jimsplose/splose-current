"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Link as LinkIcon, Copy, ExternalLink } from "lucide-react";
import {
  Button,
  FormInput,
  FormSelect,
  FormTextarea,
  Toggle,
  Tab,
  Navbar,
  FormColorPicker,
  Modal,
  RadioGroup,
} from "@/components/ds";

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
    <div>
      <Navbar
        backHref="/settings/online-bookings"
        title="Edit online booking"
      >
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => router.push("/settings/online-bookings")}>Cancel</Button>
          <Button variant="secondary" onClick={() => setShowPreview(!showPreview)}>Preview</Button>
          <Button variant="primary" onClick={() => router.push("/settings/online-bookings")}>Save</Button>
        </div>
      </Navbar>

      <div className="border-b border-border px-6">
        <Tab items={designTabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <div className="flex">
      <div className={`${showPreview ? "flex-1" : "mx-auto max-w-3xl w-full"} p-6`}>
        {activeTab === "design" && (
          <div className="space-y-6">
            <FormInput label="Booking page name" value={name} onChange={(e) => setName(e.target.value)} />

            {/* Branding section */}
            <div className="space-y-3">
              <div>
                <h3 className="text-heading-sm text-text">Set your branding</h3>
                <p className="text-body-sm text-text-secondary">Select a look for the branding</p>
              </div>
              <RadioGroup
                name="brandingMode"
                options={brandingOptions}
                value={brandingMode}
                onChange={setBrandingMode}
              />
              {brandingMode === "logo" && (
                <div>
                  <label className="mb-2 block text-label-lg text-text">Logo / Header image</label>
                  <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-gray-50">
                    <div className="text-center">
                      <Upload className="mx-auto mb-1 h-6 w-6 text-text-secondary" />
                      <span className="text-caption-md text-text-secondary">Click or drag to upload</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Button styling section */}
            <div className="space-y-3">
              <div>
                <h3 className="text-heading-sm text-text">Button styling</h3>
              </div>
              <div>
                <p className="mb-2 text-label-lg text-text-secondary">Colours</p>
                <div className="grid grid-cols-2 gap-4">
                  <FormColorPicker label="Primary" value={buttonColor} onChange={setButtonColor} />
                  <FormColorPicker label="Secondary" value={secondaryColor} onChange={setSecondaryColor} />
                </div>
              </div>
              <div>
                <p className="mb-2 text-label-md text-text-secondary">Accessible colour suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {COLOR_SWATCHES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setButtonColor(color)}
                      className="h-7 w-7 rounded-full border-2 border-transparent hover:border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Button preview */}
            <div className="rounded-lg border border-border p-4">
              <h3 className="mb-3 text-heading-sm text-text">Preview</h3>
              <div className="flex items-center gap-3">
                <button className="rounded-lg px-6 py-2.5 text-label-lg text-white" style={{ backgroundColor: buttonColor }}>
                  {buttonText}
                </button>
                <button className="rounded-lg px-6 py-2.5 text-label-lg" style={{ backgroundColor: secondaryColor, color: buttonColor }}>
                  {buttonText}
                </button>
              </div>
            </div>

            {/* Important notice banner */}
            <div className="space-y-3">
              <Toggle label="Important notice banner" checked={noticeEnabled} onChange={setNoticeEnabled} />
              <p className="text-body-sm text-text-secondary">
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
            </div>

            {/* Auto Risk */}
            <div className="space-y-2">
              <Toggle label="Auto Risk" checked={autoRisk} onChange={setAutoRisk} />
              <p className="text-body-sm text-text-secondary">
                Auto-assign clients are required to review practice at the time of service.
              </p>
            </div>

            {/* Service rating */}
            <div className="space-y-2">
              <Toggle label="Service rating" checked={serviceRating} onChange={setServiceRating} />
            </div>

            {/* Download online booking notice */}
            <div className="space-y-3">
              <Toggle label="Download online booking notice" checked={downloadNotice} onChange={setDownloadNotice} />
              <p className="text-body-sm text-text-secondary">
                The notice message will display if you turn this online booking page.
              </p>
              {downloadNotice && (
                <div className="space-y-4">
                  <FormInput label="Online Booking Document" value="" onChange={() => {}} />
                  <FormTextarea
                    label="Notice content"
                    value=""
                    onChange={() => {}}
                    rows={4}
                    placeholder="By proceeding with this online booking, you acknowledge and agree to our booking terms and conditions."
                  />
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 rounded border-border text-primary accent-primary" />
                      <span className="text-body-md text-text">I have read and agree to the terms</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 rounded border-border text-primary accent-primary" />
                      <span className="text-body-md text-text">I accept the privacy policy</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Terms & policies */}
            <div className="space-y-4">
              <Toggle label="Enable booking terms & policies" checked={termsEnabled} onChange={setTermsEnabled} />
              {termsEnabled && (
                <FormTextarea label="Terms & policies" value={terms} onChange={(e) => setTerms(e.target.value)} rows={4} />
              )}
            </div>

            <FormTextarea label="Confirmation message" value={confirmationMsg} onChange={(e) => setConfirmationMsg(e.target.value)} rows={3} />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-heading-md text-text">Booking preferences</h3>
              <div className="space-y-4">
                <Toggle label="Allow clients to select a practitioner" checked={true} onChange={() => {}} />
                <Toggle label="Allow clients to add to waitlist" checked={true} onChange={() => {}} />
                <Toggle label="Require phone number" checked={true} onChange={() => {}} />
                <Toggle label="Require date of birth" checked={false} onChange={() => {}} />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-heading-md text-text">Scheduling</h3>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-heading-md text-text">Notifications</h3>
              <div className="space-y-4">
                <Toggle label="Send confirmation email to client" checked={true} onChange={() => {}} />
                <Toggle label="Send reminder email (24h before)" checked={true} onChange={() => {}} />
                <Toggle label="Notify practitioner of new bookings" checked={true} onChange={() => {}} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "builder" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-heading-md text-text">Locations</h3>
              <Button variant="secondary" onClick={() => setShowLocationModal(true)}>Manage locations</Button>
            </div>
            <div className="space-y-2">
              {["East Clinics", "West Clinics", "North Clinics"].map((loc) => (
                <div key={loc} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <span className="text-body-md text-text">{loc}</span>
                  <Toggle checked={loc !== "North Clinics"} onChange={() => {}} />
                </div>
              ))}
            </div>

            <div>
              <h3 className="mb-3 text-heading-md text-text">Services</h3>
              <p className="text-body-md text-text-secondary">All services are displayed by default. Configure visibility per service in Settings &rarr; Services.</p>
            </div>

            <div>
              <h3 className="mb-3 text-heading-md text-text">Practitioners</h3>
              <p className="text-body-md text-text-secondary">All practitioners are available by default. Configure availability per practitioner in their profile.</p>
            </div>
          </div>
        )}

        {activeTab === "share" && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-heading-md text-text">Shareable link</h3>
              <p className="mb-3 text-body-md text-text-secondary">Share this link with your clients to allow them to book online.</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-border bg-gray-50 px-4 py-2.5">
                  <span className="text-body-md text-primary break-all">{shareUrl}</span>
                </div>
                <Button variant="secondary" onClick={() => navigator.clipboard?.writeText(shareUrl)}>
                  <Copy className="h-4 w-4" /> Copy
                </Button>
                <Button variant="secondary" onClick={() => window.open(shareUrl, "_blank")}>
                  <ExternalLink className="h-4 w-4" /> Open
                </Button>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-heading-md text-text">Embed code</h3>
              <p className="mb-3 text-body-md text-text-secondary">Add this code to your website to embed the booking widget.</p>
              <pre className="overflow-x-auto rounded-lg border border-border bg-gray-50 p-4 text-body-sm text-text">
{`<iframe
  src="${shareUrl}"
  width="100%"
  height="800"
  frameBorder="0"
></iframe>`}
              </pre>
            </div>

            <div>
              <h3 className="mb-2 text-heading-md text-text">Google Tag Manager ID</h3>
              <FormInput
                label=""
                value={gtmId}
                onChange={(e) => setGtmId(e.target.value)}
                placeholder="GTM-TEST131"
              />
            </div>
          </div>
        )}
      </div>

      {/* Live preview panel */}
      {showPreview && (
        <div className="w-[400px] shrink-0 border-l border-border bg-gray-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-heading-sm text-text">Preview</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-white shadow-sm">
            <div className="p-5">
              <h2 className="mb-4 text-heading-lg text-text">Select a location</h2>
              <div className="space-y-2">
                {["East Clinics", "West Clinics"].map((loc) => (
                  <div key={loc} className="flex items-center justify-between rounded-[12px] border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-lg">
                        🔥
                      </div>
                      <div>
                        <div className="text-body-md font-medium text-text">{loc}</div>
                        <div className="text-caption-md text-text-secondary">Mobile and/or telehealth</div>
                      </div>
                    </div>
                    <button
                      className="rounded-[8px] px-3 py-1.5 text-body-sm font-medium text-white"
                      style={{ backgroundColor: buttonColor }}
                    >
                      {buttonText || "Select"}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button
                  disabled
                  className="w-full rounded-[8px] bg-[rgba(0,0,0,0.25)] px-3 py-2 text-body-md font-medium text-white cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
            <div className="border-t border-border px-5 py-3 text-center text-caption-md text-text-secondary">
              Powered by <span className="font-semibold text-primary">splose</span>
            </div>
          </div>
        </div>
      )}
      </div>

      <Modal open={showLocationModal} onClose={() => setShowLocationModal(false)} title="Manage locations displayed">
        <div className="space-y-2">
          {["East Clinics", "West Clinics", "North Clinics", "Telehealth"].map((loc) => (
            <label key={loc} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 cursor-pointer hover:bg-gray-50">
              <input type="checkbox" defaultChecked={loc !== "Telehealth"} className="h-4 w-4 rounded border-border text-primary" />
              <span className="text-body-md text-text">{loc}</span>
            </label>
          ))}
        </div>
      </Modal>
    </div>
  );
}
