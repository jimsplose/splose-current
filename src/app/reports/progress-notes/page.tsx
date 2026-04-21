"use client";

import { useState } from "react";
import { Flex } from "antd";
import {
  Badge,
  Button,
  Card,
  DataTable,
  DateRangeFilter,
  Divider,
  Grid,
  ListPage,
  Stat,
  ColorDot,
  TableBody,
  TableHead,
  Td,
  Text,
  Th,
  Tr,
} from "@/components/ds";

export default function ReportsProgressNotesPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <ListPage
      title="Progress notes"
      actions={<><Button>Export</Button><Button>Learn about this report</Button></>}
      cardWrap={false}
    >
      {/* Date range */}
      <div style={{ marginBottom: 16 }}>
        <Text variant="body/md" as="div" color="secondary" style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>&#128197;</span> Date range *
        </Text>
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
      <Text variant="body/md" color="secondary" style={{ marginBottom: 16 }}>2 progress notes found.</Text>

      {/* Summary stats row */}
      <Grid cols={4} gap="md" style={{ marginBottom: 24 }}>
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
      </Grid>

      <Text variant="heading/lg" style={{ marginBottom: 16 }}>Summary</Text>

      {/* Summary tables and pie charts */}
      <Grid cols={2} gap="lg" style={{ marginBottom: 32 }}>
        {/* Note template breakdown */}
        <div>
          <Card padding="none" style={{ marginBottom: 16 }}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-fill-tertiary">
                  <th className="p-2 px-4 text-left"><Text variant="label/lg" as="span">Note template</Text></th>
                  <th className="p-2 px-4 text-right"><Text variant="label/lg" as="span">Number</Text></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 px-4">
                    <ColorDot color="green" label="AAA TEST" />
                  </td>
                  <td className="p-2 px-4 text-right"><Text variant="body/md" as="span">1 (50.0%)</Text></td>
                </tr>
                <tr>
                  <td className="p-2 px-4">
                    <ColorDot color="purple" label="Bill Gates Demo" />
                  </td>
                  <td className="p-2 px-4 text-right"><Text variant="body/md" as="span">1 (50.0%)</Text></td>
                </tr>
              </tbody>
            </table>
            <Flex align="center" justify="flex-end" style={{ borderTop: '1px solid var(--color-border)', padding: '8px 16px' }}>
              <Text variant="body/md" as="span" color="secondary">&lt;</Text>
              <Button variant="ghost" size="sm" style={{ marginLeft: 4, marginRight: 4, height: 24, width: 24, borderRadius: 4, border: '1px solid var(--color-primary)', padding: 0, fontSize: 11, fontWeight: 500, color: 'var(--color-primary)' }}>
                1
              </Button>
              <Text variant="body/md" as="span" color="secondary">&gt;</Text>
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-fill-tertiary">
                  <th className="p-2 px-4 text-left"><Text variant="label/lg" as="span">Practitioner</Text></th>
                  <th className="p-2 px-4 text-right"><Text variant="label/lg" as="span">Number</Text></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 px-4">
                    <ColorDot color="green" label="Ruvi R." />
                  </td>
                  <td className="p-2 px-4 text-right"><Text variant="body/md" as="span">1 (50.0%)</Text></td>
                </tr>
                <tr>
                  <td className="p-2 px-4">
                    <ColorDot color="purple" label="Zoe Gomez" />
                  </td>
                  <td className="p-2 px-4 text-right"><Text variant="body/md" as="span">1 (50.0%)</Text></td>
                </tr>
              </tbody>
            </table>
            <Flex align="center" justify="flex-end" style={{ borderTop: '1px solid var(--color-border)', padding: '8px 16px' }}>
              <Text variant="body/md" as="span" color="secondary">&lt;</Text>
              <Button variant="ghost" size="sm" style={{ marginLeft: 4, marginRight: 4, height: 24, width: 24, borderRadius: 4, border: '1px solid var(--color-primary)', padding: 0, fontSize: 11, fontWeight: 500, color: 'var(--color-primary)' }}>
                1
              </Button>
              <Text variant="body/md" as="span" color="secondary">&gt;</Text>
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
      </Grid>

      {/* Progress notes list */}
      <Text variant="heading/lg" style={{ marginBottom: 16 }}>Progress notes list</Text>
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
              <Text variant="body/md" as="span" color="primary">Bill Gates Demo</Text>
              <Badge variant="gray" style={{ marginLeft: 8 }}>Draft</Badge>
            </Td>
            <Td><Text variant="body/md" as="span" color="primary">Skyler Peterson</Text></Td>
            <Td><Text variant="body/md" as="span" color="secondary">&mdash;</Text></Td>
            <Td>Ruvi R.</Td>
            <Td><Text variant="body/md" as="span" color="secondary">&mdash;</Text></Td>
          </Tr>
          <Tr>
            <Td>
              <Text variant="body/md" as="span" color="primary">AAA TEST</Text>
              <Badge variant="gray" style={{ marginLeft: 8 }}>Draft</Badge>
            </Td>
            <Td><Text variant="body/md" as="span" color="primary">A Del</Text></Td>
            <Td><Text variant="body/md" as="span" color="secondary">&mdash;</Text></Td>
            <Td>Zoe Gomez</Td>
            <Td><Text variant="body/md" as="span" color="secondary">&mdash;</Text></Td>
          </Tr>
        </TableBody>
      </DataTable>
      </>)}
    </ListPage>
  );
}
