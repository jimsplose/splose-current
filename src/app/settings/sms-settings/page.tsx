"use client";

import { useState } from "react";
import { Button, FormInput, FormSelect, Badge, statusVariant, Toggle } from "@/components/ds";

const smsTemplates = [
  { name: "Appointment reminder (24hr)", content: "Hi {client_first_name}, this is a reminder of your appointment with {practitioner_name} at {clinic_name} on {appointment_date} at {appointment_time}. Reply C to confirm or call us on {clinic_phone} to reschedule.", active: true },
  { name: "Appointment reminder (2hr)", content: "Hi {client_first_name}, your appointment with {practitioner_name} is in 2 hours at {appointment_time}. See you soon!", active: true },
  { name: "Appointment confirmation", content: "Hi {client_first_name}, your appointment has been booked with {practitioner_name} on {appointment_date} at {appointment_time}. Reply C to confirm.", active: true },
  { name: "Cancellation notice", content: "Hi {client_first_name}, your appointment on {appointment_date} at {appointment_time} has been cancelled. Please call {clinic_phone} to rebook.", active: false },
  { name: "Follow-up reminder", content: "Hi {client_first_name}, it has been a while since your last visit. Would you like to book a follow-up? Call us on {clinic_phone} or book online.", active: false },
  { name: "Invoice reminder", content: "Hi {client_first_name}, you have an outstanding balance of {invoice_amount} for your recent appointment. Please pay via {payment_link}.", active: true },
];

const history = [
  { to: "Sarah Johnson", phone: "0412 345 678", template: "Appointment reminder (24hr)", sent: "17 Mar 2026, 9:00 am", status: "Delivered" },
  { to: "Michael Chen", phone: "0423 456 789", template: "Appointment confirmation", sent: "17 Mar 2026, 8:45 am", status: "Delivered" },
  { to: "Emily Williams", phone: "0434 567 890", template: "Appointment reminder (24hr)", sent: "16 Mar 2026, 9:00 am", status: "Delivered" },
  { to: "James Brown", phone: "0445 678 901", template: "Invoice reminder", sent: "16 Mar 2026, 10:30 am", status: "Failed" },
  { to: "Olivia Davis", phone: "0456 789 012", template: "Appointment reminder (2hr)", sent: "15 Mar 2026, 2:00 pm", status: "Delivered" },
];

export default function SMSSettingsPage() {
  const [activeTab, setActiveTab] = useState<"provider" | "templates" | "history">("provider");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">SMS settings</h1>
          <p className="mt-1 text-sm text-text-secondary">Configure SMS notifications and reminders for your clients</p>
        </div>
        <Button variant="primary">Save</Button>
      </div>
      <div className="mb-6 flex items-center gap-6 border-b border-border">
        {([["provider", "Provider & balance"], ["templates", "Templates"], ["history", "Send history"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)} className={`border-b-2 px-1 pb-3 text-sm ${activeTab === key ? "border-primary font-medium text-primary" : "border-transparent text-text-secondary hover:text-text"}`}>{label}</button>
        ))}
      </div>
      {activeTab === "provider" && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-lg border border-border bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text">SMS balance</h3>
              <Button variant="secondary" size="sm" className="border-primary text-primary hover:bg-purple-50">Top up</Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-green-50 p-4 text-center"><p className="text-2xl font-bold text-green-700">1,247</p><p className="text-xs text-green-600 mt-1">Credits remaining</p></div>
              <div className="rounded-lg bg-blue-50 p-4 text-center"><p className="text-2xl font-bold text-blue-700">3,856</p><p className="text-xs text-blue-600 mt-1">Sent this month</p></div>
              <div className="rounded-lg bg-purple-50 p-4 text-center"><p className="text-2xl font-bold text-purple-700">98.2%</p><p className="text-xs text-purple-600 mt-1">Delivery rate</p></div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-white p-5">
            <h3 className="text-sm font-semibold text-text mb-4">Provider configuration</h3>
            <div className="space-y-4">
              <FormSelect label="SMS provider" options={[{ value: "Twilio", label: "Twilio" }, { value: "MessageMedia", label: "MessageMedia" }, { value: "Burst SMS", label: "Burst SMS" }]} />
              <div>
                <FormInput label="Sender name / number" type="text" defaultValue="AcmeHealth" />
                <p className="mt-1 text-xs text-text-secondary">Max 11 characters. Letters and numbers only.</p>
              </div>
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-text">Auto-send appointment reminders</p><p className="text-xs text-text-secondary">Automatically send reminders 24 hours before appointments</p></div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-text">Send confirmation on booking</p><p className="text-xs text-text-secondary">Send SMS when a new appointment is created</p></div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === "templates" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">Manage your SMS templates. Use merge tags like <code className="rounded bg-gray-100 px-1 py-0.5 text-xs text-primary">{"{client_first_name}"}</code> to personalise messages.</p>
            <Button variant="primary">+ New template</Button>
          </div>
          <div className="rounded-lg border border-border bg-white overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-border bg-gray-50"><th className="px-4 py-3 text-left text-sm font-medium text-text">Template name</th><th className="px-4 py-3 text-left text-sm font-medium text-text">Preview</th><th className="px-4 py-3 text-center text-sm font-medium text-text">Status</th><th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th></tr></thead>
              <tbody className="divide-y divide-border">
                {smsTemplates.map((t) => (
                  <tr key={t.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-text whitespace-nowrap">{t.name}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary max-w-md truncate">{t.content}</td>
                    <td className="px-4 py-3 text-center"><Badge variant={t.active ? "green" : "gray"}>{t.active ? "Active" : "Inactive"}</Badge></td>
                    <td className="px-4 py-3 text-right"><button className="text-text-secondary hover:text-text text-sm">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === "history" && (
        <div className="rounded-lg border border-border bg-white overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-border bg-gray-50"><th className="px-4 py-3 text-left text-sm font-medium text-text">Recipient</th><th className="px-4 py-3 text-left text-sm font-medium text-text">Phone</th><th className="px-4 py-3 text-left text-sm font-medium text-text">Template</th><th className="px-4 py-3 text-left text-sm font-medium text-text">Sent</th><th className="px-4 py-3 text-center text-sm font-medium text-text">Status</th></tr></thead>
            <tbody className="divide-y divide-border">
              {history.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-text">{item.to}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{item.phone}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{item.template}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{item.sent}</td>
                  <td className="px-4 py-3 text-center"><Badge variant={statusVariant(item.status)}>{item.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
