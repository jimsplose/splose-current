"use client";

import { useState } from "react";
import {
  CloseOutlined,
  UserOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  WarningOutlined,
  LinkOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  PlusOutlined,
  DownOutlined,
  EllipsisOutlined,
  SwapOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Flex } from "antd";
import {
  Button,
  DataTable,
  Card,
  PageHeader,
  TableHead,
  Th,
  TableBody,
  Td,
  Pagination,
  Badge,
  Avatar,
  FormTextarea,
  Status,
  statusVariant,
  Text,
  Divider,
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

function getInvoiceStatus(appt: Appointment): "Paid" | "Draft" | "Do not invoice" {
  if (appt.status === "Cancelled") return "Do not invoice";
  if (appt.status === "Completed") {
    const hash = appt.id.split("").reduce((acc: number, ch: string) => acc + ch.charCodeAt(0), 0);
    return hash % 3 === 0 ? "Draft" : "Paid";
  }
  return "Draft";
}

export default function AppointmentSidePanel({
  appointments,
  client,
}: {
  appointments: Appointment[];
  client: ClientInfo;
}) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(appointments.length / pageSize);
  const paged = appointments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Flex style={{ flex: 1, overflow: 'hidden' }}>
      {/* Main table area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, transition: 'all 0.2s', ...(selectedAppointment ? { paddingRight: 0 } : {}) }}>
        <PageHeader title="Appointments">
          <Button>
            Send upcoming appointments
            <DownOutlined style={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
          </Button>
          <Button>
            <PlusOutlined style={{ fontSize: 16 }} />
            New appointment
          </Button>
        </PageHeader>

        <Card padding="none" style={{ overflowX: 'auto' }}>
          <DataTable>
            <TableHead>
              <Th>
                <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                  When <SwapOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
                </Flex>
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
                  <td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center' }}>
                    <Text variant="body/md" as="span" color="secondary">No appointments</Text>
                  </td>
                </tr>
              ) : (
                paged.map((appt) => {
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
                      style={{ cursor: 'pointer', ...(isSelected ? { backgroundColor: 'var(--color-primary-bg)' } : {}) }}
                      className="row-hover"
                      onClick={() => setSelectedAppointment(appt)}
                    >
                      <Td>
                        <Flex align="center" gap={8}>
                          <Status color={isUpcoming ? "green" : statusDotColor} />
                          <span>
                            {formatDate(appt.date)}, {appt.startTime}
                          </span>
                          {isUpcoming && (
                            <Badge variant="green" style={{ backgroundColor: '#22c55e', color: '#fff' }}>
                              Upcoming
                            </Badge>
                          )}
                          {appt.status === "Cancelled" && (
                            <Badge variant={statusVariant("Cancelled")}>Cancelled</Badge>
                          )}
                          {appt.status === "No Show" && <Badge variant={statusVariant(appt.status)}>{appt.status}</Badge>}
                        </Flex>
                      </Td>
                      <Td className="text-text-secondary">East Clinics</Td>
                      <Td className="text-text-secondary">{appt.type}</Td>
                      <Td className="text-text-secondary">{appt.practitioner.name}</Td>
                      <Td>
                        {invoiceStatus === "Paid" && (
                          <Badge variant="red" style={{ backgroundColor: '#ef4444', color: '#fff' }}>
                            Paid
                          </Badge>
                        )}
                        {invoiceStatus === "Draft" && (
                          <Badge variant="blue" style={{ backgroundColor: '#3b82f6', color: '#fff' }}>
                            Draft
                          </Badge>
                        )}
                        {invoiceStatus === "Do not invoice" && (
                          <Badge variant="gray" style={{ backgroundColor: '#374151', color: '#fff' }}>
                            Do not invoice
                          </Badge>
                        )}
                      </Td>
                      <Td align="right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <EllipsisOutlined style={{ fontSize: 20 }} />
                        </Button>
                      </Td>
                    </tr>
                  );
                })
              )}
            </TableBody>
          </DataTable>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={appointments.length}
            itemsPerPage={pageSize}
            onPageChange={setCurrentPage}
          />
        </Card>
      </div>

      {/* Side panel */}
      {selectedAppointment && (
        <aside style={{ width: 380, flexShrink: 0, overflowY: 'auto', borderLeft: '1px solid var(--color-border)', backgroundColor: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          {/* Header */}
          <Flex justify="space-between" align="flex-start" style={{ borderBottom: '1px solid var(--color-border)', padding: 16 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <Text variant="body/lg-strong" as="h3">
                {selectedAppointment.type}
              </Text>
              <Text variant="body/sm" color="secondary" style={{ marginTop: 2 }}>
                ({selectedAppointment.type})
              </Text>
            </div>
            <Button
              variant="icon"
              size="sm"
              onClick={() => setSelectedAppointment(null)}
              style={{ marginLeft: 8, flexShrink: 0 }}
            >
              <CloseOutlined style={{ fontSize: 20 }} />
            </Button>
          </Flex>

          {/* Details */}
          <Flex vertical gap={12} style={{ padding: 16, fontSize: 14 }}>
            {/* Practitioner at Location */}
            <Flex align="flex-start" gap={12}>
              <EnvironmentOutlined style={{ fontSize: 16, flexShrink: 0, marginTop: 2, color: 'var(--color-text-secondary)' }} />
              <span>
                {selectedAppointment.practitioner.name} at East Clinics
              </span>
            </Flex>

            {/* Practitioner */}
            <Flex align="center" gap={12}>
              <UserOutlined style={{ fontSize: 16, flexShrink: 0, color: 'var(--color-text-secondary)' }} />
              <span>{selectedAppointment.practitioner.name}</span>
            </Flex>

            {/* Time */}
            <Flex align="flex-start" gap={12}>
              <ClockCircleOutlined style={{ fontSize: 16, flexShrink: 0, marginTop: 2, color: 'var(--color-text-secondary)' }} />
              <span>
                {formatPanelDate(selectedAppointment.date, selectedAppointment.startTime)} for 60 minutes
              </span>
            </Flex>

            {/* Client */}
            <Flex align="center" gap={12}>
              <Avatar
                name={`${client.firstName} ${client.lastName}`}
                size="sm"
              />
              <span>
                {client.firstName} {client.lastName}
              </span>
            </Flex>

            {/* Alert */}
            <Flex align="center" gap={12}>
              <WarningOutlined style={{ fontSize: 16, flexShrink: 0, color: '#faad14' }} />
              <Text variant="body/md" as="span" color="warning">Include KM</Text>
            </Flex>

            {/* Phone */}
            <Flex align="center" gap={12}>
              <PhoneOutlined style={{ fontSize: 16, flexShrink: 0, color: 'var(--color-text-secondary)' }} />
              {client.phone ? (
                <Button variant="link" href={`tel:${client.phone}`}>{client.phone}</Button>
              ) : (
                <Text variant="body/md" as="span" color="secondary">No phone</Text>
              )}
            </Flex>

            {/* Email */}
            <Flex align="center" gap={12}>
              <MailOutlined style={{ fontSize: 16, flexShrink: 0, color: 'var(--color-text-secondary)' }} />
              {client.email ? (
                <Button variant="link" href={`mailto:${client.email}`}>{client.email}</Button>
              ) : (
                <Text variant="body/md" as="span" color="secondary">No email</Text>
              )}
            </Flex>

            {/* Status */}
            <Flex align="center" gap={12}>
              <Flex align="center" justify="center" style={{ height: 16, width: 16, flexShrink: 0 }}>
                <Status color="gray" />
              </Flex>
              <Text variant="body/md" as="span" color="secondary">No status</Text>
            </Flex>

            <Divider spacing="none" />

            {/* Links */}
            <Flex align="center" gap={12}>
              <LinkOutlined style={{ fontSize: 16, flexShrink: 0, color: 'var(--color-text-secondary)' }} />
              <Flex wrap align="center" gap={6}>
                <span>baby due date test</span>
                <Badge variant="yellow">incomplete</Badge>
              </Flex>
            </Flex>
            <Flex align="center" gap={12}>
              <LinkOutlined style={{ fontSize: 16, flexShrink: 0, color: 'var(--color-text-secondary)' }} />
              <Flex wrap align="center" gap={6}>
                <span>header test</span>
                <Badge variant="yellow">incomplete</Badge>
              </Flex>
            </Flex>

            <Divider spacing="none" />

            {/* Create Zoom meeting */}
            <Flex align="center" gap={12}>
              <VideoCameraOutlined style={{ fontSize: 16, flexShrink: 0, color: 'var(--color-text-secondary)' }} />
              <Button variant="link">Create Zoom meeting</Button>
            </Flex>

            <Divider spacing="none" />

            {/* Invoice actions */}
            <Flex align="center" gap={12}>
              <FileTextOutlined style={{ fontSize: 16, flexShrink: 0, color: 'var(--color-text-secondary)' }} />
              <Button variant="link">Add invoice</Button>
            </Flex>
            <Flex align="center" gap={12} style={{ paddingLeft: 28 }}>
              <Button variant="link">Mark as</Button>
              <Text variant="body/md" as="span" color="secondary">and</Text>
              <Button variant="link">Do not invoice?</Button>
            </Flex>

            <Divider spacing="none" />

            {/* Test item */}
            <Flex align="center" gap={12}>
              <span>AAA TEST</span>
              <Badge variant="green">new</Badge>
            </Flex>

            <Divider spacing="none" />

            {/* Google integrations */}
            <Flex align="center" gap={12}>
              <svg style={{ height: 16, width: 16, flexShrink: 0 }} viewBox="0 0 24 24" fill="none">
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
              <Button variant="link">View in Google</Button>
            </Flex>

            <Flex align="center" gap={12}>
              <VideoCameraOutlined style={{ fontSize: 16, flexShrink: 0, color: 'var(--color-text-secondary)' }} />
              <Button variant="link">Join with Google Meet</Button>
            </Flex>

            <Flex align="center" gap={12}>
              <LinkOutlined style={{ fontSize: 16, flexShrink: 0, color: 'var(--color-text-secondary)' }} />
              <Text variant="body/sm" as="span" color="primary" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>https://meet.google.com/...</Text>
            </Flex>

            <Divider spacing="none" />

            {/* Note */}
            <div>
              <Flex align="center" gap={8} style={{ marginBottom: 8 }}>
                <FileTextOutlined style={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
                <Text variant="label/lg" as="span">Note</Text>
              </Flex>
              <FormTextarea
                rows={3}
                placeholder="Add a note..."
                style={{ fontSize: 14 }}
              />
            </div>
          </Flex>

          {/* Action buttons */}
          <Divider spacing="none" />
          <div style={{ padding: 16 }}>
            <Flex wrap gap={8}>
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
            </Flex>
            <div style={{ marginTop: 12 }}>
              <Button variant="link" size="sm">View change log</Button>
            </div>
          </div>
        </aside>
      )}
    </Flex>
  );
}
