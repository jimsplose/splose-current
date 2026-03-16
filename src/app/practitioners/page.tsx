import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { Plus, Mail, Phone } from "lucide-react";

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
    <>
      <Header title="Practitioners" />
      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            <Plus className="h-4 w-4" />
            Add Practitioner
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {practitioners.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-text-secondary">{p.role}</p>
                  {p.specialty && (
                    <span className="mt-1 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {p.specialty}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Mail className="h-4 w-4" />
                  {p.email}
                </div>
                {p.phone && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Phone className="h-4 w-4" />
                    {p.phone}
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-4 border-t border-border pt-4">
                <div className="text-center">
                  <p className="text-lg font-bold">{p._count.appointments}</p>
                  <p className="text-xs text-text-secondary">Appointments</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{p._count.notes}</p>
                  <p className="text-xs text-text-secondary">Notes</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
