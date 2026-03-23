interface HintIconProps {
  tooltip?: string;
  className?: string;
}

export default function HintIcon({ tooltip, className = "" }: HintIconProps) {
  return (
    <span
      className={`inline-flex items-center justify-center h-4 w-4 rounded-full border border-gray-300 text-caption-sm text-gray-400 cursor-help ml-0.5 ${className}`}
      title={tooltip}
    >
      i
    </span>
  );
}
