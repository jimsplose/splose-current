import EditLocationClient from "./EditLocationClient";

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditLocationClient id={id} />;
}
