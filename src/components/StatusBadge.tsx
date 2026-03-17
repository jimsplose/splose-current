const statusStyles: Record<string, string> = {
  Scheduled: "bg-green-100 text-green-700",
  Upcoming: "bg-green-100 text-green-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  "No Show": "bg-yellow-100 text-yellow-700",
  Draft: "bg-gray-100 text-gray-600",
  Sent: "bg-blue-100 text-blue-700",
  Paid: "bg-green-500 text-white",
  Overdue: "bg-red-500 text-white",
  "Do not invoice": "bg-gray-200 text-gray-600",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
}
