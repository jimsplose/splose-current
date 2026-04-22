"use client";

import { useState } from "react";
import { Flex } from "antd";
import {
  Button,
  Card,
  DateRangeFilter,
  FormSelect,
  ListPage,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Grid,
  Text,
} from "@/components/ds";

const agingSummary = [
  { label: "Current", amount: "$2,450.00", color: "#16a34a" },
  { label: "30 days", amount: "$1,200.00", color: "#ca8a04" },
  { label: "60 days", amount: "$800.00", color: "#ea580c" },
  { label: "90+ days", amount: "$350.00", color: "#dc2626" },
];

const mockDebtorRows = [
  { client: "James O'Brien", invoice: "INV-1042", amount: "$220.00", outstanding: "$220.00", dueDate: "22/03/2026", daysOverdue: 0 },
  { client: "Sarah Mitchell", invoice: "INV-1038", amount: "$360.00", outstanding: "$180.00", dueDate: "18/03/2026", daysOverdue: 6 },
  { client: "Lucas Brown", invoice: "INV-1031", amount: "$165.00", outstanding: "$165.00", dueDate: "10/03/2026", daysOverdue: 14 },
  { client: "Olivia Parker", invoice: "INV-1024", amount: "$280.00", outstanding: "$280.00", dueDate: "22/02/2026", daysOverdue: 30 },
  { client: "Noah Williams", invoice: "INV-1019", amount: "$390.00", outstanding: "$390.00", dueDate: "15/02/2026", daysOverdue: 37 },
  { client: "Emma Chen", invoice: "INV-1012", amount: "$440.00", outstanding: "$440.00", dueDate: "20/01/2026", daysOverdue: 63 },
  { client: "Ava Thompson", invoice: "INV-1005", amount: "$195.00", outstanding: "$195.00", dueDate: "05/01/2026", daysOverdue: 78 },
  { client: "Liam Nguyen", invoice: "INV-0998", amount: "$350.00", outstanding: "$350.00", dueDate: "15/12/2025", daysOverdue: 99 },
];

export default function ReportsAgedDebtorsPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <ListPage
      title="Aged debtors"
      actions={<><Button>Export</Button><Button>Learn about this report</Button></>}
      cardWrap={false}
    >
      <Flex wrap="wrap" align="flex-start" gap={16} style={{ marginBottom: 16 }}>
        <div>
          <Flex align="center" gap={4} style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
            Date range *
          </Flex>
          <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
        </div>
        <div style={{ width: 192 }}>
          <FormSelect
            label="Ageing by *"
            options={[
              { value: "invoice-date", label: "Invoice date" },
              { value: "due-date", label: "Due date" },
            ]}
            required
          />
        </div>
      </Flex>

      <Flex wrap="wrap" align="center" gap={8} style={{ marginBottom: 32 }}>
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </Flex>

      {showResults && (
        <>
          <Grid cols={4} gap={12} style={{ marginBottom: 16 }}>
            {agingSummary.map((item) => (
              <Card key={item.label}>
                <Text variant="label/md" as="p" color="secondary">{item.label}</Text>
                <Text variant="heading/lg" as="p" style={{ marginTop: 4, color: item.color }}>{item.amount}</Text>
              </Card>
            ))}
          </Grid>

          <Card padding="none" style={{ overflowX: 'auto' }}>
            <DataTable>
              <TableHead>
                <Th>Client</Th>
                <Th>Invoice #</Th>
                <Th align="right">Amount</Th>
                <Th align="right">Outstanding</Th>
                <Th>Due date</Th>
                <Th align="right">Days overdue</Th>
              </TableHead>
              <TableBody>
                {mockDebtorRows.map((row, i) => (
                  <Tr key={i}>
                    <Td color="primary">{row.client}</Td>
                    <Td color="primary">{row.invoice}</Td>
                    <Td align="right">{row.amount}</Td>
                    <Td align="right">{row.outstanding}</Td>
                    <Td>{row.dueDate}</Td>
                    <Td align="right">
                      <span style={{ fontWeight: row.daysOverdue >= 90 ? 600 : 400, color: row.daysOverdue >= 90 ? '#dc2626' : row.daysOverdue >= 60 ? '#ea580c' : row.daysOverdue >= 30 ? '#ca8a04' : undefined }}>
                        {row.daysOverdue}
                      </span>
                    </Td>
                  </Tr>
                ))}
              </TableBody>
            </DataTable>
          </Card>
        </>
      )}
    </ListPage>
  );
}
