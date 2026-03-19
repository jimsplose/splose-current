"use client";

import { useState } from "react";
import {
  X,
  User,
  Clock,
  Phone,
  Mail,
  AlertTriangle,
  Link2,
  Video,
  FileText,
  Plus,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  MapPin,
  StickyNote,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import {
  Button,
  PageHeader,
  TableHead,
  Th,
  TableBody,
  Td,
  Pagination,
  Badge,
  Avatar,
  Status,
  statusVariant,
} from "@/components/ds";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string | null;
  type: string;
  status: string;
  practitioner: { id: string; name: string };
}

interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatPanelDate(dateStr: string, startTime: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    const formatted = d.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${startTime}, ${formatted}`;
  } catch {
    return `${startTime}, ${dateStr}`;
  }
}

function getInvoiceStatus(appt: Appointment): "Paid" | "Draft" | "Do not invoice" | "---" {
  if (appt.status === "Cancelled") return "Do not invoice";
  if (appt.status === "Completed") {
    const hash = appt.id.split("").reduce((acc: number, ch: string) => acc + ch.charCodeAt(0), 0);
    return hash % 3 === 0 ? "Draft" : "Paid";
  }
  return "---";
}

export default function AppointmentSidePanel({
  appointments,
  client,
}: {
  appointments: Appointment[];
  client: ClientInfo;
}) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main table area */}
      <div className={`flex-1 overflow-y-auto p-4 transition-all sm:p-6 ${selectedAppointment ? "pr-0" : ""}`}>
        <PageHeader title="Appointments">
          <Button>
            Send upcoming appointments
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            New appointment
          </Button>
        </PageHeader>

        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full">
            <TableHead>
              <Th>
                <span className="inline-flex items-center gap-1">
                  When <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
                </span>
              </Th>
              <Th>Where</Th>
              <Th>Type</Th>
              <Th>Practitioner</Th>
              <Th>Invoice status</Th>
              <Th align="right">Actions</Th>
            </TableHead>
            <TableBody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-text-secondary">
                    No appointments
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => {
                  const statusDotColor: "green" | "red" | "yellow" | "gray" | "orange" =
                    appt.status === "Completed"
                      ? "gray"
                      : appt.status === "Cancelled"
                        ? "red"
                        : appt.status === "No Show"
                          ? "yellow"
                          : "orange";
                  const isUpcoming =
                    appt.status === "Scheduled" &&
                    new Date(appt.date + "T00:00:00") >= new Date(new Date().toDateString());
                  const invoiceStatus = getInvoiceStatus(appt);
                  const isSelected = selectedAppointment?.id === appt.id;

                  return (
                    <tr
                      key={appt.id}
                      className={`cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-primary/5" : ""}`}
                      onClick={() => setSelectedAppointment(appt)}
                    >
                      <Td>
                        <div className="flex items-center gap-2">
                          <Status color={isUpcoming ? "green" : statusDotColor} />
                          <span className="text-text">
                            {formatDate(appt.date)}, {appt.startTime}
                          </span>
                          {isUpcoming && (
                            <Badge variant="green" className="bg-green-500 text-white">
                              Upcoming
                            </Badge>
                          )}
                          {appt.status === "Cancelled" && (
                            <Badge variant={statusVariant("Cancelled")}>Cancelled</Badge>
                          )}
                          {appt.status === "No Show" && <StatusBadge status={appt.status} />}
                        </div>
                      </Td>
                      <Td className="text-text-secondary">East Clinics</Td>
                      <Td className="text-text-secondary">{appt.type}</Td>
                      <Td className="text-text-secondary">{appt.practitioner.name}</Td>
                      <Td>
                        {invoiceStatus === "Paid" && (
                          <Badge variant="red" className="bg-red-500 text-white">
                            Paid
                          </Badge>
                        )}
                        {invoiceStatus === "Draft" && (
                          <Badge variant="blue" className="bg-blue-500 text-white">
                            Draft
                          </Badge>
                        )}
                        {invoiceStatus === "Do not invoice" && (
                          <Badge variant="gray" className="bg-gray-700 text-white">
                            Do not invoice
                          </Badge>
                        )}
                        {invoiceStatus === "---" && <span className="text-text-secondary">---</span>}
                      </Td>
                      <Td align="right">
                        <button
                          className="text-text-secondary hover:text-text"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </Td>
                    </tr>
                  );
                })
              )}
            </TableBody>
          </table>
          <Pagination totalItems={appointments.length} itemsPerPage={10} />
        </div>
      </div>

      {/* Side panel */}
      {selectedAppointment && (
        <aside className="w-[380px] shrink-0 overflow-y-auto border-l border-border bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border p-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-text">
                {selectedAppointment.type}
              </h3>
              <p className="mt-0.5 text-xs text-text-secondary">
                ({selectedAppointment.type})
              </p>
            </div>
            <button
              onClick={() => setSelectedAppointment(null)}
              className="ml-2 shrink-0 rounded p-1 text-text-secondary hover:bg-gray-100 hover:text-text"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Details */}
          <div className="space-y-3 p-4 text-sm">
            {/* Practitioner at Location */}
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" />
              <span className="text-text">
                {selectedAppointment.practitioner.name} at East Clinics
              </span>
            </div>

            {/* Practitioner */}
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 shrink-0 text-text-secondary" />
              <span className="text-text">{selectedAppointment.practitioner.name}</span>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" />
              <span className="text-text">
                {formatPanelDate(selectedAppointment.date, selectedAppointment.startTime)} for 60 minutes
              </span>
            </div>

            {/* Client */}
            <div className="flex items-center gap-3">
              <Avatar
                name={`${client.firstName} ${client.lastName}`}
                size="sm"
              />
              <span className="text-text">
                {client.firstName} {client.lastName}
              </span>
            </div>

            {/* Alert */}
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-500" />
              <span className="text-yellow-700">Include KM</span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-text-secondary" />
              {client.phone ? (
                <a href={`tel:${client.phone}`} className="text-primary hover:underline">
                  {client.phone}
                </a>
              ) : (
                <span className="text-text-secondary">No phone</span>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-text-secondary" />
              {client.email ? (
                <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                  {client.email}
                </a>
              ) : (
                <span className="text-text-secondary">No email</span>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                <Status color="gray" />
              </div>
              <span className="text-text-secondary">No status</span>
            </div>

            <hr className="border-border" />

            {/* Links */}
            <div className="flex items-center gap-3">
              <Link2 className="h-4 w-4 shrink-0 text-text-secondary" />
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-text">baby due date test</span>
                <Badge variant="yellow">incomplete</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link2 className="h-4 w-4 shrink-0 text-text-secondary" />
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-text">header test</span>
                <Badge variant="yellow">incomplete</Badge>
              </div>
            </div>

            <hr className="border-border" />

            {/* Create Zoom meeting */}
            <div className="flex items-center gap-3">
              <Video className="h-4 w-4 shrink-0 text-text-secondary" />
              <button className="text-primary hover:underline">Create Zoom meeting</button>
            </div>

            <hr className="border-border" />

            {/* Invoice actions */}
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 shrink-0 text-text-secondary" />
              <button className="text-primary hover:underline">Add invoice</button>
            </div>
            <div className="flex items-center gap-3 pl-7">
              <button className="text-primary hover:underline">Mark as</button>
              <span className="text-text-secondary">and</span>
              <button className="text-primary hover:underline">Do not invoice?</button>
            </div>

            <hr className="border-border" />

            {/* Test item */}
            <div className="flex items-center gap-3">
              <span className="text-text">AAA TEST</span>
              <Badge variant="green">new</Badge>
            </div>

            <hr className="border-border" />

            {/* Google integrations */}
            <div className="flex items-center gap-3">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <button className="text-primary hover:underline">View in Google</button>
            </div>

            <div className="flex items-center gap-3">
              <Video className="h-4 w-4 shrink-0 text-text-secondary" />
              <button className="text-primary hover:underline">Join with Google Meet</button>
            </div>

            <div className="flex items-center gap-3">
              <Link2 className="h-4 w-4 shrink-0 text-text-secondary" />
              <span className="truncate text-xs text-primary">https://meet.google.com/...</span>
            </div>

            <hr className="border-border" />

            {/* Note */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-text-secondary" />
                <span className="font-medium text-text">Note</span>
              </div>
              <textarea
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                rows={3}
                placeholder="Add a note..."
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t border-border p-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm">
                Book another
              </Button>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
              <Button variant="secondary" size="sm">
                Reschedule
              </Button>
              <Button variant="danger" size="sm">
                Archive
              </Button>
            </div>
            <div className="mt-3">
              <button className="text-xs text-primary hover:underline">View change log</button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
