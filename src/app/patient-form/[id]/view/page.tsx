import { DownOutlined, MailOutlined } from "@ant-design/icons";
import { Badge, Button, Card } from "@/components/ds";

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 className="text-display-lg">{form.title}</h1>
          <Badge variant="green">{form.status}</Badge>
          <span style={{ cursor: 'pointer', fontSize: 12, color: 'var(--color-primary)' }}>{form.clientName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button variant="secondary">
            <MailOutlined style={{ fontSize: 16 }} />
            Email form
          </Button>
          <Button variant="secondary">
            Actions
            <DownOutlined style={{ fontSize: 14 }} />
          </Button>
        </div>
      </div>

      {/* Form content */}
      <div style={{ maxWidth: 768, marginLeft: 'auto', marginRight: 'auto', padding: 32 }}>
        <Card padding="none" style={{ padding: 40, boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}>
          {/* Client name with logo */}
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <h2 className="text-display-md text-text">{form.clientName}</h2>
            <div style={{ height: 48, width: 48, fontSize: 30 }}>🦆</div>
          </div>

          <p className="text-text-secondary" style={{ marginBottom: 24, fontSize: 12, fontStyle: 'italic' }}>Not completed</p>

          {/* Form sections */}
          {form.sections.map((section, si) => (
            <div key={si} style={{ marginBottom: 24 }}>
              <h3 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>{section.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {section.fields.map((field, fi) => (
                  <div key={fi}>
                    <p className="text-label-lg text-text">{field.label}</p>
                    {field.value ? (
                      field.type === "file" ? (
                        <a href="#" className="text-primary" style={{ fontSize: 12 }}>
                          {field.value}
                        </a>
                      ) : (
                        <p className="text-text" style={{ fontSize: 12 }}>{field.value}</p>
                      )
                    ) : (
                      <p className="text-text-secondary" style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.6 }}>No response</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
