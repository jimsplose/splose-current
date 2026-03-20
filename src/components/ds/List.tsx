interface ListItem {
  label: string;
  value: React.ReactNode;
}

interface ListProps {
  items: ListItem[];
  labelWidth?: string;
  className?: string;
}

export default function List({ items, labelWidth = "w-28", className = "" }: ListProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="flex gap-16">
          <span className={`${labelWidth} shrink-0 text-body-md text-text-secondary`}>{item.label}</span>
          <span className="text-body-md text-text">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
