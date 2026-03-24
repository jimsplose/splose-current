import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Edit, MoreHorizontal, Mail, Phone } from "lucide-react";
import { Avatar, Badge, Button, Card, List, PageHeader } from "@/components/ds";

export const dynamic = "force-dynamic";

// Mock availability data (not in DB)
const availabilityData: Record<string, { hours: string }> = {
  Monday: { hours: "9:00 AM - 5:00 PM" },
  Tuesday: { hours: "9:00 AM - 5:00 PM" },
  Wednesday: { hours: "9:00 AM - 5:00 PM" },
  Thursday: { hours: "9:00 AM - 5:00 PM" },
  Friday: { hours: "9:00 AM - 5:00 PM" },
  Saturday: { hours: "Not available" },
  Sunday: { hours: "Not available" },
};

// Mock services per specialty
const servicesBySpecialty: Record<string, string[]> = {
  "Speech Therapy": ["Speech Therapy", "Language Assessment", "Fluency Program", "Voice Therapy"],
  "Occupational Therapy": ["OT Assessment", "Sensory Integration", "Fine Motor Skills", "Daily Living Skills"],
  Psychology: ["1:1 Consultation", "CBT Session", "Psychological Assessment", "Group Therapy"],
  Physiotherapy: ["Back Re-Alignment", "Sports Rehab", "Post-Surgery Rehab", "Exercise Program"],
  "General Practice": ["First Appointment", "1:1 Consultation", "Follow-Up", "Health Check"],
};

function getServicesForPractitioner(specialty: string | null): string[] {
  if (!specialty) return ["First Appointment", "1:1 Consultation", "Follow-Up"];
  return servicesBySpecialty[specialty] || ["First Appointment", "1:1 Consultation", "Follow-Up"];
}

export default async function PractitionerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const practitioner = await prisma.practitioner.findUnique({
    where: { id },
    include: {
      _count: {
        select: { appointments: true, notes: true },
      },
    },
  });

  if (!practitioner) {
    notFound();
  }

  const services = getServicesForPractitioner(practitioner.specialty);

  const generalInfo = [
    { label: "Name", value: practitioner.name },
    { label: "Email", value: practitioner.email },
    { label: "Phone", value: practitioner.phone || "Not provided" },
    { label: "Role", value: practitioner.role },
    { label: "User group", value: "Default" },
  ];

  const availabilityItems = Object.entries(availabilityData).map(([day, data]) => ({
    label: day,
    value: (
      <span className={data.hours === "Not available" ? "text-text-secondary" : ""}>
        {data.hours}
      </span>
    ),
  }));

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title={practitioner.name}>
        <Button variant="secondary">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button variant="secondary">
          <MoreHorizontal className="h-4 w-4" />
          Actions
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left section — 2/3 width */}
        <div className="flex-1 space-y-6 lg:w-2/3">
          {/* General */}
          <Card title="General" headerBar>
            <List items={generalInfo} labelWidth="w-32" />
          </Card>

          {/* Availability */}
          <Card title="Availability" headerBar>
            <List items={availabilityItems} labelWidth="w-32" />
          </Card>

          {/* Services */}
          <Card title="Services" headerBar>
            <div className="space-y-2">
              {services.map((service) => (
                <div
                  key={service}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                >
                  <span className="text-body-md text-text">{service}</span>
                  <Badge variant="green">Active</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Stats */}
          <Card title="Activity" headerBar>
            <List
              items={[
                { label: "Appointments", value: String(practitioner._count.appointments) },
                { label: "Clinical notes", value: String(practitioner._count.notes) },
              ]}
              labelWidth="w-32"
            />
          </Card>
        </div>

        {/* Right section — 1/3 width */}
        <div className="space-y-6 lg:w-1/3">
          <Card className="flex flex-col items-center py-8">
            <Avatar name={practitioner.name} color={practitioner.color} size="xl" className="!h-24 !w-24 !text-display-lg" />
            <h2 className="mt-4 text-heading-lg text-text">{practitioner.name}</h2>
            <p className="text-body-md text-text-secondary">{practitioner.role}</p>
            <div className="mt-3 flex flex-col items-center gap-1">
              <span className="flex items-center gap-1.5 text-body-sm text-text-secondary">
                <Mail className="h-3.5 w-3.5" />
                {practitioner.email}
              </span>
              {practitioner.phone && (
                <span className="flex items-center gap-1.5 text-body-sm text-text-secondary">
                  <Phone className="h-3.5 w-3.5" />
                  {practitioner.phone}
                </span>
              )}
            </div>
            <div className="mt-4">
              <Badge variant="green">Active</Badge>
            </div>
          </Card>

          {practitioner.specialty && (
            <Card title="Specialties">
              <div className="flex flex-wrap gap-2">
                <Badge variant="purple">{practitioner.specialty}</Badge>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
