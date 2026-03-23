import { prisma } from "@/lib/prisma";
import { Plus, Mail, Phone } from "lucide-react";
import { Avatar, Badge, Button, Card, IconText, PageHeader, Stat } from "@/components/ds";

export const dynamic = "force-dynamic";

export default async function PractitionersPage() {
  const practitioners = await prisma.practitioner.findMany({
    where: { active: true },
    include: {
      _count: {
        select: { appointments: true, notes: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="Practitioners">
        <Button variant="primary">
          <Plus className="h-4 w-4" /> Add Practitioner
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {practitioners.map((p) => (
          <Card
            key={p.id}
            padding="none"
            className="cursor-pointer p-6 transition-shadow duration-150 hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <Avatar name={p.name} color={p.color} size="xl" />
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-text">{p.name}</h3>
                <p className="truncate text-sm text-text-secondary">{p.role}</p>
                {p.specialty && (
                  <Badge variant="purple" className="mt-1">
                    {p.specialty}
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <IconText icon={<Mail className="h-4 w-4" />}>{p.email}</IconText>
              {p.phone && (
                <IconText icon={<Phone className="h-4 w-4" />}>{p.phone}</IconText>
              )}
            </div>

            <div className="mt-4 flex gap-4 border-t border-border pt-4">
              <Stat value={p._count.appointments} label="Appointments" />
              <Stat value={p._count.notes} label="Notes" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
