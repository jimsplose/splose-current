import Card from "./Card";
import Text from "./Text";

interface SectionProps {
  title?: string;
  description?: string;
  headerBar?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export default function Section({ title, description, headerBar, padding = "md", className, style, children }: SectionProps) {
  return (
    <Card headerBar={headerBar} title={headerBar ? title : undefined} padding={padding} className={className} style={style}>
      {title && !headerBar && (
        <div style={{ marginBottom: 16 }}>
          <Text variant="label/lg" as="h3" style={{ marginBottom: description ? 4 : 0 }}>
            {title}
          </Text>
          {description && (
            <Text variant="caption/md" color="secondary">
              {description}
            </Text>
          )}
        </div>
      )}
      {headerBar && description && (
        <Text variant="caption/md" color="secondary" style={{ marginBottom: 12 }}>
          {description}
        </Text>
      )}
      {children}
    </Card>
  );
}
