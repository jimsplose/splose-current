import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Mail, Phone } from "lucide-react";
import { Avatar, Badge, Button, Card, IconText, PageHeader, Stat, statusVariant } from "@/components/ds";

export const dynamic = "force-dynamic";

// Names of practitioners currently on leave (simulated — no schema change needed)
const ON_LEAVE_NAMES = new Set(["Daniel O'Brien", "Mei Lin"]);

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
    <div className="px-[22.5px] py-[10px]">
      <PageHeader title="Practitioners">
        <Button variant="primary">
          <Plus className="h-4 w-4" /> Add Practitioner
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {practitioners.map((p) => {
          const isOnLeave = ON_LEAVE_NAMES.has(p.name);
          const status = isOnLeave ? "On Leave" : "Active";

          return (
            <Link key={p.id} href={`/practitioners/${p.id}`} className="block">
              <Card
                padding="none"
                className={`cursor-pointer p-6 transition-shadow duration-150 hover:border-primary/30 hover:shadow-md ${isOnLeave ? "opacity-75" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <Avatar name={p.name} color={p.color} size="xl" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold text-text">{p.name}</h3>
                      <Badge variant={statusVariant(status)} className="shrink-0">
                        {status}
                      </Badge>
                    </div>
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
