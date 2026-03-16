import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename2 = fileURLToPath(import.meta.url);
const __dirname2 = path.dirname(__filename2);
const dbPath = path.resolve(__dirname2, "..", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create practitioners
  const sarah = await prisma.practitioner.create({
    data: {
      name: "Sarah Chen",
      email: "sarah.chen@splose.demo",
      phone: "0412 345 678",
      role: "Senior Physiotherapist",
      specialty: "Musculoskeletal",
      color: "#6366f1",
    },
  });

  const james = await prisma.practitioner.create({
    data: {
      name: "James Wilson",
      email: "james.wilson@splose.demo",
      phone: "0423 456 789",
      role: "Occupational Therapist",
      specialty: "Paediatric OT",
      color: "#8b5cf6",
    },
  });

  const emma = await prisma.practitioner.create({
    data: {
      name: "Emma Thompson",
      email: "emma.thompson@splose.demo",
      phone: "0434 567 890",
      role: "Speech Pathologist",
      specialty: "Fluency Disorders",
      color: "#ec4899",
    },
  });

  // Create clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        firstName: "Michael",
        lastName: "Brooks",
        email: "michael.brooks@email.com",
        phone: "0401 111 222",
        dateOfBirth: "1985-03-15",
        address: "42 Park Avenue, Melbourne VIC 3000",
        medicare: "2345 67890 1",
      },
    }),
    prisma.client.create({
      data: {
        firstName: "Lisa",
        lastName: "Martinez",
        email: "lisa.martinez@email.com",
        phone: "0402 222 333",
        dateOfBirth: "1992-07-22",
        address: "15 Ocean Drive, St Kilda VIC 3182",
        ndisNumber: "431234567",
      },
    }),
    prisma.client.create({
      data: {
        firstName: "Tom",
        lastName: "Nguyen",
        email: "tom.nguyen@email.com",
        phone: "0403 333 444",
        dateOfBirth: "1978-11-08",
        address: "88 Collins Street, Melbourne VIC 3000",
        medicare: "3456 78901 2",
      },
    }),
    prisma.client.create({
      data: {
        firstName: "Sophie",
        lastName: "Anderson",
        email: "sophie.anderson@email.com",
        phone: "0404 444 555",
        dateOfBirth: "2018-02-14",
        address: "7 Elm Court, Richmond VIC 3121",
        ndisNumber: "431987654",
      },
    }),
    prisma.client.create({
      data: {
        firstName: "David",
        lastName: "Park",
        email: "david.park@email.com",
        phone: "0405 555 666",
        dateOfBirth: "1965-09-30",
        address: "120 High Street, Prahran VIC 3181",
        medicare: "4567 89012 3",
      },
    }),
  ]);

  // Create appointments for today and upcoming days
  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const appointments = [
    { date: formatDate(today), startTime: "09:00", endTime: "09:45", clientId: clients[0].id, practitionerId: sarah.id, status: "Completed", type: "Initial Assessment" },
    { date: formatDate(today), startTime: "10:00", endTime: "10:45", clientId: clients[1].id, practitionerId: sarah.id, status: "Scheduled", type: "Follow Up" },
    { date: formatDate(today), startTime: "11:00", endTime: "11:45", clientId: clients[2].id, practitionerId: james.id, status: "Scheduled", type: "Standard" },
    { date: formatDate(today), startTime: "13:00", endTime: "13:45", clientId: clients[3].id, practitionerId: emma.id, status: "Scheduled", type: "Standard" },
    { date: formatDate(today), startTime: "14:00", endTime: "14:45", clientId: clients[4].id, practitionerId: sarah.id, status: "Scheduled", type: "Review" },
    { date: formatDate(new Date(today.getTime() + 86400000)), startTime: "09:00", endTime: "09:45", clientId: clients[1].id, practitionerId: james.id, status: "Scheduled", type: "Standard" },
    { date: formatDate(new Date(today.getTime() + 86400000)), startTime: "10:30", endTime: "11:15", clientId: clients[0].id, practitionerId: emma.id, status: "Scheduled", type: "Follow Up" },
    { date: formatDate(new Date(today.getTime() + 2 * 86400000)), startTime: "11:00", endTime: "11:45", clientId: clients[3].id, practitionerId: sarah.id, status: "Scheduled", type: "Standard" },
  ];

  for (const appt of appointments) {
    await prisma.appointment.create({ data: appt });
  }

  // Create clinical notes
  await prisma.clinicalNote.create({
    data: {
      date: formatDate(today),
      content: "Patient presents with lower back pain following lifting injury at work. Pain rated 6/10. Limited flexion. Prescribed exercise program and manual therapy. Review in 1 week.",
      template: "Progress Note",
      signed: true,
      clientId: clients[0].id,
      practitionerId: sarah.id,
    },
  });

  await prisma.clinicalNote.create({
    data: {
      date: formatDate(today),
      content: "NDIS participant. Continued work on fine motor skills and daily living activities. Good progress with dressing tasks. Next session: kitchen safety assessment.",
      template: "NDIS Progress Note",
      signed: false,
      clientId: clients[1].id,
      practitionerId: james.id,
    },
  });

  // Create invoices
  const inv1 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-001",
      date: formatDate(today),
      dueDate: formatDate(new Date(today.getTime() + 30 * 86400000)),
      status: "Sent",
      subtotal: 150.0,
      tax: 0,
      total: 150.0,
      billingType: "Medicare",
      clientId: clients[0].id,
      items: {
        create: [
          { description: "Initial Physiotherapy Assessment (45 min)", quantity: 1, unitPrice: 150.0, total: 150.0 },
        ],
      },
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-002",
      date: formatDate(today),
      dueDate: formatDate(new Date(today.getTime() + 30 * 86400000)),
      status: "Draft",
      subtotal: 193.99,
      tax: 0,
      total: 193.99,
      billingType: "NDIS",
      clientId: clients[1].id,
      items: {
        create: [
          { description: "OT Standard Consultation (45 min)", quantity: 1, unitPrice: 193.99, total: 193.99 },
        ],
      },
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-003",
      date: formatDate(new Date(today.getTime() - 7 * 86400000)),
      dueDate: formatDate(new Date(today.getTime() + 23 * 86400000)),
      status: "Paid",
      subtotal: 120.0,
      tax: 0,
      total: 120.0,
      billingType: "Private",
      clientId: clients[2].id,
      items: {
        create: [
          { description: "Physiotherapy Follow Up (30 min)", quantity: 1, unitPrice: 120.0, total: 120.0 },
        ],
      },
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
