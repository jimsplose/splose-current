"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, PageHeader, DataTable, TableHead, Th, TableBody, Tr, Td, Pagination, Modal, FormInput, FormSelect } from "@/components/ds";

const locations = [
  { id: 128, name: "East Clinics", address: "", lastUpdate: "12:24 pm, 6 Mar 2026" },
  { id: 129, name: "Splose OT", address: "", lastUpdate: "2:08 pm, 26 Feb 2026" },
  { id: 130, name: "Ploc", address: "", lastUpdate: "2:08 pm, 26 Feb 2026" },
  { id: 131, name: "Tasks", address: "", lastUpdate: "11:59 am, 5 Mar 2026" },
  { id: 132, name: "Sharon\u2019s", address: "", lastUpdate: "2:08 pm, 26 Feb 2026" },
  { id: 133, name: "One service only", address: "297 Pirie St, Adelaide, SA, 5000", lastUpdate: "2:08 pm, 26 Feb 2026" },
];

export default function LocationsPage() {
  const router = useRouter();
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");

  return (
    <div className="p-6">
      <PageHeader title="Locations">
        <Button variant="secondary">Show archived</Button>
        <Button variant="primary" onClick={() => { setNewName(""); setNewAddress(""); setShowNewModal(true); }}>+ New location</Button>
      </PageHeader>
      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Address</Th>
          <Th>Last update</Th>
        </TableHead>
        <TableBody>
          {locations.map((loc) => (
            <Tr key={loc.id} clickable>
              <Td>
                <Link
                  href={`/settings/locations/edit/${loc.id}`}
                  className="font-medium text-text hover:text-primary"
                >
                  {loc.name}
                </Link>
              </Td>
              <Td className="text-text-secondary">{loc.address}</Td>
              <Td className="text-text-secondary">{loc.lastUpdate}</Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={6} itemsPerPage={10} showPageSize={false} />

      <Modal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="New location"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowNewModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setShowNewModal(false); router.push("/settings/locations/new"); }}>Create & edit</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormInput label="Location name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. North Clinics" />
          <FormInput label="Address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="e.g. 123 Main St, Adelaide SA 5000" />
        </div>
      </Modal>
    </div>
  );
}
