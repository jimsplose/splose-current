import { ChevronDown, Mail } from "lucide-react";

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
  const statusColor = form.status === "In progress" ? "bg-green-600" : "bg-gray-500";

  return (
    <div className="min-h-[calc(100vh-3rem)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-display-lg text-text">{form.title}</h1>
          <span className={`rounded-full ${statusColor} px-3 py-1 text-label-md text-white`}>{form.status}</span>
          <span className="cursor-pointer text-sm text-primary hover:underline">{form.clientName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-label-lg text-text hover:bg-gray-50">
            <Mail className="h-4 w-4" />
            Email form
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-label-lg text-text hover:bg-gray-50">
            Actions
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Form content */}
      <div className="mx-auto max-w-3xl p-8">
        <div className="rounded-lg border border-border bg-white p-10 shadow-sm">
          {/* Client name with logo */}
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-xl font-bold text-text">{form.clientName}</h2>
            <div className="h-12 w-12 text-3xl">🦆</div>
          </div>

          <p className="mb-6 text-sm text-text-secondary italic">Not completed</p>

          {/* Form sections */}
          {form.sections.map((section, si) => (
            <div key={si} className="mb-6">
              <h3 className="mb-4 text-heading-lg text-text">{section.title}</h3>
              <div className="space-y-5">
                {section.fields.map((field, fi) => (
                  <div key={fi}>
                    <p className="text-label-lg text-text">{field.label}</p>
                    {field.value ? (
                      field.type === "file" ? (
                        <a href="#" className="text-sm text-primary hover:underline">
                          {field.value}
                        </a>
                      ) : (
                        <p className="text-sm text-text">{field.value}</p>
                      )
                    ) : (
                      <p className="text-sm text-text-secondary/60 italic">No response</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
