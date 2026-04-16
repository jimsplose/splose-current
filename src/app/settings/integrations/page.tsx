"use client";

import { Flex } from "antd";
import { Button, Card, PageHeader, Text } from "@/components/ds";

interface Integration {
  name: string;
  description: string;
  brandUrl?: string;
  connected: boolean | "incomplete-profile";
  logo: React.ReactNode;
  actions: {
    label: string;
    variant: "primary" | "secondary" | "danger";
  }[];
  customButton?: React.ReactNode;
}

/* eslint-disable @next/next/no-img-element */
function IntegrationLogo({ src, alt, height = 100 }: { src: string; alt: string; height?: number }) {
  return <img src={src} alt={alt} style={{ width: "auto", maxWidth: "70%", objectFit: "contain", height }} />;
}

function BrandDescription({ name, brandUrl, text }: { name: string; brandUrl?: string; text: string }) {
  // Render first occurrence of brand name as a purple link, rest as plain text
  const idx = text.indexOf(name);
  if (idx === -1 || !brandUrl) {
    return <Text variant="body/md" color="text">{text}</Text>;
  }
  const before = text.slice(0, idx);
  const after = text.slice(idx + name.length);
  return (
    <Text variant="body/md" color="text">
      {before}
      <a href={brandUrl} className="text-primary" style={{ textDecoration: "none" }}>{name}</a>
      {after}
    </Text>
  );
}

const integrations: Integration[] = [
  {
    name: "Xero",
    brandUrl: "https://www.xero.com",
    description:
      "Xero is world-leading online accounting software built for small business. splose syncs all invoices, payments, clients, contacts, chart of accounts and tax rates with Xero automatically. Xero recommends that all active users have two factor authentication enabled.",
    connected: false,
    logo: <IntegrationLogo src="/images/integrations/xero.svg" alt="Xero" />,
    actions: [{ label: "Connect", variant: "secondary" }],
  },
  {
    name: "QuickBooks",
    brandUrl: "https://quickbooks.intuit.com",
    description:
      "QuickBooks is a leading online accounting solution designed for small businesses. splose syncs all invoices, payments, clients, contacts, chart of accounts, and tax rates with QuickBooks automatically. QuickBooks encourages all users to enable two-factor authentication to enhance the security of their accounts.",
    connected: false,
    logo: <IntegrationLogo src="/images/integrations/quickbooks.svg" alt="QuickBooks" />,
    customButton: (
      <a href="#" style={{ display: "inline-block" }}>
        <img
          src="/images/integrations/connect-to-quickbooks.svg"
          alt="Connect to QuickBooks"
          style={{ height: 46 }}
        />
      </a>
    ),
    actions: [],
  },
  {
    name: "Stripe",
    brandUrl: "https://stripe.com",
    description:
      "Stripe is a payment processing platform that helps you get paid online. Accept credit card payments via online bookings, and add a 'Pay now' button to your invoices. Standard Stripe fees \u2014 splose EFTPOS platform fee applies to successful payments.",
    connected: "incomplete-profile",
    logo: <IntegrationLogo src="/images/integrations/stripe.svg" alt="Stripe" />,
    actions: [
      { label: "Complete your profile in Stripe", variant: "secondary" },
      { label: "Disconnect", variant: "danger" },
    ],
  },
  {
    name: "Mailchimp",
    brandUrl: "https://mailchimp.com",
    description:
      "Mailchimp is a marketing automation platform and email marketing service used to design and send email campaigns and newsletters to your mailing lists and track results. splose sends clients to your selected audience in Mailchimp.",
    connected: true,
    logo: <IntegrationLogo src="/images/integrations/mailchimp.svg" alt="Mailchimp" />,
    actions: [
      { label: "Settings", variant: "secondary" },
      { label: "Disconnect", variant: "danger" },
    ],
  },
  {
    name: "HICAPS",
    brandUrl: "https://www.hicaps.com.au",
    description:
      "HICAPS is an online claiming platform that allows you to easily claim invoices to the TAC, Worksafe Victoria, NDIS, Medicare, MBS and more. With HICAPS and splose, you can run a price determination for NDIS plan managed invoices and submit them for fast payment.",
    connected: false,
    logo: <IntegrationLogo src="/images/integrations/hicaps.png" alt="HICAPS" />,
    actions: [{ label: "Connect", variant: "secondary" }],
  },
  {
    name: "Tyro Health",
    brandUrl: "https://www.tyrohealth.com",
    description:
      "Tyro Health enables healthcare providers to process digital payments and claims online. This includes Medicare, Bulk Bill and Patient Claims, DVA, health fund claims and contactless debit and credit cards (incl. NDIS, plus or running a card directly within an invoice or payment).",
    connected: false,
    logo: <IntegrationLogo src="/images/integrations/tyro-health.png" alt="Tyro Health" />,
    actions: [{ label: "Connect", variant: "secondary" }],
  },
  {
    name: "Zoom",
    brandUrl: "https://zoom.us",
    description:
      "Zoom is the leader in modern enterprise video communications with an easy, reliable cloud platform for video and audio conferencing, online chat. Automatically create and attach Zoom Meetings for appointments created in splose and send it to clients in email and SMS.",
    connected: true,
    logo: <IntegrationLogo src="/images/integrations/zoom.svg" alt="Zoom" />,
    actions: [
      { label: "Settings", variant: "secondary" },
      { label: "Disconnect", variant: "danger" },
    ],
  },
  {
    name: "Physitrack",
    brandUrl: "https://www.physitrack.com",
    description:
      "Physitrack is an online platform that encompasses clinical home exercise and education prescription, outcomes collection, and Telehealth. It can automatically create home exercise programs created in Physitrack in the Files section of the client\u2019s splose profile.",
    connected: false,
    logo: <IntegrationLogo src="/images/integrations/physitrack.svg" alt="Physitrack" />,
    actions: [{ label: "Connect", variant: "secondary" }],
  },
];

export default function IntegrationsPage() {
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Integrations" />
      <Flex wrap="wrap" gap={20}>
        {integrations.map((integration) => (
          <Card key={integration.name} padding="xl" style={{ width: 343, borderRadius: 8, border: "0.5px solid rgb(217, 217, 217)" }}>
            {/* Logo */}
            <Flex align="center" style={{ marginBottom: 12, height: 120 }}>
              {integration.logo}
            </Flex>

            {/* Name */}
            <Text
              variant="display/xs"
              as="div"
              color="rgb(33, 105, 71)"
              style={{ marginBottom: 15 }}
            >
              {integration.name}
            </Text>

            {/* Description with brand link */}
            <div style={{ marginBottom: 16, lineHeight: "19.6px", fontSize: 14 }}>
              <BrandDescription
                name={integration.name}
                brandUrl={integration.brandUrl}
                text={integration.description}
              />
            </div>

            {/* Action buttons */}
            <Flex align="center" gap={8} style={{ marginTop: "auto" }}>
              {integration.customButton}
              {integration.actions.map((action) => (
                <Button
                  key={action.label}
                  variant={action.variant}
                >
                  {action.label}
                </Button>
              ))}
            </Flex>
          </Card>
        ))}
      </Flex>
    </div>
  );
}
