"use client";

import { Button } from "@/components/ds";

const integrations = [
  { name: "Xero", description: "Xero is world leading online accounting software built for small business. splose syncs all invoices, payments, credits, refunds, line of accounts and tax rates with Xero automatically. We're recommend that all Xero users have two-factor authentication enabled.", connected: true, buttonLabel: "Settings", color: "#13B5EA" },
  { name: "QuickBooks", description: "QuickBooks is a leading online accounting solution designed for small businesses. splose syncs all invoices, payments, credits, contacts, chart of accounts, and tax rates with QuickBooks automatically. We encourage all users to enable two-factor authentication to enhance the security of their accounts.", connected: false, buttonLabel: "Connect to QuickBooks", color: "#2CA01C" },
  { name: "Stripe", description: "Stripe is a payment processing platform that helps you get paid online. Accept credit card payments via online bookings, and add a Pay now button to your invoices. Standard Stripe fees — splose EFTPOS platform fee applies to successful payments.", connected: true, buttonLabel: "Settings", color: "#635BFF" },
  { name: "Mailchimp", description: "Mailchimp is a marketing automation platform and email marketing service used to design and send email campaigns and newsletters to your mailing lists and track results. splose sends clients to your selected audience in Mailchimp.", connected: false, buttonLabel: "Connect", color: "#FFE01B" },
  { name: "HICAPS", description: "HICAPS is an online claiming platform that allows you to easily claim invoices to the TAC, Worksite Victoria, NDIS, Medicare, MBS and more. With HICAPS and splose, you can run a price determination for NDIS plan managed invoices and submit them for fast payment.", connected: false, buttonLabel: "Connect", color: "#00B140" },
  { name: "Tyro Health", description: "Tyro is a related healthcare providers to process digital payments and claims online. This includes Medicare, Bulk Bill and Patient Claims, DVA, health fund claims and contactless debit and credit cards (incl. NDIS, plus or running a card directly within an invoice or payment).", connected: false, buttonLabel: "Connect", color: "#0D1137" },
  { name: "Zoom", description: "Zoom is the leader in modern enterprise video communications with an easy, reliable cloud platform for video and audio conferencing, online chat. Automatically create and attach Zoom Meetings for appointments created in splose and send it to clients in email and SMS.", connected: true, buttonLabel: "Settings", color: "#2D8CFF" },
  { name: "Physitrack", description: "Physitrack is an online platform that encompasses clinical home exercise and education prescription, outcomes collection, and Telehealth. It can automatically create home exercise programs created in Physitrack in the Files section of the client's splose profile.", connected: false, buttonLabel: "Connect", color: "#00C2CB" },
];

export default function IntegrationsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Integrations</h1>
      </div>
      <div className="space-y-6">
        {integrations.map((integration) => (
          <div key={integration.name} className="border-b border-border pb-6 last:border-b-0">
            <div className="flex items-start gap-6">
              <div className="flex h-16 w-40 shrink-0 items-center justify-center">
                <span className="text-2xl font-bold" style={{ color: integration.color }}>{integration.name}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary leading-relaxed">{integration.description}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-start pl-0">
              <Button variant={integration.connected ? "secondary" : "primary"}>{integration.buttonLabel}</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
