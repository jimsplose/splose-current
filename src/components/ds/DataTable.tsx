interface DataTableProps {
  children: React.ReactNode;
  minWidth?: string;
}

export default function DataTable({ children, minWidth }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <table className="w-full" style={minWidth ? { minWidth } : undefined}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-border bg-purple-50">{children}</tr>
    </thead>
  );
}

interface ThProps {
  children?: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  hidden?: "sm" | "md" | "lg";
}

export function Th({ children, align = "left", className = "", hidden }: ThProps) {
  const hideClass = hidden ? `hidden ${hidden}:table-cell` : "";
  return (
    <th className={`px-4 py-3 text-${align} text-label-lg text-text ${hideClass} ${className}`}>{children}</th>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

interface TdProps {
  children?: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  hidden?: "sm" | "md" | "lg";
}

export function Td({ children, align = "left", className = "", hidden }: TdProps) {
  const hideClass = hidden ? `hidden ${hidden}:table-cell` : "";
  return <td className={`px-4 py-3 text-${align} text-body-md ${hideClass} ${className}`}>{children}</td>;
}
