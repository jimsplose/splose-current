"use client";

import { useState } from "react";
import {
  Button,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Pagination,
  SearchBar,
  Dropdown,
  DropdownTriggerButton,
} from "@/components/ds";
import { ArrowUpDown, BookOpen } from "lucide-react";

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
  {
    id: 1,
    name: "1:1 Consultation",
    type: "1:1 Consultation",
    itemCode: "299sdsdds3234",
    duration: "40 minutes",
    price: "193.00",
    rate: "Hour",
    color: "bg-green-500",
  },
  {
    id: 2,
    name: "1x Initial 1:1 Assessment, 14 x Group Therapy Sessions, and 1x Review Session",
    type: "Group Package Deal",
    itemCode: "",
    duration: "60 minutes",
    price: "1000.00",
    rate: "Each",
    color: "bg-purple-500",
  },
  {
    id: 3,
    name: "2:2 Consultations",
    type: "2:2 Consultations",
    itemCode: "2997952838_61 627l_abc",
    duration: "60 minutes",
    price: "193.99",
    rate: "Hour",
    color: "bg-yellow-500",
  },
  {
    id: 4,
    name: "2. Payment optional - partial - Online booking",
    type: "1. Payment test - Online booking",
    itemCode: "sd",
    duration: "30 minutes",
    price: "200.00",
    rate: "Hour",
    color: "bg-gray-400",
  },
  {
    id: 5,
    name: "3 cases services",
    type: "3 cases service",
    itemCode: "",
    duration: "45 minutes",
    price: "120.00",
    rate: "Hour",
    color: "bg-green-500",
  },
  {
    id: 6,
    name: "3. Payment required - partial - Online booking",
    type: "1. Payment test - Online booking",
    itemCode: "",
    duration: "30 minutes",
    price: "200.00",
    rate: "Hour",
    color: "bg-gray-400",
  },
  {
    id: 7,
    name: "4. Payment required - full - Online booking",
    type: "1. Payment test - Online booking",
    itemCode: "",
    duration: "30 minutes",
    price: "200.00",
    rate: "Hour",
    color: "bg-gray-400",
  },
  {
    id: 8,
    name: "Assessment",
    type: "1:1 Consultation",
    itemCode: "93",
    duration: "60 minutes",
    price: "224.60",
    rate: "Hour",
    color: "bg-green-500",
  },
  {
    id: 9,
    name: "Initial Consultation",
    type: "1:1 Consultation",
    itemCode: "93",
    duration: "60 minutes",
    price: "224.60",
    rate: "Hour",
    color: "bg-green-500",
  },
  {
    id: 10,
    name: "Standard Consultation",
    type: "1:1 Consultation",
    itemCode: "93",
    duration: "30 minutes",
    price: "112.30",
    rate: "Hour",
    color: "bg-green-500",
  },
  {
    id: 11,
    name: "Extended Consultation",
    type: "1:1 Consultation",
    itemCode: "93",
    duration: "45 minutes",
    price: "168.45",
    rate: "Hour",
    color: "bg-green-500",
  },
  {
    id: 12,
    name: "Review Appointment",
    type: "1:1 Consultation",
    itemCode: "93",
    duration: "20 minutes",
    price: "84.00",
    rate: "Hour",
    color: "bg-blue-500",
  },
  {
    id: 13,
    name: "Telehealth Consultation",
    type: "1:1 Consultation",
    itemCode: "93",
    duration: "30 minutes",
    price: "112.30",
    rate: "Hour",
    color: "bg-green-500",
  },
  {
    id: 14,
    name: "Group Session",
    type: "Group",
    itemCode: "93",
    duration: "60 minutes",
    price: "65.00",
    rate: "Hour",
    color: "bg-orange-500",
  },
  {
    id: 15,
    name: "Home Visit",
    type: "1:1 Consultation",
    itemCode: "93",
    duration: "60 minutes",
    price: "280.00",
    rate: "Hour",
    color: "bg-green-500",
  },
  {
    id: 16,
    name: "NDIS Initial Assessment",
    type: "1:1 Consultation",
    itemCode: "93",
    duration: "90 minutes",
    price: "336.90",
    rate: "Hour",
    color: "bg-green-500",
  },
  {
    id: 17,
    name: "NDIS Standard Session",
    type: "1:1 Consultation",
    itemCode: "93",
    duration: "60 minutes",
    price: "224.60",
    rate: "Hour",
    color: "bg-green-500",
  },
  {
    id: 18,
    name: "Report Writing",
    type: "1:1 Consultation",
    itemCode: "93",
    duration: "60 minutes",
    price: "224.60",
    rate: "Hour",
    color: "bg-green-500",
  },
  {
    id: 19,
    name: "Case Conference",
    type: "1:1 Consultation",
    itemCode: "93",
    duration: "30 minutes",
    price: "112.30",
    rate: "Hour",
    color: "bg-green-500",
  },
  {
    id: 20,
    name: "Supervision Session",
    type: "1:1 Consultation",
    itemCode: "93",
    duration: "60 minutes",
    price: "150.00",
    rate: "Hour",
    color: "bg-green-500",
  },
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = searchQuery
    ? services.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.itemCode.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : services;

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageServices = filteredServices.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-display-lg text-text">Services</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <BookOpen className="mr-1.5 h-4 w-4" />
            Learn
          </Button>
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary">+ New service</Button>
        </div>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search for service name, type, and item code"
        onSearch={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
      />

      {/* Table */}
      <DataTable>
        <TableHead>
          <Th>
            <span className="inline-flex items-center gap-1">
              Name
              <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
            </span>
          </Th>
          <Th>
            <span className="inline-flex items-center gap-1">
              Type
              <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
            </span>
          </Th>
          <Th>Item code</Th>
          <Th>Duration</Th>
          <Th align="right">Price</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {pageServices.map((service) => (
            <tr key={service.id} className="hover:bg-gray-50">
              <Td>
                <span className="flex items-center gap-2">
                  <span className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${service.color}`} />
                  <span className="font-medium text-text">{service.name}</span>
                </span>
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
        totalItems={filteredServices.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
