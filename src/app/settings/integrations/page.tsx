"use client";

import { Button } from "@/components/ds";

interface Integration {
  name: string;
  description: string;
  connected: boolean;
  logo: React.ReactNode;
  actions: {
    label: string;
    variant: "primary" | "secondary" | "danger";
    href?: string;
  }[];
  profileLink?: { label: string; href: string };
}

/* eslint-disable @next/next/no-img-element */
function IntegrationLogo({ src, alt, className = "h-12" }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={`w-auto object-contain ${className}`} />;
}

const integrations: Integration[] = [
  {
    name: "Xero",
    description:
      "Xero is world leading online accounting software built for small business. splose syncs all invoices, payments, credits, refunds, line of accounts and tax rates with Xero automatically. We recommend that all Xero users have two-factor authentication enabled.",
    connected: true,
    logo: <IntegrationLogo src="/images/integrations/xero.svg" alt="Xero" />,
    actions: [
      { label: "Settings", variant: "secondary" },
      { label: "Disconnect", variant: "danger" },
    ],
  },
  {
    name: "QuickBooks",
    description:
      "QuickBooks is a leading online accounting solution designed for small businesses. splose syncs all invoices, payments, credits, contacts, chart of accounts, and tax rates with QuickBooks automatically. We encourage all users to enable two-factor authentication to enhance the security of their accounts.",
    connected: false,
    logo: <IntegrationLogo src="/images/integrations/quickbooks.svg" alt="QuickBooks" />,
    actions: [{ label: "Connect to QuickBooks", variant: "primary" }],
  },
  {
    name: "Stripe",
    description:
      "Stripe is a payment processing platform that helps you get paid online. Accept credit card payments via online bookings, and add a Pay now button to your invoices. Standard Stripe fees \u2014 splose EFTPOS platform fee applies to successful payments.",
    connected: true,
    logo: <IntegrationLogo src="/images/integrations/stripe.svg" alt="Stripe" />,
    profileLink: {
      label: "View your profile in Stripe",
      href: "#",
    },
    actions: [{ label: "Settings", variant: "secondary" }],
  },
  {
    name: "Mailchimp",
    description:
      "Mailchimp is a marketing automation platform and email marketing service used to design and send email campaigns and newsletters to your mailing lists and track results. splose sends clients to your selected audience in Mailchimp.",
    connected: false,
    logo: <IntegrationLogo src="/images/integrations/mailchimp.svg" alt="Mailchimp" />,
    actions: [{ label: "Connect", variant: "primary" }],
  },
  {
    name: "HICAPS",
    description:
      "HICAPS is an online claiming platform that allows you to easily claim invoices to the TAC, Worksite Victoria, NDIS, Medicare, MBS and more. With HICAPS and splose, you can run a price determination for NDIS plan managed invoices and submit them for fast payment.",
    connected: false,
    logo: <IntegrationLogo src="/images/integrations/hicaps.png" alt="HICAPS" />,
    actions: [{ label: "Connect", variant: "primary" }],
  },
  {
    name: "Tyro Health",
    description:
      "Tyro is a related healthcare providers to process digital payments and claims online. This includes Medicare, Bulk Bill and Patient Claims, DVA, health fund claims and contactless debit and credit cards (incl. NDIS, plus or running a card directly within an invoice or payment).",
    connected: false,
    logo: <IntegrationLogo src="/images/integrations/tyro-health.png" alt="Tyro Health" />,
    actions: [{ label: "Connect", variant: "primary" }],
  },
  {
    name: "Zoom",
    description:
      "Zoom is the leader in modern enterprise video communications with an easy, reliable cloud platform for video and audio conferencing, online chat. Automatically create and attach Zoom Meetings for appointments created in splose and send it to clients in email and SMS.",
    connected: true,
    logo: <span className="text-5xl font-bold text-[#2D8CFF]">Zoom</span>,
    actions: [{ label: "Settings", variant: "secondary" }],
  },
  {
    name: "Physitrack",
    description:
      "Physitrack is an online platform that encompasses clinical home exercise and education prescription, outcomes collection, and Telehealth. It can automatically create home exercise programs created in Physitrack in the Files section of the client\u2019s splose profile.",
    connected: false,
    logo: <IntegrationLogo src="/images/integrations/physitrack.svg" alt="Physitrack" />,
    actions: [{ label: "Connect", variant: "primary" }],
  },
];

export default function IntegrationsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-display-lg">Integrations</h1>
      </div>
      <div className="divide-y divide-border">
        {integrations.map((integration) => (
          <div key={integration.name} className="py-8 first:pt-0 last:pb-0">
            <div className="flex flex-col items-center text-center">
              {/* Logo */}
              <div className="mb-3 flex h-20 items-center justify-center">
                {integration.logo}
              </div>

              {/* Name */}
              <h2 className="mb-2 text-heading-md text-text">
                {integration.name}
              </h2>

              {/* Description */}
              <p className="mb-4 max-w-2xl text-body-md leading-relaxed text-text-secondary">
                {integration.description}
              </p>

              {/* Profile link (Stripe) */}
              {integration.profileLink && (
                <a
                  href={integration.profileLink.href}
                  className="mb-4 text-body-md text-primary hover:underline"
                >
                  {integration.profileLink.label}
                </a>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {integration.actions.map((action) => (
                  <Button
                    key={action.label}
                    variant={action.variant}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
