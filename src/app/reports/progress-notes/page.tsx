"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Badge, Card, DateRangeFilter, Grid, ListPage, Stat, ColorDot, Text } from "@/components/ds";
import styles from "./ReportsProgressNotes.module.css";

interface ProgressNoteRow {
  key: string;
  titleText: string;
  titleBadge: string;
  client: string;
  relatedService: string;
  practitioner: string;
  location: string;
}

const progressNotesData: ProgressNoteRow[] = [
  {
    key: "1",
    titleText: "Bill Gates Demo",
    titleBadge: "Draft",
    client: "Skyler Peterson",
    relatedService: "—",
    practitioner: "Ruvi R.",
    location: "—",
  },
  {
    key: "2",
    titleText: "AAA TEST",
    titleBadge: "Draft",
    client: "A Del",
    relatedService: "—",
    practitioner: "Zoe Gomez",
    location: "—",
  },
];

const columns: ColumnsType<ProgressNoteRow> = [
  {
    key: "title",
    title: "Title",
    dataIndex: "titleText",
    render: (_, row) => (
      <>
        <Text variant="body/md" as="span" color="primary">{row.titleText}</Text>
        <Badge variant="gray" style={{ marginLeft: 8 }}>{row.titleBadge}</Badge>
      </>
    ),
  },
  {
    key: "client",
    title: "Client",
    dataIndex: "client",
    render: (_, row) => <Text variant="body/md" as="span" color="primary">{row.client}</Text>,
  },
  {
    key: "relatedService",
    title: "Related service",
    dataIndex: "relatedService",
    render: (_, row) => <Text variant="body/md" as="span" color="secondary">{row.relatedService}</Text>,
  },
  { key: "practitioner", title: "Practitioner", dataIndex: "practitioner" },
  {
    key: "location",
    title: "Location",
    dataIndex: "location",
    render: (_, row) => <Text variant="body/md" as="span" color="secondary">{row.location}</Text>,
  },
];

export default function ReportsProgressNotesPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <ListPage
      title="Progress notes"
      actions={<><Button>Export</Button><Button>Learn about this report</Button></>}
      cardWrap={false}
    >
      {/* Date range */}
      <div className={styles.dateRangeWrap}>
        <Text variant="body/md" as="div" color="secondary" className={styles.dateRangeLabel}>
          <span>&#128197;</span> Date range *
        </Text>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      {/* Filter buttons */}
      <Flex wrap="wrap" align="center" gap={8} className={styles.filterButtons}>
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button type="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </Flex>

      {showResults && (<>
      {/* Results */}
      <Text variant="body/md" color="secondary" mb={16}>2 progress notes found.</Text>

      {/* Summary stats row */}
      <Grid cols={4} gap="md" className={styles.statsRow}>
        <Card className={styles.statCard}>
          <Stat value="2" label="Total notes" />
        </Card>
        <Card className={styles.statCard}>
          <Stat value="0" label="Signed" />
        </Card>
        <Card className={styles.statCard}>
          <Stat value="2" label="Draft" />
        </Card>
        <Card className={styles.statCard}>
          <Stat value="1.0" label="Avg per practitioner" />
        </Card>
      </Grid>

      <Text variant="heading/lg" mb={16}>Summary</Text>

      {/* Summary tables and pie charts */}
      <Grid cols={2} gap="lg" className={styles.summaryGrid}>
        {/* Note template breakdown */}
        <div>
          <Card padding="none" className={styles.breakdownCard}>
            <table className={styles.breakdownTable}>
              <thead>
                <tr className={styles.breakdownHeader}>
                  <th className={styles.breakdownHeaderCellLeft}><Text variant="label/lg" as="span">Note template</Text></th>
                  <th className={styles.breakdownHeaderCellRight}><Text variant="label/lg" as="span">Number</Text></th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.breakdownRow}>
                  <td className={styles.breakdownCellLeft}>
                    <ColorDot color="green" label="AAA TEST" />
                  </td>
                  <td className={styles.breakdownCellRight}><Text variant="body/md" as="span">1 (50.0%)</Text></td>
                </tr>
                <tr>
                  <td className={styles.breakdownCellLeft}>
                    <ColorDot color="purple" label="Bill Gates Demo" />
                  </td>
                  <td className={styles.breakdownCellRight}><Text variant="body/md" as="span">1 (50.0%)</Text></td>
                </tr>
              </tbody>
            </table>
            <Flex align="center" justify="flex-end" className={styles.paginationFooter}>
              <Text variant="body/md" as="span" color="secondary">&lt;</Text>
              <Button type="text" size="small" className={styles.pageBtn}>
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
          <Card padding="none" className={styles.breakdownCard}>
            <table className={styles.breakdownTable}>
              <thead>
                <tr className={styles.breakdownHeader}>
                  <th className={styles.breakdownHeaderCellLeft}><Text variant="label/lg" as="span">Practitioner</Text></th>
                  <th className={styles.breakdownHeaderCellRight}><Text variant="label/lg" as="span">Number</Text></th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.breakdownRow}>
                  <td className={styles.breakdownCellLeft}>
                    <ColorDot color="green" label="Ruvi R." />
                  </td>
                  <td className={styles.breakdownCellRight}><Text variant="body/md" as="span">1 (50.0%)</Text></td>
                </tr>
                <tr>
                  <td className={styles.breakdownCellLeft}>
                    <ColorDot color="purple" label="Zoe Gomez" />
                  </td>
                  <td className={styles.breakdownCellRight}><Text variant="body/md" as="span">1 (50.0%)</Text></td>
                </tr>
              </tbody>
            </table>
            <Flex align="center" justify="flex-end" className={styles.paginationFooter}>
              <Text variant="body/md" as="span" color="secondary">&lt;</Text>
              <Button type="text" size="small" className={styles.pageBtn}>
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
      <Text variant="heading/lg" mb={16}>Progress notes list</Text>
      <Table columns={columns} dataSource={progressNotesData} rowKey="key" pagination={false} />
      </>)}
    </ListPage>
  );
}
