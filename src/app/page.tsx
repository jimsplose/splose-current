import {
  Calendar,
  Users,
  DollarSign,
  FileText,
  Clock,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/Header";
import StatusBadge from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const [
    appointmentCount,
    clientCount,
    todayAppointments,
    recentInvoices,
    unsignedNotes,
  ] = await Promise.all([
    prisma.appointment.count({
      where: { date: new Date().toISOString().split("T")[0] },
    }),
    prisma.client.count({ where: { active: true } }),
    prisma.appointment.findMany({
      where: { date: new Date().toISOString().split("T")[0] },
      include: { client: true, practitioner: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.invoice.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.clinicalNote.count({ where: { signed: false } }),
  ]);

  const totalRevenue = await prisma.invoice.aggregate({
    _sum: { total: true },
    where: { status: "Paid" },
  });

  return {
    appointmentCount,
    clientCount,
    todayAppointments,
    recentInvoices,
    unsignedNotes,
    totalRevenue: totalRevenue._sum.total || 0,
  };
}

export default async function Dashboard() {
  const data = await getDashboardData();

  const stats = [
    {
      label: "Today's Appointments",
      value: data.appointmentCount,
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      label: "Active Clients",
      value: data.clientCount,
      icon: Users,
      color: "bg-indigo-500",
    },
    {
      label: "Revenue (Paid)",
      value: `$${data.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      label: "Unsigned Notes",
      value: data.unsignedNotes,
      icon: FileText,
      color: "bg-amber-500",
    },
  ];

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-6">
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color} text-white`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Today's Schedule */}
          <div className="rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold">Today&apos;s Schedule</h2>
              <Clock className="h-5 w-5 text-text-secondary" />
            </div>
            <div className="divide-y divide-border">
              {data.todayAppointments.length === 0 ? (
                <p className="p-6 text-center text-text-secondary">
                  No appointments today
                </p>
              ) : (
                data.todayAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center justify-between px-6 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: appt.practitioner.color,
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {appt.client.firstName} {appt.client.lastName}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {appt.practitioner.name} &middot; {appt.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-text-secondary">
                        {appt.startTime} - {appt.endTime}
                      </span>
                      <StatusBadge status={appt.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold">Recent Invoices</h2>
              <TrendingUp className="h-5 w-5 text-text-secondary" />
            </div>
            <div className="divide-y divide-border">
              {data.recentInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between px-6 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {inv.invoiceNumber}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {inv.client.firstName} {inv.client.lastName} &middot;{" "}
                      {inv.billingType}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      ${inv.total.toFixed(2)}
                    </span>
                    <StatusBadge status={inv.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
