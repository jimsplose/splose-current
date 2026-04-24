"use client";

import { useState } from "react";
import { PlusOutlined, SwapOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Card, PageHeader, SearchBar, Pagination, Badge, statusVariant, Dropdown, DropdownTriggerButton, Modal, Text } from "@/components/ds";

const communicationsData = [
  {
    id: "1",
    dateTime: "10:15 am, 24 Mar 2026",
    subject: "Appointment confirmation — 25 Mar 2026",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Delivered" as const,
    link: "Appointment 25 Mar 2026 10:00 AM",
    body: "Dear Client,\n\nThis is to confirm your appointment with Hands Together Therapies on 25 Mar 2026 at 10:00 AM.\n\nPlease arrive 10 minutes early. If you need to reschedule, contact us at least 24 hours in advance.\n\nKind regards,\nHands Together Therapies",
  },
  {
    id: "2",
    dateTime: "10:15 am, 24 Mar 2026",
    subject: "",
    type: "SMS" as const,
    direction: "Outbound" as const,
    status: "Delivered" as const,
    link: "Appointment 25 Mar 2026 10:00 AM",
    body: "Hi, your appointment at Hands Together Therapies is confirmed for 25 Mar at 10:00 AM. Reply CANCEL to cancel. See you then!",
  },
  {
    id: "3",
    dateTime: "2:30 pm, 20 Mar 2026",
    subject: "Invoice #INV-0472 from Hands Together Therapies",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Opened" as const,
    link: "Invoice INV-0472",
    body: "Dear Client,\n\nPlease find attached Invoice #INV-0472 for your recent session on 19 Mar 2026.\n\nAmount due: $193.99\nPayment terms: 14 days\n\nYou can pay via bank transfer or the link below.\n\nKind regards,\nHands Together Therapies",
  },
  {
    id: "4",
    dateTime: "4:56 pm, 5 Mar 2026",
    subject: "Please complete intake form from Hands Together Therapies",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Delivered" as const,
    link: "Intake Form",
    body: "Dear Client,\n\nPlease complete the intake form from Hands Together Therapies at your earliest convenience. You can access the form using the link below.\n\nIf you have any questions, please don't hesitate to contact us.\n\nKind regards,\nHands Together Therapies",
  },
  {
    id: "5",
    dateTime: "4:55 pm, 5 Mar 2026",
    subject: "Copy of your completed form attached",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Failed" as const,
    link: "Intake Form",
    body: "Dear Client,\n\nPlease find attached a copy of your completed form for your records.\n\nKind regards,\nHands Together Therapies",
  },
  {
    id: "6",
    dateTime: "4:54 pm, 5 Mar 2026",
    subject: "DVA referral letter from Hands Together Therapies",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Delivered" as const,
    link: "Letter DVA",
    body: "Dear Client,\n\nPlease find attached your DVA referral letter from Hands Together Therapies.\n\nKind regards,\nHands Together Therapies",
  },
  {
    id: "7",
    dateTime: "9:00 am, 28 Feb 2026",
    subject: "",
    type: "Phone call" as const,
    direction: "Inbound" as const,
    status: "Delivered" as const,
    link: "",
    body: "Client called to reschedule appointment from 3 Mar to 5 Mar. Updated calendar accordingly. Client also asked about NDIS funding status — advised to check with plan manager.",
  },
  {
    id: "8",
    dateTime: "11:20 am, 25 Feb 2026",
    subject: "",
    type: "SMS" as const,
    direction: "Outbound" as const,
    status: "Failed" as const,
    link: "",
    body: "Hi, this is a reminder from Hands Together Therapies about your upcoming appointment on 26 Feb at 2:00 PM. Reply YES to confirm.",
  },
  {
    id: "9",
    dateTime: "3:39 pm, 13 Feb 2026",
    subject: "",
    type: "SMS" as const,
    direction: "Outbound" as const,
    status: "Delivered" as const,
    link: "Appointment 14 Feb 2026 12:00 PM",
    body: "Hi, this is a reminder from Hands Together Therapies. You have an appointment on 14 Feb 2026 at 12:00 PM. Reply YES to confirm or call us to reschedule.",
  },
  {
    id: "10",
    dateTime: "3:39 pm, 13 Feb 2026",
    subject: "Appointment reminder — 14 Feb 2026",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Opened" as const,
    link: "Appointment 14 Feb 2026 12:00 PM",
    body: "Dear Client,\n\nThis is a reminder about your upcoming appointment with Hands Together Therapies on 14 Feb 2026 at 12:00 PM.\n\nPlease let us know if you need to reschedule.\n\nKind regards,\nHands Together Therapies",
  },
  {
    id: "11",
    dateTime: "10:05 am, 10 Feb 2026",
    subject: "Progress report attached",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Delivered" as const,
    link: "Progress Report — Feb 2026",
    body: "Dear Client,\n\nPlease find attached your progress report summarising sessions from January to February 2026.\n\nWe recommend reviewing the goals section ahead of your next appointment.\n\nKind regards,\nHands Together Therapies",
  },
  {
    id: "12",
    dateTime: "4:12 pm, 3 Feb 2026",
    subject: "",
    type: "Phone call" as const,
    direction: "Outbound" as const,
    status: "Delivered" as const,
    link: "",
    body: "Called client to follow up on missed appointment (2 Feb). No answer — left voicemail requesting callback to reschedule.",
  },
  {
    id: "13",
    dateTime: "9:45 am, 20 Jan 2026",
    subject: "Welcome to Hands Together Therapies",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Opened" as const,
    link: "Intake Form",
    body: "Dear Client,\n\nWelcome to Hands Together Therapies! We look forward to working with you.\n\nPlease complete the attached intake form before your first appointment. You can also bring any relevant medical reports or referrals.\n\nIf you have any questions, call us on (08) 8234 5678.\n\nKind regards,\nHands Together Therapies",
  },
  {
    id: "14",
    dateTime: "2:00 pm, 15 Jan 2026",
    subject: "",
    type: "SMS" as const,
    direction: "Inbound" as const,
    status: "Delivered" as const,
    link: "",
    body: "YES confirmed for Thursday. Thank you!",
  },
];

const dropdownItems = [
  { label: "View", value: "view" },
  { label: "Resend", value: "resend" },
  { label: "Delete", value: "delete", danger: true },
];

export default function ClientCommunicationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(communicationsData.length / pageSize);
  const paged = communicationsData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const [viewModal, setViewModal] = useState<{
    open: boolean;
    subject: string;
    dateTime: string;
    type: string;
    status: string;
    body: string;
  }>({
    open: false,
    subject: "",
    dateTime: "",
    type: "",
    status: "",
    body: "",
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; commId: string; subject: string }>({
    open: false,
    commId: "",
    subject: "",
  });

  function handleAction(value: string, comm: (typeof communicationsData)[number]) {
    if (value === "view") {
      setViewModal({
        open: true,
        subject: comm.subject || `${comm.type} message`,
        dateTime: comm.dateTime,
        type: comm.type,
        status: comm.status,
        body: comm.body,
      });
    } else if (value === "resend") {
      // no-op: resend is a fire-and-forget action in the prototype
    } else if (value === "delete") {
      setDeleteModal({
        open: true,
        commId: comm.id,
        subject: comm.subject || `${comm.type} message`,
      });
    }
  }

  const columns: ColumnsType<typeof communicationsData[number]> = [
    {
      key: "dateTime",
      title: (
        <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
          Date and time <SwapOutlined style={{ fontSize: 14, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
        </Flex>
      ),
      render: (_, comm) => (
        <Flex align="center" gap={8}>
          <Button type="text" size="small" style={{ height: 20, width: 20, borderRadius: 4, border: '1px solid var(--color-border)', fontSize: 12 }}>
            +
          </Button>
          {comm.dateTime}
        </Flex>
      ),
    },
    {
      key: "subject",
      title: "Subject",
      render: (_, comm) => <Text variant="body/md" as="span" color="secondary">{comm.subject || "\u2014"}</Text>,
    },
    {
      key: "type",
      title: "Type",
      render: (_, comm) => <Text variant="body/md" as="span" color="secondary">{comm.type}</Text>,
    },
    {
      key: "direction",
      title: (
        <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
          Direction <FilterOutlined style={{ fontSize: 14, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
        </Flex>
      ),
      render: (_, comm) => (
        <Flex vertical gap={4}>
          <span style={{ color: 'var(--color-text-secondary)' }}>{comm.direction}</span>
          <Badge variant={statusVariant(comm.status)}>{comm.status}</Badge>
        </Flex>
      ),
    },
    {
      key: "link",
      title: "Links",
      render: (_, comm) =>
        comm.link ? (
          <button style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {comm.link}
          </button>
        ) : "\u2014",
    },
    {
      key: "actions",
      title: "",
      align: "right" as const,
      render: (_, comm) => (
        <Dropdown
          align="right"
          trigger={<DropdownTriggerButton />}
          items={dropdownItems}
          onSelect={(val) => handleAction(val, comm)}
        />
      ),
    },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <PageHeader title="Communications">
        <Button>
          <PlusOutlined style={{ fontSize: 14, color: 'var(--ant-color-text, #414549)' }} />
          Log communication
        </Button>
      </PageHeader>

      <SearchBar placeholder="Search for message, to and from" />

      <Card padding="none" style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={paged}
          rowKey="id"
          pagination={false}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={communicationsData.length}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
        />
      </Card>

      {/* View communication modal */}
      <Modal
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, subject: "", dateTime: "", type: "", status: "", body: "" })}
        title={viewModal.subject}
        maxWidth="lg"
        footer={
          <Button onClick={() => setViewModal({ open: false, subject: "", dateTime: "", type: "", status: "", body: "" })}>
            Close
          </Button>
        }
      >
        <Flex wrap gap={16} style={{ marginBottom: 16, color: 'var(--color-text-secondary)', fontSize: 11 }}>
          <span><strong>Date:</strong> {viewModal.dateTime}</span>
          <span><strong>Type:</strong> {viewModal.type}</span>
          <span><strong>Status:</strong> {viewModal.status}</span>
        </Flex>
        <div style={{ fontSize: 14, whiteSpace: 'pre-wrap', borderRadius: 8, backgroundColor: 'var(--color-fill-quaternary)', padding: 16 }}>
          {viewModal.body}
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, commId: "", subject: "" })}
        title="Delete communication"
        maxWidth="md"
        footer={
          <>
            <Button onClick={() => setDeleteModal({ open: false, commId: "", subject: "" })}>
              Cancel
            </Button>
            <Button danger onClick={() => setDeleteModal({ open: false, commId: "", subject: "" })}>
              Delete
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Are you sure you want to delete <strong>{deleteModal.subject}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
