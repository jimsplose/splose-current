import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return seed();
}

export async function POST() {
  return seed();
}

async function seed() {
  try {
    // Check if already seeded
    const existing = await prisma.practitioner.count();
    if (existing > 0) {
      return NextResponse.json({ message: "Database already seeded", count: existing });
    }

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

    const rachel = await prisma.practitioner.create({
      data: {
        name: "Rachel Kim",
        email: "rachel.kim@splose.demo",
        phone: "0445 678 901",
        role: "Psychologist",
        specialty: "CBT & Anxiety",
        color: "#f59e0b",
      },
    });

    const marcus = await prisma.practitioner.create({
      data: {
        name: "Marcus Chen",
        email: "marcus.chen@splose.demo",
        phone: "0456 789 012",
        role: "Exercise Physiologist",
        specialty: "Chronic Pain",
        color: "#06b6d4",
      },
    });

    // Create clients
    const clients = await Promise.all([
      // 0: Michael Brooks
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
      // 1: Lisa Martinez
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
      // 2: Tom Nguyen
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
      // 3: Sophie Anderson
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
      // 4: David Park
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
      // 5: Jenny Jenkins
      prisma.client.create({
        data: {
          firstName: "Jenny",
          lastName: "Jenkins",
          email: "jenny.j@email.com",
          phone: "0406 666 777",
          dateOfBirth: "2002-02-02",
          address: "55 King William St, Adelaide SA 5000",
          medicare: "5678 90123 4",
        },
      }),
      // 6: Harry James
      prisma.client.create({
        data: {
          firstName: "Harry",
          lastName: "James",
          email: "harry.james@email.com",
          phone: "0407 777 888",
          dateOfBirth: "1985-07-05",
          address: "8 Rundle Mall, Adelaide SA 5000",
          ndisNumber: "432345678",
        },
      }),
      // 7: Ella Thompson
      prisma.client.create({
        data: {
          firstName: "Ella",
          lastName: "Thompson",
          email: "ella.t@email.com",
          phone: "0408 888 999",
          dateOfBirth: "2015-02-18",
          address: "22 Henley Beach Rd, Adelaide SA 5000",
          ndisNumber: "432456789",
        },
      }),
      // 8: Oliver Wilson
      prisma.client.create({
        data: {
          firstName: "Oliver",
          lastName: "Wilson",
          email: "oliver.w@email.com",
          phone: "0409 999 000",
          dateOfBirth: "1990-04-12",
          address: "15 Morphett St, Adelaide SA 5000",
          medicare: "6789 01234 5",
        },
      }),
      // 9: Charlotte Brown
      prisma.client.create({
        data: {
          firstName: "Charlotte",
          lastName: "Brown",
          email: "charlotte.b@email.com",
          phone: "0410 000 111",
          dateOfBirth: "1975-12-25",
          address: "30 Hutt St, Adelaide SA 5000",
        },
      }),
      // 10: William Taylor
      prisma.client.create({
        data: {
          firstName: "William",
          lastName: "Taylor",
          email: "william.t@email.com",
          phone: "0411 111 222",
          dateOfBirth: "2010-08-19",
          address: "44 Prospect Rd, Adelaide SA 5000",
          ndisNumber: "432567890",
        },
      }),
      // 11: Amelia Davis
      prisma.client.create({
        data: {
          firstName: "Amelia",
          lastName: "Davis",
          email: "amelia.d@email.com",
          phone: "0412 222 333",
          dateOfBirth: "1998-06-30",
          address: "12 The Parade, Adelaide SA 5000",
          medicare: "7890 12345 6",
        },
      }),
    ]);

    // Create appointments for today and upcoming days
    const today = new Date();
    const formatDate = (d: Date) => d.toISOString().split("T")[0];
    const addDays = (days: number) => new Date(today.getTime() + days * 86400000);

    const appointments = [
      // Today
      { date: formatDate(today), startTime: "09:00", endTime: "09:45", clientId: clients[0].id, practitionerId: sarah.id, status: "Completed", type: "Initial Assessment" },
      { date: formatDate(today), startTime: "10:00", endTime: "10:45", clientId: clients[1].id, practitionerId: sarah.id, status: "Scheduled", type: "Follow Up" },
      { date: formatDate(today), startTime: "11:00", endTime: "11:45", clientId: clients[2].id, practitionerId: james.id, status: "Scheduled", type: "Standard" },
      { date: formatDate(today), startTime: "13:00", endTime: "13:45", clientId: clients[3].id, practitionerId: emma.id, status: "Scheduled", type: "Standard" },
      { date: formatDate(today), startTime: "14:00", endTime: "14:45", clientId: clients[4].id, practitionerId: sarah.id, status: "Scheduled", type: "Review" },
      { date: formatDate(today), startTime: "09:30", endTime: "10:30", clientId: clients[5].id, practitionerId: rachel.id, status: "Scheduled", type: "Initial Assessment" },
      { date: formatDate(today), startTime: "11:00", endTime: "11:45", clientId: clients[8].id, practitionerId: marcus.id, status: "Scheduled", type: "Standard" },
      { date: formatDate(today), startTime: "14:00", endTime: "14:45", clientId: clients[9].id, practitionerId: rachel.id, status: "Cancelled", type: "Follow Up" },
      // Yesterday
      { date: formatDate(addDays(-1)), startTime: "09:00", endTime: "09:45", clientId: clients[6].id, practitionerId: sarah.id, status: "Completed", type: "Standard" },
      { date: formatDate(addDays(-1)), startTime: "10:00", endTime: "10:45", clientId: clients[7].id, practitionerId: james.id, status: "Completed", type: "Standard" },
      { date: formatDate(addDays(-1)), startTime: "14:00", endTime: "14:45", clientId: clients[11].id, practitionerId: emma.id, status: "No Show", type: "Follow Up" },
      { date: formatDate(addDays(-1)), startTime: "15:00", endTime: "15:45", clientId: clients[10].id, practitionerId: marcus.id, status: "Completed", type: "Initial Assessment" },
      // Tomorrow
      { date: formatDate(addDays(1)), startTime: "09:00", endTime: "09:45", clientId: clients[1].id, practitionerId: james.id, status: "Scheduled", type: "Standard" },
      { date: formatDate(addDays(1)), startTime: "10:30", endTime: "11:15", clientId: clients[0].id, practitionerId: emma.id, status: "Scheduled", type: "Follow Up" },
      { date: formatDate(addDays(1)), startTime: "11:00", endTime: "12:00", clientId: clients[5].id, practitionerId: rachel.id, status: "Scheduled", type: "Telehealth" },
      { date: formatDate(addDays(1)), startTime: "13:00", endTime: "13:45", clientId: clients[8].id, practitionerId: marcus.id, status: "Scheduled", type: "Follow Up" },
      // Day 2
      { date: formatDate(addDays(2)), startTime: "11:00", endTime: "11:45", clientId: clients[3].id, practitionerId: sarah.id, status: "Scheduled", type: "Standard" },
      { date: formatDate(addDays(2)), startTime: "13:00", endTime: "14:00", clientId: clients[6].id, practitionerId: rachel.id, status: "Scheduled", type: "Group Session" },
      { date: formatDate(addDays(2)), startTime: "14:30", endTime: "15:15", clientId: clients[11].id, practitionerId: marcus.id, status: "Scheduled", type: "Review" },
      // Day 3
      { date: formatDate(addDays(3)), startTime: "09:30", endTime: "10:15", clientId: clients[7].id, practitionerId: james.id, status: "Scheduled", type: "Follow Up" },
      { date: formatDate(addDays(3)), startTime: "10:00", endTime: "10:45", clientId: clients[9].id, practitionerId: rachel.id, status: "Scheduled", type: "Standard" },
      // Day 4
      { date: formatDate(addDays(4)), startTime: "10:00", endTime: "10:45", clientId: clients[10].id, practitionerId: marcus.id, status: "Scheduled", type: "Follow Up" },
      { date: formatDate(addDays(4)), startTime: "14:00", endTime: "15:00", clientId: clients[4].id, practitionerId: sarah.id, status: "Scheduled", type: "Telehealth" },
      // Day 5
      { date: formatDate(addDays(5)), startTime: "09:00", endTime: "09:45", clientId: clients[2].id, practitionerId: james.id, status: "Scheduled", type: "Review" },
      { date: formatDate(addDays(5)), startTime: "11:00", endTime: "11:45", clientId: clients[11].id, practitionerId: rachel.id, status: "Scheduled", type: "Telehealth" },
    ];

    for (const appt of appointments) {
      await prisma.appointment.create({ data: appt });
    }

    // Create clinical notes
    const clinicalNotes = [
      {
        date: formatDate(today),
        content: "Patient presents with lower back pain following lifting injury at work. Pain rated 6/10. Limited flexion. Prescribed exercise program and manual therapy. Review in 1 week.",
        template: "Progress Note",
        signed: true,
        clientId: clients[0].id,
        practitionerId: sarah.id,
      },
      {
        date: formatDate(today),
        content: "NDIS participant. Continued work on fine motor skills and daily living activities. Good progress with dressing tasks. Next session: kitchen safety assessment.",
        template: "NDIS Progress Note",
        signed: false,
        clientId: clients[1].id,
        practitionerId: james.id,
      },
      {
        date: formatDate(today),
        content: "Speech therapy session focused on fluency techniques. Client demonstrated improved breath control and pausing strategies. Homework: daily reading practice with controlled rate.",
        template: "Progress Note",
        signed: true,
        clientId: clients[3].id,
        practitionerId: emma.id,
      },
      {
        date: formatDate(addDays(-1)),
        content: "Initial assessment for right shoulder pain. ROM limited in abduction and flexion. Strength 4/5. Referred for imaging. Treatment plan: manual therapy and progressive exercises.",
        template: "Initial Assessment",
        signed: true,
        clientId: clients[5].id,
        practitionerId: sarah.id,
      },
      {
        date: formatDate(addDays(-1)),
        content: "NDIS plan review preparation. Updated goals for community access and social skills. Recommend increase in OT support hours for next plan period.",
        template: "NDIS Progress Note",
        signed: false,
        clientId: clients[6].id,
        practitionerId: james.id,
      },
      {
        date: formatDate(today),
        content: "CBT session addressing generalised anxiety. Explored cognitive distortions and introduced thought challenging worksheet. Client engaged well and completed in-session exercises. Homework: daily thought record.",
        template: "Progress Note",
        signed: true,
        clientId: clients[5].id,
        practitionerId: rachel.id,
      },
      {
        date: formatDate(addDays(-1)),
        content: "Exercise physiology initial consult. Assessed baseline fitness and functional capacity. Chronic lower back pain with sedentary lifestyle. Developed 6-week progressive exercise program focusing on core stability and aerobic conditioning.",
        template: "Initial Assessment",
        signed: true,
        clientId: clients[10].id,
        practitionerId: marcus.id,
      },
      {
        date: formatDate(today),
        content: "Follow-up session for anxiety management. Client reports reduced frequency of panic attacks since starting breathing exercises. Introduced graded exposure hierarchy for social situations. Good compliance with homework.",
        template: "Progress Note",
        signed: false,
        clientId: clients[9].id,
        practitionerId: rachel.id,
      },
    ];

    for (const note of clinicalNotes) {
      await prisma.clinicalNote.create({ data: note });
    }

    // Create invoices
    const thirtyDaysLater = formatDate(addDays(30));
    const sevenDaysAgo = formatDate(addDays(-7));
    const twentyThreeDaysLater = formatDate(addDays(23));
    const yesterday = formatDate(addDays(-1));
    const fourteenDaysAgo = formatDate(addDays(-14));

    const invoices = [
      {
        invoiceNumber: "INV-001",
        date: formatDate(today),
        dueDate: thirtyDaysLater,
        status: "Sent",
        subtotal: 150.0,
        tax: 0,
        total: 150.0,
        billingType: "Medicare",
        clientId: clients[0].id,
        items: {
          create: [{ description: "Initial Physiotherapy Assessment (45 min)", quantity: 1, unitPrice: 150.0, total: 150.0 }],
        },
      },
      {
        invoiceNumber: "INV-002",
        date: formatDate(today),
        dueDate: thirtyDaysLater,
        status: "Draft",
        subtotal: 193.99,
        tax: 0,
        total: 193.99,
        billingType: "NDIS",
        clientId: clients[1].id,
        items: {
          create: [{ description: "OT Standard Consultation (45 min)", quantity: 1, unitPrice: 193.99, total: 193.99 }],
        },
      },
      {
        invoiceNumber: "INV-003",
        date: sevenDaysAgo,
        dueDate: twentyThreeDaysLater,
        status: "Paid",
        subtotal: 120.0,
        tax: 0,
        total: 120.0,
        billingType: "Private",
        clientId: clients[2].id,
        items: {
          create: [{ description: "Physiotherapy Follow Up (30 min)", quantity: 1, unitPrice: 120.0, total: 120.0 }],
        },
      },
      {
        invoiceNumber: "INV-004",
        date: sevenDaysAgo,
        dueDate: yesterday,
        status: "Overdue",
        subtotal: 148.71,
        tax: 0,
        total: 148.71,
        billingType: "Private",
        clientId: clients[4].id,
        items: {
          create: [{ description: "Physiotherapy Review (45 min)", quantity: 1, unitPrice: 148.71, total: 148.71 }],
        },
      },
      {
        invoiceNumber: "INV-005",
        date: yesterday,
        dueDate: thirtyDaysLater,
        status: "Sent",
        subtotal: 193.99,
        tax: 0,
        total: 193.99,
        billingType: "NDIS",
        clientId: clients[3].id,
        items: {
          create: [{ description: "Speech Pathology Standard (45 min)", quantity: 1, unitPrice: 193.99, total: 193.99 }],
        },
      },
      {
        invoiceNumber: "INV-006",
        date: yesterday,
        dueDate: thirtyDaysLater,
        status: "Draft",
        subtotal: 75.90,
        tax: 0,
        total: 75.90,
        billingType: "Private",
        clientId: clients[6].id,
        items: {
          create: [{ description: "OT Follow Up (30 min)", quantity: 1, unitPrice: 75.90, total: 75.90 }],
        },
      },
      {
        invoiceNumber: "INV-007",
        date: formatDate(today),
        dueDate: thirtyDaysLater,
        status: "Draft",
        subtotal: 75.00,
        tax: 0,
        total: 75.00,
        billingType: "Medicare",
        clientId: clients[5].id,
        items: {
          create: [{ description: "Physiotherapy Standard (30 min)", quantity: 1, unitPrice: 75.00, total: 75.00 }],
        },
      },
      {
        invoiceNumber: "INV-008",
        date: formatDate(today),
        dueDate: thirtyDaysLater,
        status: "Sent",
        subtotal: 220.00,
        tax: 0,
        total: 220.00,
        billingType: "Medicare",
        clientId: clients[8].id,
        items: {
          create: [
            { description: "Psychology Initial Assessment (60 min)", quantity: 1, unitPrice: 180.00, total: 180.00 },
            { description: "Psychological testing materials", quantity: 1, unitPrice: 40.00, total: 40.00 },
          ],
        },
      },
      {
        invoiceNumber: "INV-009",
        date: fourteenDaysAgo,
        dueDate: sevenDaysAgo,
        status: "Overdue",
        subtotal: 193.99,
        tax: 0,
        total: 193.99,
        billingType: "NDIS",
        clientId: clients[7].id,
        items: {
          create: [
            { description: "OT Standard Consultation (45 min)", quantity: 1, unitPrice: 150.00, total: 150.00 },
            { description: "Sensory assessment kit", quantity: 1, unitPrice: 43.99, total: 43.99 },
          ],
        },
      },
      {
        invoiceNumber: "INV-010",
        date: sevenDaysAgo,
        dueDate: twentyThreeDaysLater,
        status: "Paid",
        subtotal: 160.00,
        tax: 0,
        total: 160.00,
        billingType: "Private",
        clientId: clients[9].id,
        items: {
          create: [{ description: "Psychology Follow Up (50 min)", quantity: 1, unitPrice: 160.00, total: 160.00 }],
        },
      },
      {
        invoiceNumber: "INV-011",
        date: yesterday,
        dueDate: thirtyDaysLater,
        status: "Sent",
        subtotal: 287.98,
        tax: 0,
        total: 287.98,
        billingType: "NDIS",
        clientId: clients[10].id,
        items: {
          create: [
            { description: "Exercise Physiology Initial Assessment (60 min)", quantity: 1, unitPrice: 193.99, total: 193.99 },
            { description: "Home exercise program development", quantity: 1, unitPrice: 93.99, total: 93.99 },
          ],
        },
      },
      {
        invoiceNumber: "INV-012",
        date: formatDate(today),
        dueDate: thirtyDaysLater,
        status: "Draft",
        subtotal: 130.00,
        tax: 0,
        total: 130.00,
        billingType: "Medicare",
        clientId: clients[11].id,
        items: {
          create: [{ description: "Exercise Physiology Follow Up (45 min)", quantity: 1, unitPrice: 130.00, total: 130.00 }],
        },
      },
    ];

    for (const inv of invoices) {
      await prisma.invoice.create({ data: inv });
    }

    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
