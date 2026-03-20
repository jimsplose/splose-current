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
    // Delete all existing data in correct order (child tables first)
    await prisma.invoiceItem.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.clinicalNote.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.client.deleteMany();
    await prisma.practitioner.deleteMany();

    // ─── PRACTITIONERS (6) ───────────────────────────────────────────

    const practitioners = await Promise.all([
      prisma.practitioner.create({
        data: {
          name: "Sarah Chen",
          email: "sarah.chen@splose.demo",
          phone: "0412 345 678",
          role: "Senior Physiotherapist",
          specialty: "Musculoskeletal",
          color: "#7c3aed",
        },
      }),
      prisma.practitioner.create({
        data: {
          name: "James Wilson",
          email: "james.wilson@splose.demo",
          phone: "0423 456 789",
          role: "Occupational Therapist",
          specialty: "Paediatric OT",
          color: "#2563eb",
        },
      }),
      prisma.practitioner.create({
        data: {
          name: "Emma Thompson",
          email: "emma.thompson@splose.demo",
          phone: "0434 567 890",
          role: "Speech Pathologist",
          specialty: "Fluency Disorders",
          color: "#059669",
        },
      }),
      prisma.practitioner.create({
        data: {
          name: "Michael Brown",
          email: "michael.brown@splose.demo",
          phone: "0445 678 901",
          role: "Psychologist",
          specialty: "Cognitive Behavioural Therapy",
          color: "#d97706",
        },
      }),
      prisma.practitioner.create({
        data: {
          name: "Lisa Anderson",
          email: "lisa.anderson@splose.demo",
          phone: "0456 789 012",
          role: "Exercise Physiologist",
          specialty: "Chronic Disease Management",
          color: "#dc2626",
        },
      }),
      prisma.practitioner.create({
        data: {
          name: "Rachel Kim",
          email: "rachel.kim@splose.demo",
          phone: "0467 890 123",
          role: "Dietitian",
          specialty: "Paediatric Nutrition",
          color: "#ec4899",
        },
      }),
    ]);

    const [sarah, james, emma, michael, lisa, rachel] = practitioners;

    // ─── CLIENTS (12) ────────────────────────────────────────────────

    const clients = await Promise.all([
      // 0 - Active, Medicare
      prisma.client.create({
        data: {
          firstName: "Oliver",
          lastName: "Mitchell",
          email: "oliver.mitchell@email.com",
          phone: "0401 111 222",
          dateOfBirth: "1985-03-15",
          address: "42 Park Avenue, Melbourne VIC 3000",
          medicare: "2345 67890 1",
          notes: "Referred by GP Dr. Patel for lower back pain management.",
          active: true,
        },
      }),
      // 1 - Active, NDIS
      prisma.client.create({
        data: {
          firstName: "Charlotte",
          lastName: "Nguyen",
          email: "charlotte.nguyen@email.com",
          phone: "0402 222 333",
          dateOfBirth: "2019-07-22",
          address: "15 Ocean Drive, St Kilda VIC 3182",
          ndisNumber: "431234567",
          notes: "NDIS participant. Plan managed by Lighthouse Plan Management.",
          active: true,
        },
      }),
      // 2 - Active, Medicare
      prisma.client.create({
        data: {
          firstName: "William",
          lastName: "O'Brien",
          email: "william.obrien@email.com",
          phone: "0403 333 444",
          dateOfBirth: "1978-11-08",
          address: "88 Collins Street, Melbourne VIC 3000",
          medicare: "3456 78901 2",
          notes: "Post-surgical rehab for right knee reconstruction.",
          active: true,
        },
      }),
      // 3 - Active, NDIS
      prisma.client.create({
        data: {
          firstName: "Amelia",
          lastName: "Patel",
          email: "amelia.patel@email.com",
          phone: "0404 444 555",
          dateOfBirth: "2018-02-14",
          address: "7 Elm Court, Richmond VIC 3121",
          ndisNumber: "431987654",
          notes: "Speech delay. NDIS self-managed.",
          active: true,
        },
      }),
      // 4 - Active, Medicare
      prisma.client.create({
        data: {
          firstName: "Jack",
          lastName: "Thompson",
          email: "jack.thompson@email.com",
          phone: "0405 555 666",
          dateOfBirth: "1965-09-30",
          address: "120 High Street, Prahran VIC 3181",
          medicare: "4567 89012 3",
          notes: "Chronic shoulder pain. Workers compensation claim.",
          active: true,
        },
      }),
      // 5 - Active, Medicare
      prisma.client.create({
        data: {
          firstName: "Sophia",
          lastName: "Williams",
          email: "sophia.williams@email.com",
          phone: "0406 666 777",
          dateOfBirth: "1990-04-18",
          address: "33 Queen Street, Melbourne VIC 3000",
          medicare: "5678 90123 4",
          notes: "Anxiety and stress management referral.",
          active: true,
        },
      }),
      // 6 - Active, NDIS
      prisma.client.create({
        data: {
          firstName: "Liam",
          lastName: "Taylor",
          email: "liam.taylor@email.com",
          phone: "0407 777 888",
          dateOfBirth: "2016-08-25",
          address: "5 Bridge Road, Hawthorn VIC 3122",
          ndisNumber: "431456789",
          notes: "ASD diagnosis. OT and speech therapy for daily living skills.",
          active: true,
        },
      }),
      // 7 - Active, Medicare
      prisma.client.create({
        data: {
          firstName: "Matilda",
          lastName: "Harris",
          email: "matilda.harris@email.com",
          phone: "0408 888 999",
          dateOfBirth: "1973-12-01",
          address: "200 Lygon Street, Carlton VIC 3053",
          medicare: "6789 01234 5",
          notes: "Type 2 diabetes management. Referred for dietitian and EP.",
          active: true,
        },
      }),
      // 8 - Active, Private
      prisma.client.create({
        data: {
          firstName: "Noah",
          lastName: "Campbell",
          email: "noah.campbell@email.com",
          phone: "0409 999 000",
          dateOfBirth: "2001-06-10",
          address: "45 Chapel Street, Windsor VIC 3181",
          notes: "Sports physiotherapy - ACL rehab program.",
          active: true,
        },
      }),
      // 9 - Active, NDIS
      prisma.client.create({
        data: {
          firstName: "Isla",
          lastName: "Wong",
          email: "isla.wong@email.com",
          phone: "0410 000 111",
          dateOfBirth: "2020-01-30",
          address: "12 Smith Street, Collingwood VIC 3066",
          ndisNumber: "431567890",
          notes: "Early intervention. Speech and OT services.",
          active: true,
        },
      }),
      // 10 - Archived, Medicare
      prisma.client.create({
        data: {
          firstName: "Henry",
          lastName: "Stewart",
          email: "henry.stewart@email.com",
          phone: "0411 123 456",
          dateOfBirth: "1945-05-20",
          address: "78 Bourke Street, Melbourne VIC 3000",
          medicare: "7890 12345 6",
          notes: "Discharged. Completed 12-week physiotherapy program.",
          active: false,
        },
      }),
      // 11 - Archived, Private
      prisma.client.create({
        data: {
          firstName: "Zara",
          lastName: "Murphy",
          email: "zara.murphy@email.com",
          phone: "0412 234 567",
          dateOfBirth: "1998-10-05",
          address: "90 Brunswick Street, Fitzroy VIC 3065",
          notes: "Relocated interstate. Referred to Sydney provider.",
          active: false,
        },
      }),
    ]);

    // ─── HELPER: date strings ────────────────────────────────────────

    const dateOffset = (days: number): string => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().split("T")[0];
    };

    const today = dateOffset(0);

    // ─── APPOINTMENTS — recurring weekly to fill calendar month view ──

    // Helper: get next occurrence of a day-of-week from a date
    const nextDow = (startDate: Date, dow: number): Date => {
      const d = new Date(startDate);
      const diff = (dow - d.getDay() + 7) % 7;
      d.setDate(d.getDate() + (diff === 0 ? 0 : diff));
      return d;
    };

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    const appointmentData: Array<{
      date: string; startTime: string; endTime: string;
      clientId: string; practitionerId: string; status: string; type: string;
    }> = [];

    // Every Monday: two appointments (emma, pink)
    let mon = nextDow(firstOfMonth, 1);
    while (mon <= lastOfMonth) {
      const ds = mon.toISOString().split("T")[0];
      const past = mon < now;
      appointmentData.push(
        { date: ds, startTime: "10:30", endTime: "11:15", clientId: clients[0].id, practitionerId: emma.id, status: past ? "Completed" : "Scheduled", type: "OT - Initial Consult" },
        { date: ds, startTime: "14:30", endTime: "15:15", clientId: clients[6].id, practitionerId: emma.id, status: past ? "Cancelled" : "Scheduled", type: "Follow Up" },
      );
      mon = new Date(mon.getTime() + 7 * 86400000);
    }

    // Every Tuesday: Group session (rachel, yellow)
    let tue = nextDow(firstOfMonth, 2);
    while (tue <= lastOfMonth) {
      const ds = tue.toISOString().split("T")[0];
      const past = tue < now;
      appointmentData.push(
        { date: ds, startTime: "12:45", endTime: "13:40", clientId: clients[3].id, practitionerId: rachel.id, status: past ? "Completed" : "Scheduled", type: "Group Session" },
      );
      tue = new Date(tue.getTime() + 7 * 86400000);
    }

    // Every Wednesday: Group at 1:30pm (rachel)
    let wed = nextDow(firstOfMonth, 3);
    while (wed <= lastOfMonth) {
      const ds = wed.toISOString().split("T")[0];
      const past = wed < now;
      appointmentData.push(
        { date: ds, startTime: "13:30", endTime: "14:25", clientId: clients[1].id, practitionerId: rachel.id, status: past ? "Completed" : "Scheduled", type: "Group Session" },
      );
      wed = new Date(wed.getTime() + 7 * 86400000);
    }

    // Every other Thursday: two appointments (sarah/rachel)
    let thu = nextDow(firstOfMonth, 4);
    let thuIdx = 0;
    while (thu <= lastOfMonth) {
      if (thuIdx % 2 === 1) {
        const ds = thu.toISOString().split("T")[0];
        const past = thu < now;
        appointmentData.push(
          { date: ds, startTime: "09:30", endTime: "10:15", clientId: clients[2].id, practitionerId: sarah.id, status: past ? "Completed" : "Scheduled", type: "Standard Consultation" },
          { date: ds, startTime: "12:30", endTime: "13:15", clientId: clients[4].id, practitionerId: rachel.id, status: past ? "Completed" : "Scheduled", type: "Initial Assessment" },
        );
      }
      thu = new Date(thu.getTime() + 7 * 86400000);
      thuIdx++;
    }

    // One Friday next month (blue)
    const nextFri = nextDow(new Date(year, month + 1, 1), 5);
    appointmentData.push(
      { date: nextFri.toISOString().split("T")[0], startTime: "09:30", endTime: "10:15", clientId: clients[8].id, practitionerId: lisa.id, status: "Scheduled", type: "Review" },
    );

    // Extra today appointments for week/day views
    appointmentData.push(
      { date: today, startTime: "09:00", endTime: "09:45", clientId: clients[5].id, practitionerId: sarah.id, status: "Completed", type: "Initial Assessment" },
      { date: today, startTime: "11:00", endTime: "11:45", clientId: clients[7].id, practitionerId: james.id, status: "Scheduled", type: "Standard" },
      { date: today, startTime: "14:00", endTime: "14:45", clientId: clients[9].id, practitionerId: rachel.id, status: "Cancelled", type: "Follow Up" },
      { date: dateOffset(1), startTime: "09:00", endTime: "09:45", clientId: clients[10].id, practitionerId: james.id, status: "Scheduled", type: "Follow Up" },
      { date: dateOffset(1), startTime: "13:00", endTime: "13:45", clientId: clients[11].id, practitionerId: michael.id, status: "Scheduled", type: "Standard" },
      { date: dateOffset(-1), startTime: "10:00", endTime: "10:45", clientId: clients[2].id, practitionerId: james.id, status: "Completed", type: "Standard" },
      { date: dateOffset(-1), startTime: "15:00", endTime: "15:45", clientId: clients[8].id, practitionerId: michael.id, status: "Completed", type: "Initial Assessment" },
    );

    for (const appt of appointmentData) {
      await prisma.appointment.create({ data: appt });
    }

    // ─── CLINICAL NOTES (12) ─────────────────────────────────────────

    const clinicalNoteData = [
      {
        date: dateOffset(-13),
        content: "Initial assessment for chronic lower back pain. Patient reports pain 6/10 onset 3 months ago following lifting injury at work. Limited lumbar flexion and extension. Straight leg raise positive on right at 45 degrees. Treatment plan: manual therapy, core stabilisation program, and ergonomic advice. Review in 1 week.",
        template: "Initial Assessment",
        signed: true,
        clientId: clients[0].id,
        practitionerId: sarah.id,
      },
      {
        date: dateOffset(-11),
        content: "Initial OT assessment for Charlotte (5 yo). NDIS participant. Parent reports difficulties with fine motor tasks, dressing, and handwriting readiness. Assessment using BOT-2 and clinical observation. Significant delays in fine motor precision and manual dexterity. Goals established for self-care independence and pre-writing skills. Recommend weekly OT sessions.",
        template: "Initial Assessment",
        signed: true,
        clientId: clients[1].id,
        practitionerId: james.id,
      },
      {
        date: dateOffset(-10),
        content: "Follow-up speech therapy session for Amelia (7 yo). Continued work on articulation targets /s/ and /r/ in sentence-level practice. Showing good progress with /s/ blends. /r/ remains inconsistent in connected speech. Home practice sheets provided. Next session: narrative language activities.",
        template: "Progress Note",
        signed: true,
        clientId: clients[3].id,
        practitionerId: emma.id,
      },
      {
        date: dateOffset(-9),
        content: "Initial psychology assessment for Sophia. Presenting with generalised anxiety and work-related stress. PHQ-9 score: 12 (moderate). GAD-7 score: 14 (moderate). Discussed treatment options including CBT and mindfulness-based strategies. Treatment plan: 6-session CBT program with fortnightly reviews. Safety plan discussed — no current risk.",
        template: "Initial Assessment",
        signed: true,
        clientId: clients[5].id,
        practitionerId: michael.id,
      },
      {
        date: dateOffset(-7),
        content: "Initial dietitian consultation for Matilda. Type 2 diabetes diagnosed 6 months ago. Current HbA1c 7.8%. BMI 31.2. Discussed Mediterranean-style eating pattern, carbohydrate counting basics, and portion control strategies. Meal plan provided. Follow-up in 2 weeks to review food diary.",
        template: "Initial Assessment",
        signed: true,
        clientId: clients[7].id,
        practitionerId: rachel.id,
      },
      {
        date: dateOffset(-5),
        content: "NDIS plan review session for Liam (9 yo). Reviewed progress on current goals: 1) Independent toileting — achieved, 2) Shoe tying — progressing, 3) Playground skills — progressing. Updated goals for next plan period to include handwriting fluency and peer interaction skills. Report to be submitted to NDIA.",
        template: "Treatment Plan",
        signed: false,
        clientId: clients[6].id,
        practitionerId: james.id,
      },
      {
        date: dateOffset(-4),
        content: "Initial exercise physiology assessment for Noah. ACL reconstruction (hamstring graft) 8 weeks post-op. Good ROM recovery (0-120 degrees). Quad strength deficit 40% compared to uninvolved limb. Commenced phase 2 rehab program: stationary bike, leg press, mini squats, balance board. Return to running criteria discussed.",
        template: "Initial Assessment",
        signed: true,
        clientId: clients[8].id,
        practitionerId: lisa.id,
      },
      {
        date: dateOffset(-3),
        content: "Follow-up physiotherapy for Oliver. Pain reduced to 3/10. Lumbar flexion improved to 80% of normal range. Tolerated manual therapy well. Progressed exercise program to include Swiss ball exercises and theraband resistance. Continue current management. Next review in 1 week.",
        template: "Progress Note",
        signed: true,
        clientId: clients[0].id,
        practitionerId: sarah.id,
      },
      {
        date: dateOffset(-1),
        content: "Follow-up for William. Right knee ROM now 5-130 degrees (improved from 10-110 at initial). Quad strength 4/5. Able to ascend stairs with good control. Progressed to single leg exercises and proprioception work. Discussed return to golf timeline. Review in 2 weeks.",
        template: "Progress Note",
        signed: true,
        clientId: clients[2].id,
        practitionerId: sarah.id,
      },
      {
        date: today,
        content: "Follow-up physiotherapy for Oliver. Reports feeling significantly better. Pain 2/10 at worst. Full ROM restored. Functional testing: sit-to-stand x10 pain-free, single leg balance 30s bilateral. Discussed maintenance program and self-management strategies. Plan for discharge at next session if progress maintained.",
        template: "Progress Note",
        signed: false,
        clientId: clients[0].id,
        practitionerId: sarah.id,
      },
      {
        date: today,
        content: "CBT session 3 for Sophia. Reviewed thought diary entries from past fortnight. Identified core belief: 'I must be perfect to be valued.' Introduced cognitive restructuring techniques and behavioural experiments. GAD-7 score improved to 10. Homework: continue thought diary with restructuring column. Next session: exposure hierarchy.",
        template: "Progress Note",
        signed: false,
        clientId: clients[5].id,
        practitionerId: michael.id,
      },
      {
        date: dateOffset(-2),
        content: "Discharge summary for Henry Stewart. Completed 12-week post hip replacement rehabilitation program. All goals achieved: independent ambulation without aid, stair negotiation, return to community walking. Strength and ROM within functional limits. Discharged to independent home exercise program. GP letter sent.",
        template: "Discharge Summary",
        signed: true,
        clientId: clients[10].id,
        practitionerId: sarah.id,
      },
      {
        date: dateOffset(-1),
        content: "Home visit assessment. Reviewed home environment for falls risk. Recommended grab rails in bathroom and non-slip mats. Client agreeable to modifications. Follow-up in 2 weeks to review installation.",
        template: "Progress Note",
        signed: false,
        clientId: clients[4].id,
        practitionerId: sarah.id,
      },
      {
        date: dateOffset(-3),
        content: "Group therapy session. Worked on social communication skills with peer group. Client demonstrated improved turn-taking and topic maintenance. Continue weekly group sessions.",
        template: "Progress Note",
        signed: false,
        clientId: clients[7].id,
        practitionerId: emma.id,
      },
      {
        date: today,
        content: "Telehealth consultation for NDIS plan review. Discussed goals for independent living skills. Updated therapy plan for next quarter. Report to be submitted.",
        template: "NDIS Progress Note",
        signed: false,
        clientId: clients[11].id,
        practitionerId: james.id,
      },
    ];

    for (const note of clinicalNoteData) {
      await prisma.clinicalNote.create({ data: note });
    }

    // ─── INVOICES (12) with INVOICE ITEMS ────────────────────────────

    const invoiceData = [
      {
        invoiceNumber: "INV-001",
        date: dateOffset(-13),
        dueDate: dateOffset(17),
        status: "Paid",
        billingType: "Medicare",
        clientId: clients[0].id,
        items: [
          { description: "Initial Assessment - Physiotherapy (60 min)", quantity: 1, unitPrice: 150.00 },
        ],
      },
      {
        invoiceNumber: "INV-002",
        date: dateOffset(-11),
        dueDate: dateOffset(19),
        status: "Paid",
        billingType: "NDIS",
        clientId: clients[1].id,
        items: [
          { description: "Initial Assessment - Occupational Therapy (60 min)", quantity: 1, unitPrice: 193.99 },
          { description: "NDIS Report Writing", quantity: 1, unitPrice: 87.45 },
        ],
      },
      {
        invoiceNumber: "INV-003",
        date: dateOffset(-10),
        dueDate: dateOffset(-3),
        status: "Overdue",
        billingType: "NDIS",
        clientId: clients[3].id,
        items: [
          { description: "Follow Up Session - Speech Pathology (30 min)", quantity: 1, unitPrice: 128.80 },
        ],
      },
      {
        invoiceNumber: "INV-004",
        date: dateOffset(-9),
        dueDate: dateOffset(21),
        status: "Paid",
        billingType: "Private",
        clientId: clients[5].id,
        items: [
          { description: "Initial Assessment - Psychology (60 min)", quantity: 1, unitPrice: 220.00 },
        ],
      },
      {
        invoiceNumber: "INV-005",
        date: dateOffset(-7),
        dueDate: dateOffset(23),
        status: "Paid",
        billingType: "Medicare",
        clientId: clients[7].id,
        items: [
          { description: "Initial Assessment - Dietitian (60 min)", quantity: 1, unitPrice: 130.00 },
        ],
      },
      {
        invoiceNumber: "INV-006",
        date: dateOffset(-5),
        dueDate: dateOffset(-1),
        status: "Overdue",
        billingType: "NDIS",
        clientId: clients[6].id,
        items: [
          { description: "Review Session - Occupational Therapy (60 min)", quantity: 1, unitPrice: 193.99 },
          { description: "NDIS Plan Review Report", quantity: 1, unitPrice: 140.00 },
        ],
      },
      {
        invoiceNumber: "INV-007",
        date: dateOffset(-4),
        dueDate: dateOffset(26),
        status: "Partially Paid",
        billingType: "Private",
        clientId: clients[8].id,
        items: [
          { description: "Initial Assessment - Exercise Physiology (60 min)", quantity: 1, unitPrice: 120.00 },
          { description: "Exercise Program Design", quantity: 1, unitPrice: 80.00 },
        ],
      },
      {
        invoiceNumber: "INV-008",
        date: dateOffset(-3),
        dueDate: dateOffset(27),
        status: "Paid",
        billingType: "Medicare",
        clientId: clients[0].id,
        items: [
          { description: "Follow Up Session - Physiotherapy (30 min)", quantity: 1, unitPrice: 95.00 },
        ],
      },
      {
        invoiceNumber: "INV-009",
        date: dateOffset(-1),
        dueDate: dateOffset(29),
        status: "Draft",
        billingType: "Medicare",
        clientId: clients[2].id,
        items: [
          { description: "Follow Up Session - Physiotherapy (45 min)", quantity: 1, unitPrice: 120.00 },
          { description: "Therapeutic Ultrasound", quantity: 2, unitPrice: 25.00 },
        ],
      },
      {
        invoiceNumber: "INV-010",
        date: today,
        dueDate: dateOffset(30),
        status: "Draft",
        billingType: "Medicare",
        clientId: clients[0].id,
        items: [
          { description: "Follow Up Session - Physiotherapy (45 min)", quantity: 1, unitPrice: 120.00 },
        ],
      },
      {
        invoiceNumber: "INV-011",
        date: today,
        dueDate: dateOffset(30),
        status: "Draft",
        billingType: "Private",
        clientId: clients[5].id,
        items: [
          { description: "Follow Up Session - Psychology (50 min)", quantity: 1, unitPrice: 180.00 },
        ],
      },
      {
        invoiceNumber: "INV-012",
        date: dateOffset(-7),
        dueDate: dateOffset(-2),
        status: "Overdue",
        billingType: "Private",
        clientId: clients[4].id,
        items: [
          { description: "Follow Up Session - Physiotherapy (30 min)", quantity: 1, unitPrice: 95.00 },
          { description: "Dry Needling", quantity: 3, unitPrice: 30.00 },
        ],
      },
    ];

    for (const inv of invoiceData) {
      const { items, ...invoiceFields } = inv;
      const computedItems = items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      }));
      const subtotal = computedItems.reduce((sum, i) => sum + i.total, 0);

      await prisma.invoice.create({
        data: {
          ...invoiceFields,
          subtotal,
          tax: 0,
          total: subtotal,
          items: {
            create: computedItems,
          },
        },
      });
    }

    // ─── SUMMARY ─────────────────────────────────────────────────────

    return NextResponse.json({
      message: "Database seeded successfully!",
      counts: {
        practitioners: practitioners.length,
        clients: clients.length,
        appointments: appointmentData.length,
        clinicalNotes: clinicalNoteData.length,
        invoices: invoiceData.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
