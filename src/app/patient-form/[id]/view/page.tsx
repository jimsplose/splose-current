import { DownOutlined, MailOutlined } from "@ant-design/icons";
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
          <h1 className="text-display-lg">{form.title}</h1>
          <Badge variant="blue" solid>{form.status}</Badge>
          <Text variant="body/lg" as="span" style={{ fontSize: '18px', fontWeight: 400, color: 'rgb(65,69,73)' }}>{form.clientName}</Text>
        </Flex>
        <Flex align="center" gap={8}>
          <Button variant="secondary">
            <MailOutlined style={{ fontSize: 16 }} />
            Email form
          </Button>
          <Button variant="secondary">
            Actions
            <DownOutlined style={{ fontSize: 14 }} />
          </Button>
        </Flex>
      </Flex>

      {/* Form content */}
      <div className="mx-auto max-w-3xl p-8">
        <Card padding="none" style={{ padding: 40, boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}>
          {/* Client name with logo */}
          <Flex align="flex-start" justify="space-between" className="mb-4">
            <h2 className="text-display-md text-text">{form.clientName}</h2>
            <div style={{ height: 48, width: 48, fontSize: 30 }}>🦆</div>
          </Flex>

          <Text variant="body/md" color="secondary" className="mb-6" style={{ fontStyle: 'italic' }}>Not completed</Text>

          {/* Form sections */}
          {form.sections.map((section, si) => (
            <div key={si} className="mb-6">
              <h3 className="mb-4 text-text" style={{ fontSize: '20px', fontWeight: 600 }}>{section.title}</h3>
              <Flex vertical gap={20}>
                {section.fields.map((field, fi) => (
                  <div key={fi}>
                    <p className="text-label-lg text-text" style={{ fontWeight: 500 }}>{field.label}</p>
                    {field.value ? (
                      field.type === "file" ? (
                        <a href="#" className="cursor-pointer text-body-md" style={{ color: 'rgb(0,0,255)' }}>
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
