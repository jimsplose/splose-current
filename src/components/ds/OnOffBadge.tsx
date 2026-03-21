interface OnOffBadgeProps {
  value: boolean;
  onLabel?: string;
  offLabel?: string;
}

export default function OnOffBadge({
  value,
  onLabel = "On",
  offLabel = "Off",
}: OnOffBadgeProps) {
  return (
    <span className={value ? "text-green-600" : "text-red-500"}>
      {value ? onLabel : offLabel}
    </span>
  );
}
