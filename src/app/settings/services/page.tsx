"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Pagination,
  Dropdown,
} from "@/components/ds";

const sidebarSections = [
  {
    title: "Workspace",
    items: [
      { name: "Details", href: "/settings" },
      { name: "Integrations", href: "/settings" },
      { name: "Subscription", href: "/settings" },
      { name: "SMS settings", href: "/settings" },
    ],
  },
  {
    title: "Automation",
    items: [
      { name: "Forms", href: "/settings" },
      { name: "splose AI", href: "/settings/ai" },
    ],
  },
  {
    title: "Business",
    items: [
      { name: "Locations", href: "/settings" },
      { name: "Custom fields", href: "/settings" },
      { name: "Rooms/Resources", href: "/settings" },
      { name: "Services", href: "/settings/services" },
      { name: "Busy times", href: "/settings" },
      { name: "Cancel/Reschedule", href: "/settings" },
      { name: "Online bookings", href: "/settings", badge: "New" },
      { name: "Communication types", href: "/settings" },
      { name: "Tags", href: "/settings" },
      { name: "Referral types", href: "/settings" },
    ],
  },
  {
    title: "Team",
    items: [
      { name: "Users", href: "/settings" },
      { name: "User groups", href: "/settings" },
      { name: "Permissions & Roles", href: "/settings" },
      { name: "Security", href: "/settings" },
    ],
  },
  {
    title: "Templates",
    items: [
      { name: "Appointments", href: "/settings" },
      { name: "Emails", href: "/settings" },
      { name: "Progress notes", href: "/settings" },
      { name: "Letters", href: "/settings" },
      { name: "Body charts", href: "/settings" },
    ],
  },
];

interface Service {
  id: number;
  name: string;
  itemCode: string;
  duration: string;
  price: string;
}

const services: Service[] = [
  { id: 1, name: "Assessment", itemCode: "93", duration: "60 min", price: "$224.60" },
  { id: 2, name: "Initial Consultation", itemCode: "93", duration: "60 min", price: "$224.60" },
  { id: 3, name: "Standard Consultation", itemCode: "93", duration: "30 min", price: "$112.30" },
  { id: 4, name: "Extended Consultation", itemCode: "93", duration: "45 min", price: "$168.45" },
  { id: 5, name: "Review Appointment", itemCode: "93", duration: "20 min", price: "$84.00" },
  { id: 6, name: "Telehealth Consultation", itemCode: "93", duration: "30 min", price: "$112.30" },
  { id: 7, name: "Group Session", itemCode: "93", duration: "60 min", price: "$65.00" },
  { id: 8, name: "Home Visit", itemCode: "93", duration: "60 min", price: "$280.00" },
  { id: 9, name: "NDIS Initial Assessment", itemCode: "93", duration: "90 min", price: "$336.90" },
  { id: 10, name: "NDIS Standard Session", itemCode: "93", duration: "60 min", price: "$224.60" },
  { id: 11, name: "Report Writing", itemCode: "93", duration: "60 min", price: "$224.60" },
  { id: 12, name: "Case Conference", itemCode: "93", duration: "30 min", price: "$112.30" },
  { id: 13, name: "Supervision Session", itemCode: "93", duration: "60 min", price: "$150.00" },
  { id: 14, name: "Court Report", itemCode: "93", duration: "120 min", price: "$450.00" },
  { id: 15, name: "School Visit", itemCode: "93", duration: "60 min", price: "$280.00" },
  { id: 16, name: "Cancellation Fee", itemCode: "93", duration: "0 min", price: "$112.30" },
  { id: 17, name: "DNA Fee", itemCode: "93", duration: "0 min", price: "$112.30" },
  { id: 18, name: "EPC Initial Consultation", itemCode: "10960", duration: "60 min", price: "$93.00" },
  { id: 19, name: "EPC Standard Consultation", itemCode: "10960", duration: "30 min", price: "$60.85" },
  { id: 20, name: "WorkCover Assessment", itemCode: "93", duration: "60 min", price: "$224.60" },
];

const ITEMS_PER_PAGE = 10;

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Enable online booking", value: "online-booking" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
];

export default function SettingsServicesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageServices = services.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      {/* Left sidebar */}
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-border bg-white p-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-4">
            <h3 className="mb-1 text-xs font-bold tracking-wider text-text uppercase">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`block w-full rounded px-3 py-1.5 text-left text-sm transition-colors hover:bg-purple-50 hover:text-primary ${
                      item.name === "Services"
                        ? "border-l-2 border-primary bg-purple-50 font-medium text-primary"
                        : "text-text-secondary"
                    }`}
                  >
                    {item.name}
                    {"badge" in item && item.badge && (
                      <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Services</h1>
          <Button variant="primary">+ Add service</Button>
        </div>

        {/* Table */}
        <DataTable>
          <TableHead>
            <Th>Name</Th>
            <Th>Item code</Th>
            <Th>Duration</Th>
            <Th align="right">Price</Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
            {pageServices.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <Td>
                  <span className="font-medium text-text">{service.name}</span>
                </Td>
                <Td>{service.itemCode}</Td>
                <Td>{service.duration}</Td>
                <Td align="right">{service.price}</Td>
                <Td align="right">
                  <Dropdown
                    align="right"
                    trigger={
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100">
                        <svg
                          className="h-4 w-4 text-text-secondary"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <circle cx="8" cy="3" r="1.5" />
                          <circle cx="8" cy="8" r="1.5" />
                          <circle cx="8" cy="13" r="1.5" />
                        </svg>
                      </button>
                    }
                    items={dropdownItems}
                    onSelect={() => {}}
                  />
                </Td>
              </tr>
            ))}
          </TableBody>
        </DataTable>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={services.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
