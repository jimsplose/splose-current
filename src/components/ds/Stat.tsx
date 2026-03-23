interface StatProps {
  /** The metric value (number or string) */
  value: React.ReactNode;
  /** Label below the value */
  label: string;
  className?: string;
}

export default function Stat({ value, label, className = "" }: StatProps) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-heading-lg text-text">{value}</p>
      <p className="text-caption-md text-text-secondary">{label}</p>
    </div>
  );
}
