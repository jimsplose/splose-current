import { DownOutlined, MailOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import { Flex } from "antd";
import { Badge, Button, Card, Text } from "@/components/ds";

export const dynamic = "force-dynamic";

type FormField = {
  label: string;
  type: "file" | "text";
  value: string | null;
};

const mockFormData = {
  title: "Test form File upload pdf",
  status: "In progress" as const,
  clientName: "a a",
  sections: [
    {
      title: "Section title",
      fields: [
        { label: "File upload title", type: "file", value: "COND FORM A (1).pdf" },
        { label: "File upload title", type: "file", value: null },
        { label: "fawfa", type: "text", value: null },
        { label: "Paragraph title", type: "text", value: null },
      ] as FormField[],
    },
  ],
};

export default async function PatientFormViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  void id;

  const form = mockFormData;

  return (
    <div style={{ minHeight: 'calc(100vh - 3rem)' }}>
      {/* Header bar */}
      <Flex align="center" justify="space-between" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#fff', padding: '16px 24px' }}>
        <Flex align="center" gap={12}>
          <h1 style={{ fontFamily: "'Sprig Sans', 'Inter', sans-serif", fontSize: 30, fontWeight: 700, lineHeight: 1.2, color: 'rgb(66, 105, 74)' }}>{form.title}</h1>
          <Badge variant="blue" solid>{form.status}</Badge>
          <Text variant="body/lg" as="span" style={{ fontSize: '18px', fontWeight: 400, color: 'rgb(65,69,73)' }}>{form.clientName}</Text>
        </Flex>
        <Flex align="center" gap={8}>
          <Button variant="secondary">
            <Icon as={MailOutlined} />
            Email form
          </Button>
          <Button variant="secondary">
            Actions
            <Icon as={DownOutlined} size="md" />
          </Button>
        </Flex>
      </Flex>

      {/* Form content */}
      <div style={{ margin: '0 auto', maxWidth: '48rem', padding: 32 }}>
        <Card padding="none" style={{ padding: 40, boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}>
          {/* Client name with logo */}
          <Flex align="flex-start" justify="space-between" style={{ marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Sprig Sans', 'Inter', sans-serif", fontSize: 24, fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text)' }}>{form.clientName}</h2>
            <div style={{ height: 48, width: 48, fontSize: 30 }}>🦆</div>
          </Flex>

          <Text variant="body/md" color="secondary" style={{ marginBottom: 24, fontStyle: 'italic' }}>Not completed</Text>

          {/* Form sections */}
          {form.sections.map((section, si) => (
            <div key={si} style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16, fontSize: '20px', fontWeight: 600, color: 'var(--color-text)' }}>{section.title}</h3>
              <Flex vertical gap={20}>
                {section.fields.map((field, fi) => (
                  <div key={fi}>
                    <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>{field.label}</p>
                    {field.value ? (
                      field.type === "file" ? (
                        <a href="#" style={{ fontSize: 14, lineHeight: 1.57, cursor: 'pointer', color: 'rgb(0,0,255)' }}>
                          {field.value}
                        </a>
                      ) : (
                        <Text variant="body/sm" color="text">{field.value}</Text>
                      )
                    ) : (
                      <Text variant="body/md" style={{ color: 'rgb(204,204,204)', fontStyle: 'italic' }}>No response</Text>
                    )}
                  </div>
                ))}
              </Flex>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
