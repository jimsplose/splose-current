import Header from "@/components/Header";
import { Building2, Bell, Shield, Palette, Globe, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const sections = [
    {
      icon: Building2,
      title: "Practice Details",
      description: "Manage your practice name, address, and contact information",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Configure email, SMS, and in-app notification preferences",
    },
    {
      icon: Shield,
      title: "Users & Permissions",
      description: "Manage team members, roles, and access permissions",
    },
    {
      icon: Palette,
      title: "Appearance",
      description: "Customize branding, colors, and display preferences",
    },
    {
      icon: Globe,
      title: "Integrations",
      description: "Connect with Medicare, NDIS, accounting, and other services",
    },
    {
      icon: CreditCard,
      title: "Billing & Subscription",
      description: "Manage your Splose subscription and payment methods",
    },
  ];

  return (
    <>
      <Header title="Settings" />
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.title}
                className="rounded-xl border border-border bg-surface p-6 text-left transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{section.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  {section.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
