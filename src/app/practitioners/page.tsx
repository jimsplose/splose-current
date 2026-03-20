import { prisma } from "@/lib/prisma";
import { Plus, Mail, Phone } from "lucide-react";
import { Badge, Button, PageHeader } from "@/components/ds";

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
          <div
            key={p.id}
            className="cursor-pointer rounded-xl border border-border bg-surface p-6 transition-shadow duration-150 hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-heading-lg text-white"
                style={{ backgroundColor: p.color }}
              >
                {p.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </div>
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
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{p.email}</span>
              </div>
              {p.phone && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{p.phone}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-4 border-t border-border pt-4">
              <div className="text-center">
                <p className="text-heading-lg text-text">{p._count.appointments}</p>
                <p className="text-xs text-text-secondary">Appointments</p>
              </div>
              <div className="text-center">
                <p className="text-heading-lg text-text">{p._count.notes}</p>
                <p className="text-xs text-text-secondary">Notes</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
