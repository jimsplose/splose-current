"use client";

import { useState } from "react";
import { Flex } from "antd";
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
      <div style={{ marginBottom: 16 }}>
        <Flex align="center" gap={4} className="text-body-md" style={{ marginBottom: 4, color: 'var(--ant-color-text-secondary)' }}>
          <span>&#128197;</span> Date range *
        </Flex>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      {/* Filter buttons */}
      <Flex wrap="wrap" align="center" gap={8} style={{ marginBottom: 24 }}>
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </Flex>

      {showResults && (<>
      {/* Results */}
      <p className="text-body-md" style={{ marginBottom: 16, color: 'var(--ant-color-text-secondary)' }}>2 progress notes found.</p>

      {/* Summary stats row */}
      <div style={{ marginBottom: 24, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 16, paddingBottom: 16 }}>
          <Stat value="2" label="Total notes" />
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 16, paddingBottom: 16 }}>
          <Stat value="0" label="Signed" />
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 16, paddingBottom: 16 }}>
          <Stat value="2" label="Draft" />
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 16, paddingBottom: 16 }}>
          <Stat value="1.0" label="Avg per practitioner" />
        </Card>
      </div>

      <h2 className="text-heading-lg" style={{ marginBottom: 16, color: 'var(--ant-color-text)' }}>Summary</h2>

      {/* Summary tables and pie charts */}
      <div style={{ marginBottom: 32, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
        {/* Note template breakdown */}
        <div>
          <Card padding="none" style={{ marginBottom: 16 }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--ant-color-border)', backgroundColor: '#f9fafb' }}>
                  <th className="text-label-lg" style={{ padding: '8px 16px', textAlign: 'left', color: 'var(--ant-color-text)' }}>Note template</th>
                  <th className="text-label-lg" style={{ padding: '8px 16px', textAlign: 'right', color: 'var(--ant-color-text)' }}>Number</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--ant-color-border)' }}>
                  <td className="text-body-md" style={{ padding: '8px 16px', color: 'var(--ant-color-text)' }}>
                    <Status color="green" label="AAA TEST" />
                  </td>
                  <td className="text-body-md" style={{ padding: '8px 16px', textAlign: 'right', color: 'var(--ant-color-text)' }}>1 (50.0%)</td>
                </tr>
                <tr>
                  <td className="text-body-md" style={{ padding: '8px 16px', color: 'var(--ant-color-text)' }}>
                    <Status color="purple" label="Bill Gates Demo" />
                  </td>
                  <td className="text-body-md" style={{ padding: '8px 16px', textAlign: 'right', color: 'var(--ant-color-text)' }}>1 (50.0%)</td>
                </tr>
              </tbody>
            </table>
            <Flex align="center" justify="flex-end" className="text-body-md" style={{ borderTop: '1px solid var(--ant-color-border)', padding: '8px 16px', color: 'var(--ant-color-text-secondary)' }}>
              <span>&lt;</span>
              <Button variant="ghost" size="sm" className="mx-1 !h-6 !w-6 !rounded !border !border-primary !p-0 !text-xs !font-medium !text-primary">
                1
              </Button>
              <span>&gt;</span>
            </Flex>
          </Card>
          {/* Pie chart */}
          <Flex justify="center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="#7c3aed" />
              <path d="M100,100 L100,10 A90,90 0 0,1 190,100 Z" fill="#22c55e" />
            </svg>
          </Flex>
        </div>

        {/* Practitioner breakdown */}
        <div>
          <Card padding="none" style={{ marginBottom: 16 }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--ant-color-border)', backgroundColor: '#f9fafb' }}>
                  <th className="text-label-lg" style={{ padding: '8px 16px', textAlign: 'left', color: 'var(--ant-color-text)' }}>Practitioner</th>
                  <th className="text-label-lg" style={{ padding: '8px 16px', textAlign: 'right', color: 'var(--ant-color-text)' }}>Number</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--ant-color-border)' }}>
                  <td className="text-body-md" style={{ padding: '8px 16px', color: 'var(--ant-color-text)' }}>
                    <Status color="green" label="Ruvi R." />
                  </td>
                  <td className="text-body-md" style={{ padding: '8px 16px', textAlign: 'right', color: 'var(--ant-color-text)' }}>1 (50.0%)</td>
                </tr>
                <tr>
                  <td className="text-body-md" style={{ padding: '8px 16px', color: 'var(--ant-color-text)' }}>
                    <Status color="purple" label="Zoe Gomez" />
                  </td>
                  <td className="text-body-md" style={{ padding: '8px 16px', textAlign: 'right', color: 'var(--ant-color-text)' }}>1 (50.0%)</td>
                </tr>
              </tbody>
            </table>
            <Flex align="center" justify="flex-end" className="text-body-md" style={{ borderTop: '1px solid var(--ant-color-border)', padding: '8px 16px', color: 'var(--ant-color-text-secondary)' }}>
              <span>&lt;</span>
              <Button variant="ghost" size="sm" className="mx-1 !h-6 !w-6 !rounded !border !border-primary !p-0 !text-xs !font-medium !text-primary">
                1
              </Button>
              <span>&gt;</span>
            </Flex>
          </Card>
          {/* Pie chart */}
          <Flex justify="center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="#7c3aed" />
              <path d="M100,100 L100,10 A90,90 0 0,1 190,100 Z" fill="#22c55e" />
            </svg>
          </Flex>
        </div>
      </div>

      {/* Progress notes list */}
      <h2 className="text-heading-lg" style={{ marginBottom: 16, color: 'var(--ant-color-text)' }}>Progress notes list</h2>
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
              <span style={{ color: 'var(--ant-color-primary)' }}>Bill Gates Demo</span>
              <Badge variant="gray" style={{ marginLeft: 8 }}>Draft</Badge>
            </Td>
            <Td><span style={{ color: 'var(--ant-color-primary)' }}>Skyler Peterson</span></Td>
            <Td><span style={{ color: 'var(--ant-color-text-secondary)' }}>&mdash;</span></Td>
            <Td>Ruvi R.</Td>
            <Td><span style={{ color: 'var(--ant-color-text-secondary)' }}>&mdash;</span></Td>
          </Tr>
          <Tr>
            <Td>
              <span style={{ color: 'var(--ant-color-primary)' }}>AAA TEST</span>
              <Badge variant="gray" style={{ marginLeft: 8 }}>Draft</Badge>
            </Td>
            <Td><span style={{ color: 'var(--ant-color-primary)' }}>A Del</span></Td>
            <Td><span style={{ color: 'var(--ant-color-text-secondary)' }}>&mdash;</span></Td>
            <Td>Zoe Gomez</Td>
            <Td><span style={{ color: 'var(--ant-color-text-secondary)' }}>&mdash;</span></Td>
          </Tr>
        </TableBody>
      </DataTable>
      </>)}
    </>
  );
}
