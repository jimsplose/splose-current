import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Practitioners (15) ───────────────────────────────────────────────────
  const practitioners = await Promise.all([
    // Original 5
    prisma.practitioner.create({ data: { name: "Sarah Chen", email: "sarah.chen@splose.demo", phone: "0412 345 678", role: "Senior Physiotherapist", specialty: "Musculoskeletal", color: "#6366f1" } }),
    prisma.practitioner.create({ data: { name: "James Wilson", email: "james.wilson@splose.demo", phone: "0423 456 789", role: "Occupational Therapist", specialty: "Paediatric OT", color: "#8b5cf6" } }),
    prisma.practitioner.create({ data: { name: "Emma Thompson", email: "emma.thompson@splose.demo", phone: "0434 567 890", role: "Speech Pathologist", specialty: "Fluency Disorders", color: "#ec4899" } }),
    prisma.practitioner.create({ data: { name: "Rachel Kim", email: "rachel.kim@splose.demo", phone: "0445 678 901", role: "Psychologist", specialty: "CBT & Anxiety", color: "#f59e0b" } }),
    prisma.practitioner.create({ data: { name: "Marcus Chen", email: "marcus.chen@splose.demo", phone: "0456 789 012", role: "Exercise Physiologist", specialty: "Chronic Pain", color: "#06b6d4" } }),
    // New batch 2
    prisma.practitioner.create({ data: { name: "Priya Sharma", email: "priya.sharma@splose.demo", phone: "0467 890 123", role: "Physiotherapist", specialty: "Sports Injuries", color: "#10b981" } }),
    prisma.practitioner.create({ data: { name: "Daniel O'Brien", email: "daniel.obrien@splose.demo", phone: "0478 901 234", role: "Psychologist", specialty: "Trauma & PTSD", color: "#f97316" } }),
    prisma.practitioner.create({ data: { name: "Mei Lin", email: "mei.lin@splose.demo", phone: "0489 012 345", role: "Speech Pathologist", specialty: "Paediatric Language", color: "#a855f7" } }),
    prisma.practitioner.create({ data: { name: "Ben Torres", email: "ben.torres@splose.demo", phone: "0490 123 456", role: "Occupational Therapist", specialty: "Hand Therapy", color: "#14b8a6" } }),
    prisma.practitioner.create({ data: { name: "Zara Patel", email: "zara.patel@splose.demo", phone: "0401 234 567", role: "Dietitian", specialty: "Paediatric Nutrition", color: "#e11d48" } }),
    // New batch 3
    prisma.practitioner.create({ data: { name: "Liam Fletcher", email: "liam.fletcher@splose.demo", phone: "0412 345 098", role: "Physiotherapist", specialty: "Neurological Rehab", color: "#7c3aed" } }),
    prisma.practitioner.create({ data: { name: "Grace Nakamura", email: "grace.nakamura@splose.demo", phone: "0423 456 109", role: "Psychologist", specialty: "Child & Adolescent", color: "#db2777" } }),
    prisma.practitioner.create({ data: { name: "Sam Cooper", email: "sam.cooper@splose.demo", phone: "0434 567 210", role: "Exercise Physiologist", specialty: "Cardiac Rehab", color: "#0891b2" } }),
    prisma.practitioner.create({ data: { name: "Aisha Mohamed", email: "aisha.mohamed@splose.demo", phone: "0445 678 321", role: "Occupational Therapist", specialty: "Workplace Ergonomics", color: "#059669" } }),
    prisma.practitioner.create({ data: { name: "Tom Whitfield", email: "tom.whitfield@splose.demo", phone: "0456 789 432", role: "Speech Pathologist", specialty: "Voice Disorders", color: "#d97706" } }),
  ]);

  const [sarah, james, emma, rachel, marcus, priya, daniel, mei, ben, zara, liam, grace, sam, aisha, tom] = practitioners;

  // ── Clients (36) ─────────────────────────────────────────────────────────
  const clients = await Promise.all([
    // Original 12
    prisma.client.create({ data: { firstName: "Michael", lastName: "Brooks", email: "michael.brooks@email.com", phone: "0401 111 222", dateOfBirth: "1985-03-15", address: "42 Park Avenue, Melbourne VIC 3000", medicare: "2345 67890 1" } }),
    prisma.client.create({ data: { firstName: "Lisa", lastName: "Martinez", email: "lisa.martinez@email.com", phone: "0402 222 333", dateOfBirth: "1992-07-22", address: "15 Ocean Drive, St Kilda VIC 3182", ndisNumber: "431234567" } }),
    prisma.client.create({ data: { firstName: "Tom", lastName: "Nguyen", email: "tom.nguyen@email.com", phone: "0403 333 444", dateOfBirth: "1978-11-08", address: "88 Collins Street, Melbourne VIC 3000", medicare: "3456 78901 2" } }),
    prisma.client.create({ data: { firstName: "Sophie", lastName: "Anderson", email: "sophie.anderson@email.com", phone: "0404 444 555", dateOfBirth: "2018-02-14", address: "7 Elm Court, Richmond VIC 3121", ndisNumber: "431987654" } }),
    prisma.client.create({ data: { firstName: "David", lastName: "Park", email: "david.park@email.com", phone: "0405 555 666", dateOfBirth: "1965-09-30", address: "120 High Street, Prahran VIC 3181", medicare: "4567 89012 3" } }),
    prisma.client.create({ data: { firstName: "Jenny", lastName: "Jenkins", email: "jenny.j@email.com", phone: "0406 666 777", dateOfBirth: "2002-02-02", address: "55 King William St, Adelaide SA 5000", medicare: "5678 90123 4" } }),
    prisma.client.create({ data: { firstName: "Harry", lastName: "James", email: "harry.james@email.com", phone: "0407 777 888", dateOfBirth: "1985-07-05", address: "8 Rundle Mall, Adelaide SA 5000", ndisNumber: "432345678" } }),
    prisma.client.create({ data: { firstName: "Ella", lastName: "Thompson", email: "ella.t@email.com", phone: "0408 888 999", dateOfBirth: "2015-02-18", address: "22 Henley Beach Rd, Adelaide SA 5000", ndisNumber: "432456789" } }),
    prisma.client.create({ data: { firstName: "Oliver", lastName: "Wilson", email: "oliver.w@email.com", phone: "0409 999 000", dateOfBirth: "1990-04-12", address: "15 Morphett St, Adelaide SA 5000", medicare: "6789 01234 5" } }),
    prisma.client.create({ data: { firstName: "Charlotte", lastName: "Brown", email: "charlotte.b@email.com", phone: "0410 000 111", dateOfBirth: "1975-12-25", address: "30 Hutt St, Adelaide SA 5000" } }),
    prisma.client.create({ data: { firstName: "William", lastName: "Taylor", email: "william.t@email.com", phone: "0411 111 222", dateOfBirth: "2010-08-19", address: "44 Prospect Rd, Adelaide SA 5000", ndisNumber: "432567890" } }),
    prisma.client.create({ data: { firstName: "Amelia", lastName: "Davis", email: "amelia.d@email.com", phone: "0412 222 333", dateOfBirth: "1998-06-30", address: "12 The Parade, Adelaide SA 5000", medicare: "7890 12345 6" } }),
    // New batch 2 (clients 12-23)
    prisma.client.create({ data: { firstName: "Raj", lastName: "Kapoor", email: "raj.kapoor@email.com", phone: "0413 333 444", dateOfBirth: "1982-01-20", address: "56 Swanston St, Melbourne VIC 3000", medicare: "8901 23456 7" } }),
    prisma.client.create({ data: { firstName: "Fiona", lastName: "McAllister", email: "fiona.mc@email.com", phone: "0414 444 555", dateOfBirth: "1995-05-11", address: "23 Lygon St, Carlton VIC 3053", ndisNumber: "432678901" } }),
    prisma.client.create({ data: { firstName: "Noah", lastName: "Campbell", email: "noah.c@email.com", phone: "0415 555 666", dateOfBirth: "2016-09-03", address: "9 Beach Rd, Sandringham VIC 3191", ndisNumber: "432789012" } }),
    prisma.client.create({ data: { firstName: "Grace", lastName: "Wong", email: "grace.wong@email.com", phone: "0416 666 777", dateOfBirth: "1970-04-28", address: "71 Burke Rd, Camberwell VIC 3124", medicare: "9012 34567 8" } }),
    prisma.client.create({ data: { firstName: "Ethan", lastName: "Murray", email: "ethan.m@email.com", phone: "0417 777 888", dateOfBirth: "1988-12-07", address: "140 Flinders St, Melbourne VIC 3000", medicare: "0123 45678 9" } }),
    prisma.client.create({ data: { firstName: "Isla", lastName: "Robertson", email: "isla.r@email.com", phone: "0418 888 999", dateOfBirth: "2019-03-22", address: "5 Albert Rd, South Melbourne VIC 3205", ndisNumber: "432890123" } }),
    prisma.client.create({ data: { firstName: "Lucas", lastName: "Phillips", email: "lucas.p@email.com", phone: "0419 999 000", dateOfBirth: "1957-08-14", address: "88 Toorak Rd, South Yarra VIC 3141", medicare: "1234 56789 0" } }),
    prisma.client.create({ data: { firstName: "Mia", lastName: "Santos", email: "mia.santos@email.com", phone: "0420 000 111", dateOfBirth: "2000-11-30", address: "34 Chapel St, Windsor VIC 3181" } }),
    prisma.client.create({ data: { firstName: "Jack", lastName: "Henderson", email: "jack.h@email.com", phone: "0421 111 222", dateOfBirth: "2008-06-15", address: "17 Glenferrie Rd, Hawthorn VIC 3122", ndisNumber: "432901234" } }),
    prisma.client.create({ data: { firstName: "Chloe", lastName: "Mitchell", email: "chloe.m@email.com", phone: "0422 222 333", dateOfBirth: "1993-02-09", address: "62 Sydney Rd, Brunswick VIC 3056", medicare: "2345 67890 2" } }),
    prisma.client.create({ data: { firstName: "Oscar", lastName: "Hall", email: "oscar.h@email.com", phone: "0423 333 444", dateOfBirth: "1980-10-17", address: "101 Victoria St, Footscray VIC 3011", medicare: "3456 78901 3" } }),
    prisma.client.create({ data: { firstName: "Ruby", lastName: "Sullivan", email: "ruby.s@email.com", phone: "0424 444 555", dateOfBirth: "2013-07-25", address: "28 Station St, Box Hill VIC 3128", ndisNumber: "433012345" } }),
    // New batch 3 (clients 24-35)
    prisma.client.create({ data: { firstName: "Aiden", lastName: "Fitzgerald", email: "aiden.f@email.com", phone: "0425 555 666", dateOfBirth: "1973-03-08", address: "45 King St, Sydney NSW 2000", medicare: "4567 89012 4" } }),
    prisma.client.create({ data: { firstName: "Sienna", lastName: "Blake", email: "sienna.b@email.com", phone: "0426 666 777", dateOfBirth: "1991-09-19", address: "12 Bondi Rd, Bondi NSW 2026", ndisNumber: "433123456" } }),
    prisma.client.create({ data: { firstName: "Leo", lastName: "Dunn", email: "leo.dunn@email.com", phone: "0427 777 888", dateOfBirth: "2017-01-12", address: "3 George St, Parramatta NSW 2150", ndisNumber: "433234567" } }),
    prisma.client.create({ data: { firstName: "Hannah", lastName: "Pearce", email: "hannah.p@email.com", phone: "0428 888 999", dateOfBirth: "1968-06-04", address: "78 Pitt St, Sydney NSW 2000", medicare: "5678 90123 5" } }),
    prisma.client.create({ data: { firstName: "Archie", lastName: "Walsh", email: "archie.w@email.com", phone: "0429 999 000", dateOfBirth: "1986-11-21", address: "55 Oxford St, Darlinghurst NSW 2010", medicare: "6789 01234 6" } }),
    prisma.client.create({ data: { firstName: "Zoe", lastName: "Crawford", email: "zoe.c@email.com", phone: "0430 000 111", dateOfBirth: "2020-04-16", address: "9 Pittwater Rd, Manly NSW 2095", ndisNumber: "433345678" } }),
    prisma.client.create({ data: { firstName: "Max", lastName: "Barker", email: "max.barker@email.com", phone: "0431 111 222", dateOfBirth: "1955-12-02", address: "22 Military Rd, Neutral Bay NSW 2089", medicare: "7890 12345 7" } }),
    prisma.client.create({ data: { firstName: "Ivy", lastName: "Lawson", email: "ivy.l@email.com", phone: "0432 222 333", dateOfBirth: "2003-08-08", address: "41 Crown St, Surry Hills NSW 2010" } }),
    prisma.client.create({ data: { firstName: "Charlie", lastName: "Reid", email: "charlie.r@email.com", phone: "0433 333 444", dateOfBirth: "2011-05-29", address: "67 Norton St, Leichhardt NSW 2040", ndisNumber: "433456789" } }),
    prisma.client.create({ data: { firstName: "Poppy", lastName: "Dixon", email: "poppy.d@email.com", phone: "0434 444 555", dateOfBirth: "1997-02-14", address: "14 Darling Dr, Pyrmont NSW 2009", medicare: "8901 23456 8" } }),
    prisma.client.create({ data: { firstName: "Finn", lastName: "Douglas", email: "finn.d@email.com", phone: "0435 555 666", dateOfBirth: "1979-07-30", address: "90 Cleveland St, Redfern NSW 2016", medicare: "9012 34567 9" } }),
    prisma.client.create({ data: { firstName: "Matilda", lastName: "Spencer", email: "matilda.s@email.com", phone: "0436 666 777", dateOfBirth: "2014-10-05", address: "36 Victoria Rd, Gladesville NSW 2111", ndisNumber: "433567890" } }),
  ]);

  // ── Appointments ─────────────────────────────────────────────────────────
  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const addDays = (days: number) => new Date(today.getTime() + days * 86400000);

  function nextDow(startDate: Date, dow: number): Date {
    const d = new Date(startDate);
    const diff = (dow - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + (diff === 0 ? 0 : diff));
    return d;
  }

  const year = today.getFullYear();
  const month = today.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  const appointments: Array<{
    date: string; startTime: string; endTime: string;
    clientId: string; practitionerId: string; status: string; type: string;
  }> = [];

  // ── Recurring weekly patterns ──

  // Every Monday: Emma (speech) + Priya (physio) + Mei (speech)
  let mon = nextDow(firstOfMonth, 1);
  while (mon <= lastOfMonth) {
    const dateStr = formatDate(mon);
    const isPast = mon < today;
    appointments.push(
      { date: dateStr, startTime: "10:30", endTime: "11:15", clientId: clients[0].id, practitionerId: emma.id, status: isPast ? "Completed" : "Scheduled", type: "OT - Initial Consult" },
      { date: dateStr, startTime: "14:30", endTime: "15:15", clientId: clients[6].id, practitionerId: emma.id, status: isPast ? "Cancelled" : "Scheduled", type: "Follow Up" },
      { date: dateStr, startTime: "09:00", endTime: "09:45", clientId: clients[12].id, practitionerId: priya.id, status: isPast ? "Completed" : "Scheduled", type: "Sports Injury Review" },
      { date: dateStr, startTime: "11:30", endTime: "12:15", clientId: clients[14].id, practitionerId: mei.id, status: isPast ? "Completed" : "Scheduled", type: "Language Assessment" },
      { date: dateStr, startTime: "15:30", endTime: "16:15", clientId: clients[24].id, practitionerId: priya.id, status: isPast ? "Completed" : "Scheduled", type: "Standard Consultation" },
    );
    mon = new Date(mon.getTime() + 7 * 86400000);
  }

  // Every Tuesday: Rachel (group) + Daniel (psychology) + Zara (dietitian)
  let tue = nextDow(firstOfMonth, 2);
  while (tue <= lastOfMonth) {
    const dateStr = formatDate(tue);
    const isPast = tue < today;
    appointments.push(
      { date: dateStr, startTime: "12:45", endTime: "13:40", clientId: clients[3].id, practitionerId: rachel.id, status: isPast ? "Completed" : "Scheduled", type: "Group Session" },
      { date: dateStr, startTime: "09:30", endTime: "10:30", clientId: clients[16].id, practitionerId: daniel.id, status: isPast ? "Completed" : "Scheduled", type: "Trauma Therapy" },
      { date: dateStr, startTime: "14:00", endTime: "14:45", clientId: clients[17].id, practitionerId: zara.id, status: isPast ? "Completed" : "Scheduled", type: "Nutrition Review" },
      { date: dateStr, startTime: "11:00", endTime: "11:45", clientId: clients[25].id, practitionerId: daniel.id, status: isPast ? "Completed" : "Scheduled", type: "Follow Up" },
    );
    tue = new Date(tue.getTime() + 7 * 86400000);
  }

  // Every Wednesday: Rachel (group) + Ben (hand therapy) + Liam (neuro rehab) + Grace (child psych)
  let wed = nextDow(firstOfMonth, 3);
  while (wed <= lastOfMonth) {
    const dateStr = formatDate(wed);
    const isPast = wed < today;
    appointments.push(
      { date: dateStr, startTime: "13:30", endTime: "14:25", clientId: clients[1].id, practitionerId: rachel.id, status: isPast ? "Completed" : "Scheduled", type: "Group Session" },
      { date: dateStr, startTime: "09:00", endTime: "09:45", clientId: clients[18].id, practitionerId: ben.id, status: isPast ? "Completed" : "Scheduled", type: "Hand Therapy" },
      { date: dateStr, startTime: "10:30", endTime: "11:30", clientId: clients[30].id, practitionerId: liam.id, status: isPast ? "Completed" : "Scheduled", type: "Neuro Rehab Session" },
      { date: dateStr, startTime: "14:30", endTime: "15:15", clientId: clients[23].id, practitionerId: grace.id, status: isPast ? "Completed" : "Scheduled", type: "Child Psychology" },
      { date: dateStr, startTime: "15:30", endTime: "16:15", clientId: clients[26].id, practitionerId: ben.id, status: isPast ? "Cancelled" : "Scheduled", type: "Follow Up" },
    );
    wed = new Date(wed.getTime() + 7 * 86400000);
  }

  // Every other Thursday: Sarah + Rachel + Sam (cardiac) + Aisha (ergonomics)
  let thu = nextDow(firstOfMonth, 4);
  let thuCount = 0;
  while (thu <= lastOfMonth) {
    if (thuCount % 2 === 1) {
      const dateStr = formatDate(thu);
      const isPast = thu < today;
      appointments.push(
        { date: dateStr, startTime: "09:30", endTime: "10:15", clientId: clients[2].id, practitionerId: sarah.id, status: isPast ? "Completed" : "Scheduled", type: "Standard Consultation" },
        { date: dateStr, startTime: "12:30", endTime: "13:15", clientId: clients[4].id, practitionerId: rachel.id, status: isPast ? "Completed" : "Scheduled", type: "Initial Assessment" },
        { date: dateStr, startTime: "10:30", endTime: "11:15", clientId: clients[15].id, practitionerId: sam.id, status: isPast ? "Completed" : "Scheduled", type: "Cardiac Rehab" },
        { date: dateStr, startTime: "14:00", endTime: "14:45", clientId: clients[28].id, practitionerId: aisha.id, status: isPast ? "Completed" : "Scheduled", type: "Ergonomic Assessment" },
      );
    }
    thu = new Date(thu.getTime() + 7 * 86400000);
    thuCount++;
  }

  // Every Friday: Tom (voice) + Marcus + James
  let fri = nextDow(firstOfMonth, 5);
  while (fri <= lastOfMonth) {
    const dateStr = formatDate(fri);
    const isPast = fri < today;
    appointments.push(
      { date: dateStr, startTime: "09:00", endTime: "09:45", clientId: clients[21].id, practitionerId: tom.id, status: isPast ? "Completed" : "Scheduled", type: "Voice Therapy" },
      { date: dateStr, startTime: "10:00", endTime: "10:45", clientId: clients[34].id, practitionerId: marcus.id, status: isPast ? "Completed" : "Scheduled", type: "Exercise Review" },
      { date: dateStr, startTime: "13:00", endTime: "13:45", clientId: clients[20].id, practitionerId: james.id, status: isPast ? "Completed" : "Scheduled", type: "OT Assessment" },
    );
    fri = new Date(fri.getTime() + 7 * 86400000);
  }

  // Next month Friday
  const nextMonthFri = nextDow(new Date(year, month + 1, 1), 5);
  appointments.push(
    { date: formatDate(nextMonthFri), startTime: "09:30", endTime: "10:15", clientId: clients[8].id, practitionerId: marcus.id, status: "Scheduled", type: "Review" },
  );

  // Today-specific appointments for week/day view variety
  appointments.push(
    { date: formatDate(today), startTime: "09:00", endTime: "09:45", clientId: clients[5].id, practitionerId: sarah.id, status: "Completed", type: "Initial Assessment" },
    { date: formatDate(today), startTime: "11:00", endTime: "11:45", clientId: clients[7].id, practitionerId: james.id, status: "Scheduled", type: "Standard" },
    { date: formatDate(today), startTime: "14:00", endTime: "14:45", clientId: clients[9].id, practitionerId: rachel.id, status: "Cancelled", type: "Follow Up" },
    { date: formatDate(today), startTime: "08:30", endTime: "09:15", clientId: clients[13].id, practitionerId: priya.id, status: "Completed", type: "Sports Injury Review" },
    { date: formatDate(today), startTime: "10:00", endTime: "10:45", clientId: clients[19].id, practitionerId: daniel.id, status: "Scheduled", type: "Initial Assessment" },
    { date: formatDate(today), startTime: "12:00", endTime: "12:45", clientId: clients[22].id, practitionerId: liam.id, status: "Scheduled", type: "Neuro Follow Up" },
    { date: formatDate(today), startTime: "15:00", endTime: "15:45", clientId: clients[27].id, practitionerId: grace.id, status: "Scheduled", type: "Child Psychology" },
    { date: formatDate(today), startTime: "16:00", endTime: "16:45", clientId: clients[31].id, practitionerId: aisha.id, status: "Scheduled", type: "Workplace Assessment" },
    { date: formatDate(today), startTime: "13:30", endTime: "14:15", clientId: clients[33].id, practitionerId: tom.id, status: "Scheduled", type: "Voice Therapy" },
    // Tomorrow
    { date: formatDate(addDays(1)), startTime: "09:00", endTime: "09:45", clientId: clients[10].id, practitionerId: james.id, status: "Scheduled", type: "Follow Up" },
    { date: formatDate(addDays(1)), startTime: "13:00", endTime: "13:45", clientId: clients[11].id, practitionerId: marcus.id, status: "Scheduled", type: "Standard" },
    { date: formatDate(addDays(1)), startTime: "10:00", endTime: "10:45", clientId: clients[29].id, practitionerId: mei.id, status: "Scheduled", type: "Language Therapy" },
    { date: formatDate(addDays(1)), startTime: "14:00", endTime: "14:45", clientId: clients[32].id, practitionerId: sam.id, status: "Scheduled", type: "Cardiac Rehab" },
    { date: formatDate(addDays(1)), startTime: "11:00", endTime: "11:45", clientId: clients[35].id, practitionerId: zara.id, status: "Scheduled", type: "Nutrition Plan" },
    // Yesterday
    { date: formatDate(addDays(-1)), startTime: "10:00", endTime: "10:45", clientId: clients[2].id, practitionerId: james.id, status: "Completed", type: "Standard" },
    { date: formatDate(addDays(-1)), startTime: "15:00", endTime: "15:45", clientId: clients[8].id, practitionerId: marcus.id, status: "Completed", type: "Initial Assessment" },
    { date: formatDate(addDays(-1)), startTime: "09:00", endTime: "09:45", clientId: clients[15].id, practitionerId: ben.id, status: "Completed", type: "Hand Therapy" },
    { date: formatDate(addDays(-1)), startTime: "11:30", endTime: "12:15", clientId: clients[25].id, practitionerId: grace.id, status: "Completed", type: "Child Psychology" },
    { date: formatDate(addDays(-1)), startTime: "14:00", endTime: "14:45", clientId: clients[34].id, practitionerId: tom.id, status: "Completed", type: "Voice Therapy" },
  );

  for (const appt of appointments) {
    await prisma.appointment.create({ data: appt });
  }

  // ── Clinical Notes (36 total -- 15 unsigned for dashboard variety) ──────
  const clinicalNotes = [
    // Original 12
    { date: formatDate(today), content: "Patient presents with lower back pain following lifting injury at work. Pain rated 6/10. Limited flexion. Prescribed exercise program and manual therapy. Review in 1 week.", template: "Progress Note", signed: true, clientId: clients[0].id, practitionerId: sarah.id },
    { date: formatDate(today), content: "NDIS participant. Continued work on fine motor skills and daily living activities. Good progress with dressing tasks. Next session: kitchen safety assessment.", template: "NDIS Progress Note", signed: false, clientId: clients[1].id, practitionerId: james.id },
    { date: formatDate(today), content: "Speech therapy session focused on fluency techniques. Client demonstrated improved breath control and pausing strategies. Homework: daily reading practice with controlled rate.", template: "Progress Note", signed: true, clientId: clients[3].id, practitionerId: emma.id },
    { date: formatDate(addDays(-1)), content: "Initial assessment for right shoulder pain. ROM limited in abduction and flexion. Strength 4/5. Referred for imaging. Treatment plan: manual therapy and progressive exercises.", template: "Initial Assessment", signed: true, clientId: clients[5].id, practitionerId: sarah.id },
    { date: formatDate(addDays(-1)), content: "NDIS plan review preparation. Updated goals for community access and social skills. Recommend increase in OT support hours for next plan period.", template: "NDIS Progress Note", signed: false, clientId: clients[6].id, practitionerId: james.id },
    { date: formatDate(today), content: "CBT session addressing generalised anxiety. Explored cognitive distortions and introduced thought challenging worksheet. Client engaged well and completed in-session exercises. Homework: daily thought record.", template: "Progress Note", signed: true, clientId: clients[5].id, practitionerId: rachel.id },
    { date: formatDate(addDays(-1)), content: "Exercise physiology initial consult. Assessed baseline fitness and functional capacity. Chronic lower back pain with sedentary lifestyle. Developed 6-week progressive exercise program focusing on core stability and aerobic conditioning.", template: "Initial Assessment", signed: true, clientId: clients[10].id, practitionerId: marcus.id },
    { date: formatDate(today), content: "Follow-up session for anxiety management. Client reports reduced frequency of panic attacks since starting breathing exercises. Introduced graded exposure hierarchy for social situations. Good compliance with homework.", template: "Progress Note", signed: false, clientId: clients[9].id, practitionerId: rachel.id },
    { date: formatDate(addDays(-2)), content: "Home visit assessment. Reviewed home environment for falls risk. Recommended grab rails in bathroom and non-slip mats. Client agreeable to modifications.", template: "Progress Note", signed: false, clientId: clients[4].id, practitionerId: sarah.id },
    { date: formatDate(addDays(-3)), content: "Group therapy session. Worked on social communication skills with peer group. Client demonstrated improved turn-taking and topic maintenance.", template: "Progress Note", signed: false, clientId: clients[7].id, practitionerId: emma.id },
    { date: formatDate(today), content: "Telehealth consultation for NDIS plan review. Discussed goals for independent living skills. Updated therapy plan for next quarter.", template: "NDIS Progress Note", signed: false, clientId: clients[11].id, practitionerId: james.id },
    { date: formatDate(addDays(-1)), content: "Standard consultation — Reviewed exercise compliance. Client reports 80% adherence to home program. Progressed resistance exercises. Next review in 2 weeks.", template: "Progress Note", signed: true, clientId: clients[2].id, practitionerId: marcus.id },
    // New batch 2 (notes 12-23)
    { date: formatDate(today), content: "Sports injury follow-up. Right ACL reconstruction 8 weeks post-op. Good quad activation, knee flexion improving to 110 degrees. Progressed to closed-chain exercises and stationary cycling. Return to jogging target: 12 weeks.", template: "Progress Note", signed: true, clientId: clients[12].id, practitionerId: priya.id },
    { date: formatDate(addDays(-1)), content: "NDIS participant. Sensory processing assessment completed. Significant tactile defensiveness and auditory sensitivity. Recommended sensory diet and environmental modifications for school. Report to be provided to NDIA.", template: "NDIS Progress Note", signed: false, clientId: clients[13].id, practitionerId: ben.id },
    { date: formatDate(today), content: "Paediatric language assessment. Receptive language within normal limits. Expressive language delay of approximately 12 months. Difficulty with sentence formulation and narrative skills. Recommend weekly therapy sessions.", template: "Initial Assessment", signed: true, clientId: clients[14].id, practitionerId: mei.id },
    { date: formatDate(addDays(-2)), content: "Cardiac rehabilitation session. Completed treadmill and bike intervals at RPE 12-14. Blood pressure stable throughout. Heart rate recovery within normal limits. Progressing well through phase 2.", template: "Progress Note", signed: true, clientId: clients[15].id, practitionerId: sam.id },
    { date: formatDate(today), content: "EMDR session for motor vehicle accident trauma. Processing phase targeting intrusive memories. SUD reduced from 8 to 4 during session. Client tolerated bilateral stimulation well. Continue next session.", template: "Progress Note", signed: false, clientId: clients[16].id, practitionerId: daniel.id },
    { date: formatDate(addDays(-1)), content: "Paediatric nutrition review. Weight gain tracking positively. Introduced new food groups as per desensitisation protocol. Parents report reduced mealtime anxiety. Continue weekly food exposure hierarchy.", template: "Progress Note", signed: true, clientId: clients[17].id, practitionerId: zara.id },
    { date: formatDate(today), content: "Hand therapy post carpal tunnel release. Scar management with silicone and massage. Grip strength 15kg (target 25kg). Nerve gliding exercises prescribed. Return to light duties approved.", template: "Progress Note", signed: false, clientId: clients[18].id, practitionerId: ben.id },
    { date: formatDate(addDays(-3)), content: "Workplace ergonomic assessment. Identified poor monitor height, inadequate lumbar support, and static posture patterns. Provided sit-stand desk protocol and micro-break schedule. Report sent to employer.", template: "Assessment Report", signed: true, clientId: clients[28].id, practitionerId: aisha.id },
    { date: formatDate(today), content: "Child psychology session. Play-based therapy for anxiety and school refusal. Client engaged in sand tray narrative exploring friendship difficulties. Discussed coping strategies with parent post-session.", template: "Progress Note", signed: false, clientId: clients[23].id, practitionerId: grace.id },
    { date: formatDate(addDays(-1)), content: "Voice therapy for vocal nodules. Laryngeal massage and resonant voice exercises. Client demonstrating improved vocal hygiene awareness. Reduced vocal fry in conversational speech. Review with ENT in 4 weeks.", template: "Progress Note", signed: true, clientId: clients[21].id, practitionerId: tom.id },
    { date: formatDate(today), content: "Neurological rehabilitation session. Post-stroke upper limb retraining. Constraint-induced movement therapy protocol. Improved reach and grasp patterns. Client motivated and compliant with home program.", template: "Progress Note", signed: false, clientId: clients[30].id, practitionerId: liam.id },
    { date: formatDate(addDays(-2)), content: "OT assessment for NDIS mid-term review. Documented progress across all goal areas. Community access participation increased from 1 to 3 activities per week. Recommend maintaining current support level.", template: "NDIS Progress Note", signed: true, clientId: clients[20].id, practitionerId: james.id },
    // New batch 3 (notes 24-35)
    { date: formatDate(today), content: "Initial physiotherapy assessment. Chronic neck pain with cervicogenic headaches. Postural analysis reveals forward head posture and rounded shoulders. Commenced postural retraining and dry needling to upper trapezius. Home exercise program issued.", template: "Initial Assessment", signed: true, clientId: clients[24].id, practitionerId: priya.id },
    { date: formatDate(addDays(-1)), content: "NDIS goal review session. Client has achieved 2 of 4 short-term goals. Community access improving but independent travel remains challenging. Discussed strategies for bus training. Updated therapy plan.", template: "NDIS Progress Note", signed: false, clientId: clients[25].id, practitionerId: daniel.id },
    { date: formatDate(today), content: "Paediatric speech assessment. Phonological processes identified: cluster reduction, stopping, and fronting. Stimulability testing positive for target sounds. Recommend twice-weekly therapy block.", template: "Initial Assessment", signed: true, clientId: clients[26].id, practitionerId: mei.id },
    { date: formatDate(addDays(-2)), content: "Geriatric falls prevention assessment. Timed Up and Go: 14 seconds. Single leg stance: 8 seconds (target >10). Balance program prescribed including Tai Chi referral. Home modifications report to follow.", template: "Initial Assessment", signed: false, clientId: clients[27].id, practitionerId: sarah.id },
    { date: formatDate(today), content: "Psychology session for chronic pain management. Reviewed pain diary entries. Introduced acceptance and commitment therapy concepts. Client identified valued life directions impacted by pain. Homework: values clarification worksheet.", template: "Progress Note", signed: false, clientId: clients[28].id, practitionerId: rachel.id },
    { date: formatDate(addDays(-1)), content: "Paediatric feeding therapy session. Introduced new textures using SOS approach. Child accepted mashed banana (previously refused). No gagging episodes. Parent education on mealtime environment.", template: "Progress Note", signed: true, clientId: clients[29].id, practitionerId: zara.id },
    { date: formatDate(today), content: "Exercise physiology cardiac rehab session. Completed 30 min continuous cycling at 60% HRmax. Added upper limb circuit training. ECG monitoring stable throughout. Phase 3 transition discussed.", template: "Progress Note", signed: false, clientId: clients[30].id, practitionerId: sam.id },
    { date: formatDate(addDays(-3)), content: "Adolescent psychology session. Explored school-related anxiety triggers using CBT framework. Client completed worry tree exercise. Good insight into avoidance patterns. Parent session booked for next week.", template: "Progress Note", signed: true, clientId: clients[32].id, practitionerId: grace.id },
    { date: formatDate(today), content: "Hand therapy splint review. Custom thermoplastic resting splint adjusted for improved thumb positioning. Tendon gliding exercises progressed. Client reports reduced night pain since splint use.", template: "Progress Note", signed: false, clientId: clients[22].id, practitionerId: ben.id },
    { date: formatDate(addDays(-1)), content: "Voice therapy for transgender voice feminisation. Working on pitch elevation and resonance shift. Mean speaking fundamental frequency increased from 145Hz to 175Hz. Target range: 180-220Hz. Client practising daily.", template: "Progress Note", signed: true, clientId: clients[33].id, practitionerId: tom.id },
    { date: formatDate(today), content: "Workplace return-to-work assessment. Functional capacity evaluation completed. Client can sustain sedentary tasks for 4 hours with breaks. Graduated return plan developed in consultation with employer and GP.", template: "Assessment Report", signed: true, clientId: clients[34].id, practitionerId: aisha.id },
    { date: formatDate(addDays(-2)), content: "NDIS participant. Paediatric OT session targeting handwriting and scissors skills. Improved letter formation using Handwriting Without Tears program. Scissor accuracy 70% on straight lines. Home activities provided.", template: "NDIS Progress Note", signed: false, clientId: clients[35].id, practitionerId: james.id },
  ];

  for (const note of clinicalNotes) {
    await prisma.clinicalNote.create({ data: note });
  }

  // ── Invoices (36 total) ──────────────────────────────────────────────────
  const thirtyDaysLater = formatDate(addDays(30));
  const sevenDaysAgo = formatDate(addDays(-7));
  const twentyThreeDaysLater = formatDate(addDays(23));
  const yesterday = formatDate(addDays(-1));
  const fourteenDaysAgo = formatDate(addDays(-14));
  const twentyOneDaysAgo = formatDate(addDays(-21));
  const sixtyDaysLater = formatDate(addDays(60));

  const invoices = [
    // Original 12
    { invoiceNumber: "INV-001", date: formatDate(today), dueDate: thirtyDaysLater, status: "Sent", subtotal: 150.0, tax: 0, total: 150.0, billingType: "Medicare", clientId: clients[0].id, items: { create: [{ description: "Initial Physiotherapy Assessment (45 min)", quantity: 1, unitPrice: 150.0, total: 150.0 }] } },
    { invoiceNumber: "INV-002", date: formatDate(today), dueDate: thirtyDaysLater, status: "Draft", subtotal: 193.99, tax: 0, total: 193.99, billingType: "NDIS", clientId: clients[1].id, items: { create: [{ description: "OT Standard Consultation (45 min)", quantity: 1, unitPrice: 193.99, total: 193.99 }] } },
    { invoiceNumber: "INV-003", date: sevenDaysAgo, dueDate: twentyThreeDaysLater, status: "Paid", subtotal: 120.0, tax: 0, total: 120.0, billingType: "Private", clientId: clients[2].id, items: { create: [{ description: "Physiotherapy Follow Up (30 min)", quantity: 1, unitPrice: 120.0, total: 120.0 }] } },
    { invoiceNumber: "INV-004", date: sevenDaysAgo, dueDate: yesterday, status: "Overdue", subtotal: 148.71, tax: 0, total: 148.71, billingType: "Private", clientId: clients[4].id, items: { create: [{ description: "Physiotherapy Review (45 min)", quantity: 1, unitPrice: 148.71, total: 148.71 }] } },
    { invoiceNumber: "INV-005", date: yesterday, dueDate: thirtyDaysLater, status: "Sent", subtotal: 193.99, tax: 0, total: 193.99, billingType: "NDIS", clientId: clients[3].id, items: { create: [{ description: "Speech Pathology Standard (45 min)", quantity: 1, unitPrice: 193.99, total: 193.99 }] } },
    { invoiceNumber: "INV-006", date: yesterday, dueDate: thirtyDaysLater, status: "Draft", subtotal: 75.90, tax: 0, total: 75.90, billingType: "Private", clientId: clients[6].id, items: { create: [{ description: "OT Follow Up (30 min)", quantity: 1, unitPrice: 75.90, total: 75.90 }] } },
    { invoiceNumber: "INV-007", date: formatDate(today), dueDate: thirtyDaysLater, status: "Draft", subtotal: 75.00, tax: 0, total: 75.00, billingType: "Medicare", clientId: clients[5].id, items: { create: [{ description: "Physiotherapy Standard (30 min)", quantity: 1, unitPrice: 75.00, total: 75.00 }] } },
    { invoiceNumber: "INV-008", date: formatDate(today), dueDate: thirtyDaysLater, status: "Sent", subtotal: 220.00, tax: 0, total: 220.00, billingType: "Medicare", clientId: clients[8].id, items: { create: [{ description: "Psychology Initial Assessment (60 min)", quantity: 1, unitPrice: 180.00, total: 180.00 }, { description: "Psychological testing materials", quantity: 1, unitPrice: 40.00, total: 40.00 }] } },
    { invoiceNumber: "INV-009", date: fourteenDaysAgo, dueDate: sevenDaysAgo, status: "Overdue", subtotal: 193.99, tax: 0, total: 193.99, billingType: "NDIS", clientId: clients[7].id, items: { create: [{ description: "OT Standard Consultation (45 min)", quantity: 1, unitPrice: 150.00, total: 150.00 }, { description: "Sensory assessment kit", quantity: 1, unitPrice: 43.99, total: 43.99 }] } },
    { invoiceNumber: "INV-010", date: sevenDaysAgo, dueDate: twentyThreeDaysLater, status: "Paid", subtotal: 160.00, tax: 0, total: 160.00, billingType: "Private", clientId: clients[9].id, items: { create: [{ description: "Psychology Follow Up (50 min)", quantity: 1, unitPrice: 160.00, total: 160.00 }] } },
    { invoiceNumber: "INV-011", date: yesterday, dueDate: thirtyDaysLater, status: "Sent", subtotal: 287.98, tax: 0, total: 287.98, billingType: "NDIS", clientId: clients[10].id, items: { create: [{ description: "Exercise Physiology Initial Assessment (60 min)", quantity: 1, unitPrice: 193.99, total: 193.99 }, { description: "Home exercise program development", quantity: 1, unitPrice: 93.99, total: 93.99 }] } },
    { invoiceNumber: "INV-012", date: formatDate(today), dueDate: thirtyDaysLater, status: "Draft", subtotal: 130.00, tax: 0, total: 130.00, billingType: "Medicare", clientId: clients[11].id, items: { create: [{ description: "Exercise Physiology Follow Up (45 min)", quantity: 1, unitPrice: 130.00, total: 130.00 }] } },
    // New batch 2 (INV-013 to INV-024)
    { invoiceNumber: "INV-013", date: formatDate(today), dueDate: thirtyDaysLater, status: "Sent", subtotal: 150.00, tax: 0, total: 150.00, billingType: "Medicare", clientId: clients[12].id, items: { create: [{ description: "Physiotherapy Follow Up (45 min)", quantity: 1, unitPrice: 150.00, total: 150.00 }] } },
    { invoiceNumber: "INV-014", date: yesterday, dueDate: thirtyDaysLater, status: "Draft", subtotal: 193.99, tax: 0, total: 193.99, billingType: "NDIS", clientId: clients[13].id, items: { create: [{ description: "OT Sensory Assessment (60 min)", quantity: 1, unitPrice: 193.99, total: 193.99 }] } },
    { invoiceNumber: "INV-015", date: formatDate(today), dueDate: thirtyDaysLater, status: "Sent", subtotal: 193.99, tax: 0, total: 193.99, billingType: "NDIS", clientId: clients[14].id, items: { create: [{ description: "Speech Pathology Initial Assessment (60 min)", quantity: 1, unitPrice: 193.99, total: 193.99 }] } },
    { invoiceNumber: "INV-016", date: sevenDaysAgo, dueDate: twentyThreeDaysLater, status: "Paid", subtotal: 95.00, tax: 0, total: 95.00, billingType: "Medicare", clientId: clients[15].id, items: { create: [{ description: "Exercise Physiology Cardiac Rehab (45 min)", quantity: 1, unitPrice: 95.00, total: 95.00 }] } },
    { invoiceNumber: "INV-017", date: formatDate(today), dueDate: thirtyDaysLater, status: "Sent", subtotal: 240.00, tax: 0, total: 240.00, billingType: "Private", clientId: clients[16].id, items: { create: [{ description: "Psychology EMDR Session (60 min)", quantity: 1, unitPrice: 240.00, total: 240.00 }] } },
    { invoiceNumber: "INV-018", date: yesterday, dueDate: thirtyDaysLater, status: "Draft", subtotal: 120.00, tax: 0, total: 120.00, billingType: "Private", clientId: clients[17].id, items: { create: [{ description: "Dietitian Consultation (30 min)", quantity: 1, unitPrice: 120.00, total: 120.00 }] } },
    { invoiceNumber: "INV-019", date: fourteenDaysAgo, dueDate: yesterday, status: "Overdue", subtotal: 165.00, tax: 0, total: 165.00, billingType: "Private", clientId: clients[18].id, items: { create: [{ description: "Hand Therapy Session (45 min)", quantity: 1, unitPrice: 125.00, total: 125.00 }, { description: "Thermoplastic splint materials", quantity: 1, unitPrice: 40.00, total: 40.00 }] } },
    { invoiceNumber: "INV-020", date: sevenDaysAgo, dueDate: twentyThreeDaysLater, status: "Paid", subtotal: 193.99, tax: 0, total: 193.99, billingType: "NDIS", clientId: clients[20].id, items: { create: [{ description: "OT Community Access Session (45 min)", quantity: 1, unitPrice: 193.99, total: 193.99 }] } },
    { invoiceNumber: "INV-021", date: formatDate(today), dueDate: thirtyDaysLater, status: "Sent", subtotal: 150.00, tax: 0, total: 150.00, billingType: "Medicare", clientId: clients[21].id, items: { create: [{ description: "Speech Pathology Voice Therapy (45 min)", quantity: 1, unitPrice: 150.00, total: 150.00 }] } },
    { invoiceNumber: "INV-022", date: yesterday, dueDate: thirtyDaysLater, status: "Draft", subtotal: 125.00, tax: 0, total: 125.00, billingType: "Private", clientId: clients[22].id, items: { create: [{ description: "Hand Therapy Follow Up (30 min)", quantity: 1, unitPrice: 125.00, total: 125.00 }] } },
    { invoiceNumber: "INV-023", date: formatDate(today), dueDate: thirtyDaysLater, status: "Sent", subtotal: 210.00, tax: 0, total: 210.00, billingType: "Private", clientId: clients[23].id, items: { create: [{ description: "Child Psychology Session (50 min)", quantity: 1, unitPrice: 210.00, total: 210.00 }] } },
    { invoiceNumber: "INV-024", date: sevenDaysAgo, dueDate: twentyThreeDaysLater, status: "Paid", subtotal: 350.00, tax: 0, total: 350.00, billingType: "Private", clientId: clients[19].id, items: { create: [{ description: "Psychology Initial Assessment (90 min)", quantity: 1, unitPrice: 280.00, total: 280.00 }, { description: "Assessment report preparation", quantity: 1, unitPrice: 70.00, total: 70.00 }] } },
    // New batch 3 (INV-025 to INV-036)
    { invoiceNumber: "INV-025", date: formatDate(today), dueDate: thirtyDaysLater, status: "Sent", subtotal: 150.00, tax: 0, total: 150.00, billingType: "Medicare", clientId: clients[24].id, items: { create: [{ description: "Physiotherapy Initial Assessment (45 min)", quantity: 1, unitPrice: 150.00, total: 150.00 }] } },
    { invoiceNumber: "INV-026", date: yesterday, dueDate: thirtyDaysLater, status: "Draft", subtotal: 193.99, tax: 0, total: 193.99, billingType: "NDIS", clientId: clients[25].id, items: { create: [{ description: "Psychology NDIS Session (60 min)", quantity: 1, unitPrice: 193.99, total: 193.99 }] } },
    { invoiceNumber: "INV-027", date: formatDate(today), dueDate: thirtyDaysLater, status: "Sent", subtotal: 387.98, tax: 0, total: 387.98, billingType: "NDIS", clientId: clients[26].id, items: { create: [{ description: "Speech Pathology Assessment (60 min)", quantity: 1, unitPrice: 193.99, total: 193.99 }, { description: "Assessment report and recommendations", quantity: 1, unitPrice: 193.99, total: 193.99 }] } },
    { invoiceNumber: "INV-028", date: fourteenDaysAgo, dueDate: sevenDaysAgo, status: "Overdue", subtotal: 85.00, tax: 0, total: 85.00, billingType: "Medicare", clientId: clients[27].id, items: { create: [{ description: "Physiotherapy Falls Assessment (30 min)", quantity: 1, unitPrice: 85.00, total: 85.00 }] } },
    { invoiceNumber: "INV-029", date: formatDate(today), dueDate: thirtyDaysLater, status: "Sent", subtotal: 355.00, tax: 0, total: 355.00, billingType: "Private", clientId: clients[28].id, items: { create: [{ description: "Ergonomic Assessment (60 min)", quantity: 1, unitPrice: 220.00, total: 220.00 }, { description: "Workplace report preparation", quantity: 1, unitPrice: 135.00, total: 135.00 }] } },
    { invoiceNumber: "INV-030", date: sevenDaysAgo, dueDate: twentyThreeDaysLater, status: "Paid", subtotal: 120.00, tax: 0, total: 120.00, billingType: "Private", clientId: clients[29].id, items: { create: [{ description: "Dietitian Paediatric Feeding Session (30 min)", quantity: 1, unitPrice: 120.00, total: 120.00 }] } },
    { invoiceNumber: "INV-031", date: yesterday, dueDate: thirtyDaysLater, status: "Draft", subtotal: 193.99, tax: 0, total: 193.99, billingType: "NDIS", clientId: clients[30].id, items: { create: [{ description: "Physiotherapy Neuro Rehab (45 min)", quantity: 1, unitPrice: 193.99, total: 193.99 }] } },
    { invoiceNumber: "INV-032", date: formatDate(today), dueDate: thirtyDaysLater, status: "Sent", subtotal: 95.00, tax: 0, total: 95.00, billingType: "Medicare", clientId: clients[31].id, items: { create: [{ description: "Exercise Physiology Cardiac Session (45 min)", quantity: 1, unitPrice: 95.00, total: 95.00 }] } },
    { invoiceNumber: "INV-033", date: twentyOneDaysAgo, dueDate: sevenDaysAgo, status: "Overdue", subtotal: 210.00, tax: 0, total: 210.00, billingType: "Private", clientId: clients[32].id, items: { create: [{ description: "Child Psychology Initial Assessment (60 min)", quantity: 1, unitPrice: 210.00, total: 210.00 }] } },
    { invoiceNumber: "INV-034", date: formatDate(today), dueDate: thirtyDaysLater, status: "Sent", subtotal: 150.00, tax: 0, total: 150.00, billingType: "Medicare", clientId: clients[33].id, items: { create: [{ description: "Speech Pathology Voice Session (45 min)", quantity: 1, unitPrice: 150.00, total: 150.00 }] } },
    { invoiceNumber: "INV-035", date: sevenDaysAgo, dueDate: twentyThreeDaysLater, status: "Paid", subtotal: 440.00, tax: 0, total: 440.00, billingType: "Private", clientId: clients[34].id, items: { create: [{ description: "OT Workplace Assessment (90 min)", quantity: 1, unitPrice: 320.00, total: 320.00 }, { description: "Return to work plan", quantity: 1, unitPrice: 120.00, total: 120.00 }] } },
    { invoiceNumber: "INV-036", date: yesterday, dueDate: thirtyDaysLater, status: "Draft", subtotal: 193.99, tax: 0, total: 193.99, billingType: "NDIS", clientId: clients[35].id, items: { create: [{ description: "OT Paediatric Handwriting Session (45 min)", quantity: 1, unitPrice: 193.99, total: 193.99 }] } },
  ];

  for (const inv of invoices) {
    await prisma.invoice.create({ data: inv });
  }

  console.log("Seed data created successfully");
  console.log(`  ${practitioners.length} practitioners`);
  console.log(`  ${clients.length} clients`);
  console.log(`  ${appointments.length} appointments`);
  console.log(`  ${clinicalNotes.length} clinical notes`);
  console.log(`  ${invoices.length} invoices`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
