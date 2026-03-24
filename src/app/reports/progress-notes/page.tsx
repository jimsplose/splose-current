"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  DataTable,
  DateRangeFilter,
  PageHeader,
  Stat,
  Status,
  TableBody,
  TableHead,
  Td,
  Th,
  Tr,
} from "@/components/ds";

export default function ReportsProgressNotesPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <>
      <PageHeader title="Progress notes">
        <Button>Export</Button>
        <Button>Learn about this report</Button>
      </PageHeader>

      {/* Date range */}
      <div className="mb-4">
        <label className="mb-1 flex items-center gap-1 text-body-md text-text-secondary">
          <span>&#128197;</span> Date range *
        </label>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      {/* Filter buttons */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </div>

      {showResults && (<>
      {/* Results */}
      <p className="mb-4 text-body-md text-text-secondary">2 progress notes found.</p>

      {/* Summary stats row */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="flex items-center justify-center py-4">
          <Stat value="2" label="Total notes" />
        </Card>
        <Card className="flex items-center justify-center py-4">
          <Stat value="0" label="Signed" />
        </Card>
        <Card className="flex items-center justify-center py-4">
          <Stat value="2" label="Draft" />
        </Card>
        <Card className="flex items-center justify-center py-4">
          <Stat value="1.0" label="Avg per practitioner" />
        </Card>
      </div>

      <h2 className="mb-4 text-heading-lg text-text">Summary</h2>

      {/* Summary tables and pie charts */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Note template breakdown */}
        <div>
          <Card padding="none" className="mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="px-4 py-2 text-left text-label-lg text-text">Note template</th>
                  <th className="px-4 py-2 text-right text-label-lg text-text">Number</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 text-body-md text-text">
                    <Status color="green" label="AAA TEST" />
                  </td>
                  <td className="px-4 py-2 text-right text-body-md text-text">1 (50.0%)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-body-md text-text">
                    <Status color="purple" label="Bill Gates Demo" />
                  </td>
                  <td className="px-4 py-2 text-right text-body-md text-text">1 (50.0%)</td>
                </tr>
              </tbody>
            </table>
            <div className="flex items-center justify-end border-t border-border px-4 py-2 text-body-md text-text-secondary">
              <span>&lt;</span>
              <Button variant="ghost" size="sm" className="mx-1 !h-6 !w-6 !rounded !border !border-primary !p-0 !text-xs !font-medium !text-primary">
                1
              </Button>
              <span>&gt;</span>
            </div>
          </Card>
          {/* Pie chart */}
          <div className="flex justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="#7c3aed" />
              <path d="M100,100 L100,10 A90,90 0 0,1 190,100 Z" fill="#22c55e" />
            </svg>
          </div>
        </div>

        {/* Practitioner breakdown */}
        <div>
          <Card padding="none" className="mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="px-4 py-2 text-left text-label-lg text-text">Practitioner</th>
                  <th className="px-4 py-2 text-right text-label-lg text-text">Number</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 text-body-md text-text">
                    <Status color="green" label="Ruvi R." />
                  </td>
                  <td className="px-4 py-2 text-right text-body-md text-text">1 (50.0%)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-body-md text-text">
                    <Status color="purple" label="Zoe Gomez" />
                  </td>
                  <td className="px-4 py-2 text-right text-body-md text-text">1 (50.0%)</td>
                </tr>
              </tbody>
            </table>
            <div className="flex items-center justify-end border-t border-border px-4 py-2 text-body-md text-text-secondary">
              <span>&lt;</span>
              <Button variant="ghost" size="sm" className="mx-1 !h-6 !w-6 !rounded !border !border-primary !p-0 !text-xs !font-medium !text-primary">
                1
              </Button>
              <span>&gt;</span>
            </div>
          </Card>
          {/* Pie chart */}
          <div className="flex justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="#7c3aed" />
              <path d="M100,100 L100,10 A90,90 0 0,1 190,100 Z" fill="#22c55e" />
            </svg>
          </div>
        </div>
      </div>

      {/* Progress notes list */}
      <h2 className="mb-4 text-heading-lg text-text">Progress notes list</h2>
      <DataTable>
        <TableHead>
          <Th>Title</Th>
          <Th>Client</Th>
          <Th>Related service</Th>
          <Th>Practitioner</Th>
          <Th>Location</Th>
        </TableHead>
        <TableBody>
          <Tr>
            <Td>
              <span className="text-primary">Bill Gates Demo</span>
              <Badge variant="gray" className="ml-2">Draft</Badge>
            </Td>
            <Td><span className="text-primary">Skyler Peterson</span></Td>
            <Td><span className="text-text-secondary">&mdash;</span></Td>
            <Td>Ruvi R.</Td>
            <Td><span className="text-text-secondary">&mdash;</span></Td>
          </Tr>
          <Tr>
            <Td>
              <span className="text-primary">AAA TEST</span>
              <Badge variant="gray" className="ml-2">Draft</Badge>
            </Td>
            <Td><span className="text-primary">A Del</span></Td>
            <Td><span className="text-text-secondary">&mdash;</span></Td>
            <Td>Zoe Gomez</Td>
            <Td><span className="text-text-secondary">&mdash;</span></Td>
          </Tr>
        </TableBody>
      </DataTable>
      </>)}
    </>
  );
}
