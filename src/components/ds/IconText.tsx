interface IconTextProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function IconText({ icon, children, className = "" }: IconTextProps) {
  return (
    <div className={`flex items-center gap-2 text-body-md text-text-secondary ${className}`}>
      <span className="shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}
