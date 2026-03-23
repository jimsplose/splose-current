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
} from "@/components/ds";

const designTabs = [
  { label: "Design", value: "design" },
  { label: "Builder", value: "builder" },
  { label: "Share", value: "share" },
];

export default function EditOnlineBookingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("design");
  const [name, setName] = useState("Standard Booking");
  const [buttonColor, setButtonColor] = useState("#7c3aed");
  const [buttonText, setButtonText] = useState("Book Now");
  const [headerImage, setHeaderImage] = useState("");
  const [termsEnabled, setTermsEnabled] = useState(true);
  const [terms, setTerms] = useState("By booking an appointment, you agree to our cancellation policy. Cancellations made less than 24 hours before the appointment may incur a fee.");
  const [confirmationMsg, setConfirmationMsg] = useState("Thank you for your booking! You will receive a confirmation email shortly.");
  const [showLocationModal, setShowLocationModal] = useState(false);

  const shareUrl = "https://acme.splose.com/online-booking/7b2c0db8-cb7b-40de-991e-631ecdb30cf0";

  return (
    <div>
      <Navbar
        backHref="/settings/online-bookings"
        title={name || "Edit online booking"}
      >
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => router.push("/settings/online-bookings")}>Cancel</Button>
          <Button variant="primary" onClick={() => router.push("/settings/online-bookings")}>Save</Button>
        </div>
      </Navbar>

      <div className="border-b border-border px-6">
        <Tab items={designTabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <div className="mx-auto max-w-3xl p-6">
        {activeTab === "design" && (
          <div className="space-y-6">
            <FormInput label="Booking page name" value={name} onChange={(e) => setName(e.target.value)} />

            <div>
              <label className="mb-2 block text-label-lg text-text">Logo / Header image</label>
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-gray-50">
                <div className="text-center">
                  <Upload className="mx-auto mb-1 h-6 w-6 text-text-secondary" />
                  <span className="text-caption-md text-text-secondary">Click or drag to upload</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormColorPicker label="Button colour" value={buttonColor} onChange={setButtonColor} />
              <FormInput label="Button text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} />
            </div>

            <div className="rounded-lg border border-border p-4">
              <h3 className="mb-3 text-heading-sm text-text">Preview</h3>
              <button className="rounded-lg px-6 py-2.5 text-label-lg text-white" style={{ backgroundColor: buttonColor }}>
                {buttonText}
              </button>
            </div>

            <div className="space-y-4">
              <Toggle label="Enable booking terms & policies" checked={termsEnabled} onChange={setTermsEnabled} />
              {termsEnabled && (
                <FormTextarea label="Terms & policies" value={terms} onChange={(e) => setTerms(e.target.value)} rows={4} />
              )}
            </div>

            <FormTextarea label="Confirmation message" value={confirmationMsg} onChange={(e) => setConfirmationMsg(e.target.value)} rows={3} />
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
