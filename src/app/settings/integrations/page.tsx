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

function XeroLogo() {
  return (
    <svg viewBox="0 0 120 40" className="h-16 w-auto" aria-label="Xero logo">
      <text x="10" y="32" fontFamily="Arial, sans-serif" fontSize="34" fontWeight="bold" fill="#13B5EA">
        xero
      </text>
    </svg>
  );
}

function QuickBooksLogo() {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-medium tracking-wider text-gray-500">INTUIT</span>
      <span className="text-3xl font-bold text-[#2CA01C]">quickbooks</span>
    </div>
  );
}

function StripeLogo() {
  return (
    <svg viewBox="0 0 120 40" className="h-14 w-auto" aria-label="Stripe logo">
      <text x="10" y="32" fontFamily="Arial, sans-serif" fontSize="34" fontWeight="bold" fill="#635BFF">
        stripe
      </text>
    </svg>
  );
}

function MailchimpLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFE01B]">
        <span className="text-lg font-bold text-black">M</span>
      </div>
      <span className="text-3xl font-bold text-[#241C15]">mailchimp</span>
    </div>
  );
}

function HicapsLogo() {
  return (
    <span className="text-4xl font-black tracking-tight text-[#00B140]">
      HICAPS
    </span>
  );
}

function TyroHealthLogo() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-4xl font-bold text-[#0D1137]">tyro</span>
      <span className="text-4xl font-light text-[#0D1137]">Health</span>
    </div>
  );
}

function ZoomLogo() {
  return (
    <span className="text-5xl font-bold text-[#2D8CFF]">Zoom</span>
  );
}

function PhysitrackLogo() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex h-8 w-8 items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#00C2CB" strokeWidth="2" />
          <path d="M8 12l3 3 5-6" stroke="#00C2CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-3xl font-bold text-[#00C2CB]">Physitrack</span>
    </div>
  );
}

const integrations: Integration[] = [
  {
    name: "Xero",
    description:
      "Xero is world leading online accounting software built for small business. splose syncs all invoices, payments, credits, refunds, line of accounts and tax rates with Xero automatically. We recommend that all Xero users have two-factor authentication enabled.",
    connected: true,
    logo: <XeroLogo />,
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
    logo: <QuickBooksLogo />,
    actions: [{ label: "Connect to QuickBooks", variant: "primary" }],
  },
  {
    name: "Stripe",
    description:
      "Stripe is a payment processing platform that helps you get paid online. Accept credit card payments via online bookings, and add a Pay now button to your invoices. Standard Stripe fees \u2014 splose EFTPOS platform fee applies to successful payments.",
    connected: true,
    logo: <StripeLogo />,
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
    logo: <MailchimpLogo />,
    actions: [{ label: "Connect", variant: "primary" }],
  },
  {
    name: "HICAPS",
    description:
      "HICAPS is an online claiming platform that allows you to easily claim invoices to the TAC, Worksite Victoria, NDIS, Medicare, MBS and more. With HICAPS and splose, you can run a price determination for NDIS plan managed invoices and submit them for fast payment.",
    connected: false,
    logo: <HicapsLogo />,
    actions: [{ label: "Connect", variant: "primary" }],
  },
  {
    name: "Tyro Health",
    description:
      "Tyro is a related healthcare providers to process digital payments and claims online. This includes Medicare, Bulk Bill and Patient Claims, DVA, health fund claims and contactless debit and credit cards (incl. NDIS, plus or running a card directly within an invoice or payment).",
    connected: false,
    logo: <TyroHealthLogo />,
    actions: [{ label: "Connect", variant: "primary" }],
  },
  {
    name: "Zoom",
    description:
      "Zoom is the leader in modern enterprise video communications with an easy, reliable cloud platform for video and audio conferencing, online chat. Automatically create and attach Zoom Meetings for appointments created in splose and send it to clients in email and SMS.",
    connected: true,
    logo: <ZoomLogo />,
    actions: [{ label: "Settings", variant: "secondary" }],
  },
  {
    name: "Physitrack",
    description:
      "Physitrack is an online platform that encompasses clinical home exercise and education prescription, outcomes collection, and Telehealth. It can automatically create home exercise programs created in Physitrack in the Files section of the client\u2019s splose profile.",
    connected: false,
    logo: <PhysitrackLogo />,
    actions: [{ label: "Connect", variant: "primary" }],
  },
];

export default function IntegrationsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-display-lg text-text">Integrations</h1>
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
