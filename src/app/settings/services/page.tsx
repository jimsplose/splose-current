"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flex } from "antd";
import { SwapOutlined, ReadOutlined } from "@ant-design/icons";
import {
  Button,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Pagination,
  SearchBar,
  Dropdown,
  DropdownTriggerButton,
  PageHeader,
} from "@/components/ds";

interface Service {
  id: number;
  name: string;
  type: string;
  itemCode: string;
  duration: string;
  price: string;
  rate: string;
  color: string;
}

const services: Service[] = [
  { id: 1, name: "1:1 Consultation", type: "1:1 Consultation", itemCode: "299sdsdds3234", duration: "40 minutes", price: "193.00", rate: "Hour", color: "#22c55e" },
  { id: 2, name: "1x Initial 1:1 Assessment, 14 x Group Therapy Sessions, and 1x Review Session", type: "Group Package Deal", itemCode: "", duration: "60 minutes", price: "1000.00", rate: "Each", color: "#a855f7" },
  { id: 3, name: "2:2 Consultations", type: "2:2 Consultations", itemCode: "2997952838_61 627l_abc", duration: "60 minutes", price: "193.99", rate: "Hour", color: "#eab308" },
  { id: 4, name: "2. Payment optional - partial - Online booking", type: "1. Payment test - Online booking", itemCode: "sd", duration: "30 minutes", price: "200.00", rate: "Hour", color: "#9ca3af" },
  { id: 5, name: "3 cases services", type: "3 cases service", itemCode: "", duration: "45 minutes", price: "120.00", rate: "Hour", color: "#22c55e" },
  { id: 6, name: "3. Payment required - partial - Online booking", type: "1. Payment test - Online booking", itemCode: "", duration: "30 minutes", price: "200.00", rate: "Hour", color: "#9ca3af" },
  { id: 7, name: "4. Payment required - full - Online booking", type: "1. Payment test - Online booking", itemCode: "", duration: "30 minutes", price: "200.00", rate: "Hour", color: "#9ca3af" },
  { id: 8, name: "Assessment", type: "1:1 Consultation", itemCode: "93", duration: "60 minutes", price: "224.60", rate: "Hour", color: "#22c55e" },
  { id: 9, name: "Initial Consultation", type: "1:1 Consultation", itemCode: "93", duration: "60 minutes", price: "224.60", rate: "Hour", color: "#22c55e" },
  { id: 10, name: "Standard Consultation", type: "1:1 Consultation", itemCode: "93", duration: "30 minutes", price: "112.30", rate: "Hour", color: "#22c55e" },
  { id: 11, name: "Extended Consultation", type: "1:1 Consultation", itemCode: "93", duration: "45 minutes", price: "168.45", rate: "Hour", color: "#22c55e" },
  { id: 12, name: "Review Appointment", type: "1:1 Consultation", itemCode: "93", duration: "20 minutes", price: "84.00", rate: "Hour", color: "#3b82f6" },
  { id: 13, name: "Telehealth Consultation", type: "1:1 Consultation", itemCode: "93", duration: "30 minutes", price: "112.30", rate: "Hour", color: "#22c55e" },
  { id: 14, name: "Group Session", type: "Group", itemCode: "93", duration: "60 minutes", price: "65.00", rate: "Hour", color: "#f97316" },
  { id: 15, name: "Home Visit", type: "1:1 Consultation", itemCode: "93", duration: "60 minutes", price: "280.00", rate: "Hour", color: "#22c55e" },
  { id: 16, name: "NDIS Initial Assessment", type: "1:1 Consultation", itemCode: "93", duration: "90 minutes", price: "336.90", rate: "Hour", color: "#22c55e" },
  { id: 17, name: "NDIS Standard Session", type: "1:1 Consultation", itemCode: "93", duration: "60 minutes", price: "224.60", rate: "Hour", color: "#22c55e" },
  { id: 18, name: "Report Writing", type: "1:1 Consultation", itemCode: "93", duration: "60 minutes", price: "224.60", rate: "Hour", color: "#22c55e" },
  { id: 19, name: "Case Conference", type: "1:1 Consultation", itemCode: "93", duration: "30 minutes", price: "112.30", rate: "Hour", color: "#22c55e" },
  { id: 20, name: "Supervision Session", type: "1:1 Consultation", itemCode: "93", duration: "60 minutes", price: "150.00", rate: "Hour", color: "#22c55e" },
];

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Enable online booking", value: "online-booking" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
];

export default function SettingsServicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = searchQuery
    ? services.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.itemCode.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : services;

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredServices.length / pageSize);
  const pageServices = filteredServices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      {/* Header */}
      <PageHeader title="Services">
        <Button variant="secondary">
          <ReadOutlined style={{ fontSize: 16, marginRight: 6 }} />
          Learn
        </Button>
        <Button variant="secondary">Show archived</Button>
        <Button variant="secondary">+ New service</Button>
      </PageHeader>

      {/* Search */}
      <SearchBar
        placeholder="Search for service name, type, and item code"
        onSearch={(q) => {
          setSearchQuery(q);
        }}
      />

      {/* Table */}
      <DataTable>
        <TableHead>
          <Th>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Name
              <SwapOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
            </span>
          </Th>
          <Th>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Type
              <SwapOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
            </span>
          </Th>
          <Th>Item code</Th>
          <Th>Duration</Th>
          <Th align="right">Price</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {pageServices.map((service) => (
            <Tr key={service.id}>
              <Td>
                <Flex align="center" gap={8}>
                  <span style={{ display: 'inline-block', height: 10, width: 10, flexShrink: 0, borderRadius: '50%', backgroundColor: service.color }} />
                  <span style={{ fontWeight: 500 }}>{service.name}</span>
                </Flex>
              </Td>
              <Td>{service.type}</Td>
              <Td>{service.itemCode}</Td>
              <Td>{service.duration}</Td>
              <Td align="right">
                {service.price} / {service.rate}
              </Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={dropdownItems}
                  onSelect={(value) => {
                    if (value === "edit") {
                      router.push(`/settings/services/edit/${service.id}`);
                    }
                  }}
                />
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredServices.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} />
    </div>
  );
}
