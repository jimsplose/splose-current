import { PageHeader, Badge, Alert } from "@/components/ds";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface UploadItem {
  client: string;
  service: string;
  date: string;
  amount: string;
  status: string;
}

const items: UploadItem[] = [
  { client: "Emma Thompson", service: "Individual Therapy", date: "22 Mar 2026", amount: "$193.99", status: "Success" },
  { client: "Liam Johnson", service: "Group Session", date: "21 Mar 2026", amount: "$97.00", status: "Success" },
  { client: "Olivia Davis", service: "Plan Management", date: "20 Mar 2026", amount: "$65.09", status: "Error" },
  { client: "Noah Wilson", service: "Individual Therapy", date: "19 Mar 2026", amount: "$193.99", status: "Success" },
];

const columns: ColumnsType<UploadItem> = [
  { key: "client", title: "Client", dataIndex: "client" },
  { key: "service", title: "Service", dataIndex: "service" },
  { key: "date", title: "Date", dataIndex: "date" },
  { key: "amount", title: "Amount", dataIndex: "amount", align: "right" },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    render: (_, item) => (
      <Badge variant={item.status === "Success" ? "green" : "red"}>{item.status}</Badge>
    ),
  },
];

export default function NdisBulkUploadDetailPage() {
  const hasErrors = items.some((i) => i.status === "Error");

  return (
    <>
      <PageHeader title="NDIS bulk upload #54901">
        <Button>Export</Button>
      </PageHeader>

      {hasErrors && (
        <Alert variant="error" style={{ marginBottom: 16 }}>
          1 item failed to upload. Please review and retry.
        </Alert>
      )}

      <Table columns={columns} dataSource={items} rowKey={(_, index) => String(index)} pagination={false} />
    </>
  );
}
