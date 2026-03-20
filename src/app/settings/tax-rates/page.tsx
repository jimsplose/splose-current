"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Button,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Badge,
  Pagination,
} from "@/components/ds";

interface TaxRate {
  id: number;
  name: string;
  rate: string;
  description: string;
  status: string;
}

const taxRates: TaxRate[] = [
  { id: 1, name: "GST", rate: "10%", description: "Goods and Services Tax", status: "Active" },
  { id: 2, name: "No tax", rate: "0%", description: "No tax applied", status: "Active" },
  { id: 3, name: "GST Free", rate: "0%", description: "GST Free supply", status: "Active" },
];

const ITEMS_PER_PAGE = 10;

export default function TaxRatesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(taxRates.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = taxRates.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Tax rates</h1>
        <Button variant="primary">+ New tax rate</Button>
      </div>

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Rate</Th>
          <Th>Description</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </TableHead>
        <TableBody>
          {pageItems.map((rate) => (
            <tr key={rate.id} className="hover:bg-gray-50">
              <Td>
                <span className="font-medium text-text">{rate.name}</span>
              </Td>
              <Td>{rate.rate}</Td>
              <Td>{rate.description}</Td>
              <Td>
                <Badge variant="green">{rate.status}</Badge>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <button className="rounded p-1.5 text-text-secondary hover:bg-gray-100 hover:text-primary">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button className="rounded p-1.5 text-text-secondary hover:bg-gray-100 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={taxRates.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
