import ReportsSidebar from "@/components/ReportsSidebar";

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      <ReportsSidebar />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
    </div>
  );
}
