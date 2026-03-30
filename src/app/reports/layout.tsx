import { Flex } from "antd";
import ReportsSidebar from "@/components/ReportsSidebar";

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex style={{ minHeight: 'calc(100vh - 3rem)' }}>
      <ReportsSidebar />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>{children}</div>
    </Flex>
  );
}
