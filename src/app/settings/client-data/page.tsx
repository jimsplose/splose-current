"use client";

import { PageHeader } from "@/components/ds";

export default function ClientDataPage() {
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Client data" />
      <p style={{ color: "rgb(65, 69, 73)", fontSize: 14, marginTop: 16 }}>
        Manage your client data settings.
      </p>
    </div>
  );
}
