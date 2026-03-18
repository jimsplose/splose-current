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

    // Create practitioners (10)
    const practitioners = await Promise.all([
      prisma.practitioner.create({
        data: { name: "Sarah Chen", email: "sarah.chen@splose.demo", phone: "0412 345 678", role: "Senior Physiotherapist", specialty: "Musculoskeletal", color: "#6366f1" },
      }),
      prisma.practitioner.create({
        data: { name: "James Wilson", email: "james.wilson@splose.demo", phone: "0423 456 789", role: "Occupational Therapist", specialty: "Paediatric OT", color: "#8b5cf6" },
      }),
      prisma.practitioner.create({
        data: { name: "Emma Thompson", email: "emma.thompson@splose.demo", phone: "0434 567 890", role: "Speech Pathologist", specialty: "Fluency Disorders", color: "#ec4899" },
      }),
      prisma.practitioner.create({
        data: { name: "Rachel Kim", email: "rachel.kim@splose.demo", phone: "0445 678 901", role: "Psychologist", specialty: "CBT & Anxiety", color: "#f59e0b" },
      }),
      prisma.practitioner.create({
        data: { name: "Marcus Chen", email: "marcus.chen@splose.demo", phone: "0456 789 012", role: "Exercise Physiologist", specialty: "Chronic Pain", color: "#06b6d4" },
      }),
      prisma.practitioner.create({
        data: { name: "Priya Patel", email: "priya.patel@splose.demo", phone: "0467 890 123", role: "Physiotherapist", specialty: "Sports Injuries", color: "#10b981" },
      }),
      prisma.practitioner.create({
        data: { name: "Liam O'Brien", email: "liam.obrien@splose.demo", phone: "0478 901 234", role: "Occupational Therapist", specialty: "Hand Therapy", color: "#f97316" },
      }),
      prisma.practitioner.create({
        data: { name: "Nina Rodriguez", email: "nina.rodriguez@splose.demo", phone: "0489 012 345", role: "Speech Pathologist", specialty: "Paediatric Language", color: "#a855f7" },
      }),
      prisma.practitioner.create({
        data: { name: "Ben Harper", email: "ben.harper@splose.demo", phone: "0490 123 456", role: "Psychologist", specialty: "Trauma & PTSD", color: "#ef4444" },
      }),
      prisma.practitioner.create({
        data: { name: "Amy Nguyen", email: "amy.nguyen@splose.demo", phone: "0491 234 567", role: "Dietitian", specialty: "Paediatric Nutrition", color: "#84cc16" },
      }),
    ]);

    const [sarah, james, emma, rachel, marcus, priya, liam, nina, ben, amy] = practitioners;

    // Create clients (48)
    const clientData = [
      { firstName: "Michael", lastName: "Brooks", email: "michael.brooks@email.com", phone: "0401 111 222", dateOfBirth: "1985-03-15", address: "42 Park Avenue, Melbourne VIC 3000", medicare: "2345 67890 1" },
      { firstName: "Lisa", lastName: "Martinez", email: "lisa.martinez@email.com", phone: "0402 222 333", dateOfBirth: "1992-07-22", address: "15 Ocean Drive, St Kilda VIC 3182", ndisNumber: "431234567" },
      { firstName: "Tom", lastName: "Nguyen", email: "tom.nguyen@email.com", phone: "0403 333 444", dateOfBirth: "1978-11-08", address: "88 Collins Street, Melbourne VIC 3000", medicare: "3456 78901 2" },
      { firstName: "Sophie", lastName: "Anderson", email: "sophie.anderson@email.com", phone: "0404 444 555", dateOfBirth: "2018-02-14", address: "7 Elm Court, Richmond VIC 3121", ndisNumber: "431987654" },
      { firstName: "David", lastName: "Park", email: "david.park@email.com", phone: "0405 555 666", dateOfBirth: "1965-09-30", address: "120 High Street, Prahran VIC 3181", medicare: "4567 89012 3" },
      { firstName: "Jenny", lastName: "Jenkins", email: "jenny.j@email.com", phone: "0406 666 777", dateOfBirth: "2002-02-02", address: "55 King William St, Adelaide SA 5000", medicare: "5678 90123 4" },
      { firstName: "Harry", lastName: "James", email: "harry.james@email.com", phone: "0407 777 888", dateOfBirth: "1985-07-05", address: "8 Rundle Mall, Adelaide SA 5000", ndisNumber: "432345678" },
      { firstName: "Ella", lastName: "Thompson", email: "ella.t@email.com", phone: "0408 888 999", dateOfBirth: "2015-02-18", address: "22 Henley Beach Rd, Adelaide SA 5000", ndisNumber: "432456789" },
      { firstName: "Oliver", lastName: "Wilson", email: "oliver.w@email.com", phone: "0409 999 000", dateOfBirth: "1990-04-12", address: "15 Morphett St, Adelaide SA 5000", medicare: "6789 01234 5" },
      { firstName: "Charlotte", lastName: "Brown", email: "charlotte.b@email.com", phone: "0410 000 111", dateOfBirth: "1975-12-25", address: "30 Hutt St, Adelaide SA 5000" },
      { firstName: "William", lastName: "Taylor", email: "william.t@email.com", phone: "0411 111 222", dateOfBirth: "2010-08-19", address: "44 Prospect Rd, Adelaide SA 5000", ndisNumber: "432567890" },
      { firstName: "Amelia", lastName: "Davis", email: "amelia.d@email.com", phone: "0412 222 333", dateOfBirth: "1998-06-30", address: "12 The Parade, Adelaide SA 5000", medicare: "7890 12345 6" },
      // New clients 12-23
      { firstName: "Noah", lastName: "Campbell", email: "noah.c@email.com", phone: "0413 333 444", dateOfBirth: "1988-01-20", address: "5 Flinders St, Melbourne VIC 3000", medicare: "8901 23456 7" },
      { firstName: "Mia", lastName: "Stewart", email: "mia.stewart@email.com", phone: "0414 444 555", dateOfBirth: "2016-09-10", address: "33 Chapel St, Prahran VIC 3181", ndisNumber: "432678901" },
      { firstName: "Jack", lastName: "Robinson", email: "jack.r@email.com", phone: "0415 555 666", dateOfBirth: "1972-05-28", address: "77 Bourke St, Melbourne VIC 3000", medicare: "9012 34567 8" },
      { firstName: "Grace", lastName: "Lee", email: "grace.lee@email.com", phone: "0416 666 777", dateOfBirth: "1995-11-15", address: "19 Lygon St, Carlton VIC 3053" },
      { firstName: "Ethan", lastName: "Murphy", email: "ethan.m@email.com", phone: "0417 777 888", dateOfBirth: "2005-03-22", address: "8 Smith St, Collingwood VIC 3066", ndisNumber: "432789012" },
      { firstName: "Chloe", lastName: "White", email: "chloe.w@email.com", phone: "0418 888 999", dateOfBirth: "1983-08-07", address: "62 Swan St, Richmond VIC 3121", medicare: "0123 45678 9" },
      { firstName: "Lucas", lastName: "Harris", email: "lucas.h@email.com", phone: "0419 999 000", dateOfBirth: "1960-12-01", address: "45 Bridge Rd, Richmond VIC 3121", medicare: "1234 56789 0" },
      { firstName: "Isla", lastName: "Clark", email: "isla.clark@email.com", phone: "0420 000 111", dateOfBirth: "2012-04-18", address: "10 Brunswick St, Fitzroy VIC 3065", ndisNumber: "432890123" },
      { firstName: "Lachlan", lastName: "Walker", email: "lachlan.w@email.com", phone: "0421 111 222", dateOfBirth: "1991-06-25", address: "28 Glenferrie Rd, Hawthorn VIC 3122" },
      { firstName: "Ruby", lastName: "Hall", email: "ruby.h@email.com", phone: "0422 222 333", dateOfBirth: "1987-02-14", address: "3 Bay St, Port Melbourne VIC 3207", medicare: "2345 67891 2" },
      { firstName: "Oscar", lastName: "Allen", email: "oscar.a@email.com", phone: "0423 333 444", dateOfBirth: "2019-07-30", address: "15 Acland St, St Kilda VIC 3182", ndisNumber: "432901234" },
      { firstName: "Zoe", lastName: "Young", email: "zoe.y@email.com", phone: "0424 444 555", dateOfBirth: "1970-10-05", address: "50 Church St, Brighton VIC 3186", medicare: "3456 78902 3" },
      // New clients 24-35
      { firstName: "Cooper", lastName: "King", email: "cooper.k@email.com", phone: "0425 555 666", dateOfBirth: "2008-11-12", address: "7 Toorak Rd, South Yarra VIC 3141", ndisNumber: "433012345" },
      { firstName: "Sienna", lastName: "Wright", email: "sienna.w@email.com", phone: "0426 666 777", dateOfBirth: "1993-04-08", address: "22 Victoria Ave, Albert Park VIC 3206" },
      { firstName: "Henry", lastName: "Scott", email: "henry.s@email.com", phone: "0427 777 888", dateOfBirth: "1955-08-20", address: "88 High St, Armadale VIC 3143", medicare: "4567 89013 4" },
      { firstName: "Willow", lastName: "Green", email: "willow.g@email.com", phone: "0428 888 999", dateOfBirth: "2014-01-03", address: "4 Pakington St, Geelong West VIC 3218", ndisNumber: "433123456" },
      { firstName: "Archie", lastName: "Baker", email: "archie.b@email.com", phone: "0429 999 000", dateOfBirth: "1980-06-17", address: "31 Moorabool St, Geelong VIC 3220", medicare: "5678 90124 5" },
      { firstName: "Ivy", lastName: "Adams", email: "ivy.a@email.com", phone: "0430 000 111", dateOfBirth: "1999-09-29", address: "12 Malop St, Geelong VIC 3220" },
      { firstName: "Leo", lastName: "Nelson", email: "leo.n@email.com", phone: "0431 111 222", dateOfBirth: "2017-05-11", address: "6 Ryrie St, Geelong VIC 3220", ndisNumber: "433234567" },
      { firstName: "Matilda", lastName: "Carter", email: "matilda.c@email.com", phone: "0432 222 333", dateOfBirth: "1968-03-25", address: "55 Lt Collins St, Melbourne VIC 3000", medicare: "6789 01235 6" },
      { firstName: "Charlie", lastName: "Mitchell", email: "charlie.m@email.com", phone: "0433 333 444", dateOfBirth: "2003-12-08", address: "9 Exhibition St, Melbourne VIC 3000", ndisNumber: "433345678" },
      { firstName: "Poppy", lastName: "Phillips", email: "poppy.p@email.com", phone: "0434 444 555", dateOfBirth: "1976-07-14", address: "41 Russell St, Melbourne VIC 3000", medicare: "7890 12346 7" },
      { firstName: "Hugo", lastName: "Evans", email: "hugo.e@email.com", phone: "0435 555 666", dateOfBirth: "1986-11-21", address: "17 Queen St, Melbourne VIC 3000" },
      { firstName: "Frankie", lastName: "Turner", email: "frankie.t@email.com", phone: "0436 666 777", dateOfBirth: "2011-02-07", address: "23 Swanston St, Melbourne VIC 3000", ndisNumber: "433456789" },
      // New clients 36-47
      { firstName: "Billie", lastName: "Cooper", email: "billie.c@email.com", phone: "0437 777 888", dateOfBirth: "1994-08-30", address: "65 Elizabeth St, Melbourne VIC 3000", medicare: "8901 23457 8" },
      { firstName: "Harley", lastName: "Morgan", email: "harley.m@email.com", phone: "0438 888 999", dateOfBirth: "2020-01-15", address: "11 Spencer St, Melbourne VIC 3000", ndisNumber: "433567890" },
      { firstName: "Indie", lastName: "Bennett", email: "indie.b@email.com", phone: "0439 999 000", dateOfBirth: "1963-04-22", address: "38 William St, Melbourne VIC 3000", medicare: "9012 34568 9" },
      { firstName: "Louie", lastName: "Gray", email: "louie.g@email.com", phone: "0440 000 111", dateOfBirth: "1997-10-18", address: "27 Lonsdale St, Melbourne VIC 3000" },
      { firstName: "Bonnie", lastName: "Hughes", email: "bonnie.h@email.com", phone: "0441 111 222", dateOfBirth: "2009-06-03", address: "14 La Trobe St, Melbourne VIC 3000", ndisNumber: "433678901" },
      { firstName: "Felix", lastName: "Ward", email: "felix.w@email.com", phone: "0442 222 333", dateOfBirth: "1974-01-27", address: "52 Franklin St, Melbourne VIC 3000", medicare: "0123 45679 0" },
      { firstName: "Rosie", lastName: "Watson", email: "rosie.w@email.com", phone: "0443 333 444", dateOfBirth: "2006-09-14", address: "8 Queensberry St, Carlton VIC 3053", ndisNumber: "433789012" },
      { firstName: "Alfie", lastName: "Brooks", email: "alfie.b@email.com", phone: "0444 444 555", dateOfBirth: "1982-05-09", address: "36 Grattan St, Carlton VIC 3053", medicare: "1234 56780 1" },
      { firstName: "Daisy", lastName: "Sanders", email: "daisy.s@email.com", phone: "0445 555 666", dateOfBirth: "2013-11-26", address: "19 Elgin St, Carlton VIC 3053", ndisNumber: "433890123" },
      { firstName: "Jasper", lastName: "Price", email: "jasper.p@email.com", phone: "0446 666 777", dateOfBirth: "1958-02-11", address: "71 Nicholson St, Carlton VIC 3053", medicare: "2345 67892 3" },
      { firstName: "Olive", lastName: "Russell", email: "olive.r@email.com", phone: "0447 777 888", dateOfBirth: "1990-07-08", address: "44 Drummond St, Carlton VIC 3053" },
      { firstName: "Teddy", lastName: "Foster", email: "teddy.f@email.com", phone: "0448 888 999", dateOfBirth: "2015-10-31", address: "2 Rathdowne St, Carlton VIC 3053", ndisNumber: "433901234" },
    ];

    const clients = await Promise.all(
      clientData.map((c) => prisma.client.create({ data: c }))
    );

    // Create appointments (~96) spread across past week and next two weeks
    const today = new Date();
    const formatDate = (d: Date) => d.toISOString().split("T")[0];
    const addDays = (days: number) => new Date(today.getTime() + days * 86400000);

    const statuses = ["Scheduled", "Completed", "Cancelled", "No Show"];
    const types = ["Initial Assessment", "Follow Up", "Standard", "Review", "Telehealth", "Group Session", "NDIS Review", "Plan Review"];
    const times = [
      ["08:00", "08:45"], ["08:30", "09:15"], ["09:00", "09:45"], ["09:30", "10:15"],
      ["10:00", "10:45"], ["10:30", "11:15"], ["11:00", "11:45"], ["11:30", "12:15"],
      ["13:00", "13:45"], ["13:30", "14:15"], ["14:00", "14:45"], ["14:30", "15:15"],
      ["15:00", "15:45"], ["15:30", "16:15"], ["16:00", "16:45"],
    ];

    const appointments: Array<{
      date: string; startTime: string; endTime: string;
      clientId: string; practitionerId: string; status: string; type: string;
      location?: string; notes?: string;
    }> = [];

    // Helper to pick items deterministically
    const pick = <T>(arr: T[], i: number): T => arr[i % arr.length];

    // Past appointments (days -14 to -1) — all completed/cancelled/no-show
    for (let day = -14; day <= -1; day++) {
      const date = formatDate(addDays(day));
      // 4-8 appointments per past day
      const count = 4 + (Math.abs(day) % 5);
      for (let i = 0; i < count; i++) {
        const slot = times[(day + 14 + i) % times.length];
        const pastStatuses = ["Completed", "Completed", "Completed", "Completed", "Cancelled", "No Show"];
        appointments.push({
          date,
          startTime: slot[0],
          endTime: slot[1],
          clientId: pick(clients, Math.abs(day * 7 + i)).id,
          practitionerId: pick(practitioners, Math.abs(day * 3 + i)).id,
          status: pick(pastStatuses, Math.abs(day + i)),
          type: pick(types, Math.abs(day * 2 + i)),
        });
      }
    }

    // Today's appointments — mixed statuses
    const todayAppts = [
      { startTime: "08:00", endTime: "08:45", clientId: clients[0].id, practitionerId: sarah.id, status: "Completed", type: "Initial Assessment" },
      { startTime: "09:00", endTime: "09:45", clientId: clients[1].id, practitionerId: sarah.id, status: "Completed", type: "Follow Up" },
      { startTime: "10:00", endTime: "10:45", clientId: clients[2].id, practitionerId: james.id, status: "Scheduled", type: "Standard" },
      { startTime: "10:00", endTime: "10:45", clientId: clients[12].id, practitionerId: priya.id, status: "Scheduled", type: "Standard" },
      { startTime: "11:00", endTime: "11:45", clientId: clients[3].id, practitionerId: emma.id, status: "Scheduled", type: "Standard" },
      { startTime: "11:00", endTime: "12:00", clientId: clients[13].id, practitionerId: nina.id, status: "Scheduled", type: "Initial Assessment" },
      { startTime: "13:00", endTime: "13:45", clientId: clients[4].id, practitionerId: sarah.id, status: "Scheduled", type: "Review" },
      { startTime: "13:00", endTime: "13:45", clientId: clients[14].id, practitionerId: liam.id, status: "Scheduled", type: "Standard" },
      { startTime: "14:00", endTime: "14:45", clientId: clients[5].id, practitionerId: rachel.id, status: "Scheduled", type: "Initial Assessment" },
      { startTime: "14:00", endTime: "14:45", clientId: clients[15].id, practitionerId: ben.id, status: "Cancelled", type: "Follow Up" },
      { startTime: "14:30", endTime: "15:15", clientId: clients[8].id, practitionerId: marcus.id, status: "Scheduled", type: "Standard" },
      { startTime: "15:00", endTime: "15:45", clientId: clients[9].id, practitionerId: rachel.id, status: "Cancelled", type: "Follow Up" },
      { startTime: "15:00", endTime: "15:45", clientId: clients[16].id, practitionerId: amy.id, status: "Scheduled", type: "Initial Assessment" },
      { startTime: "16:00", endTime: "16:45", clientId: clients[20].id, practitionerId: priya.id, status: "Scheduled", type: "Telehealth" },
    ];
    for (const a of todayAppts) {
      appointments.push({ date: formatDate(today), ...a });
    }

    // Future appointments (days +1 to +14)
    for (let day = 1; day <= 14; day++) {
      const date = formatDate(addDays(day));
      // 4-8 appointments per future day (weekdays have more)
      const dayOfWeek = addDays(day).getDay();
      const count = (dayOfWeek === 0 || dayOfWeek === 6) ? 2 : 5 + (day % 4);
      for (let i = 0; i < count; i++) {
        const slot = times[(day + i * 2) % times.length];
        appointments.push({
          date,
          startTime: slot[0],
          endTime: slot[1],
          clientId: pick(clients, day * 5 + i).id,
          practitionerId: pick(practitioners, day * 2 + i).id,
          status: "Scheduled",
          type: pick(types, day + i),
          location: i % 5 === 0 ? "Telehealth" : undefined,
        });
      }
    }

    for (const appt of appointments) {
      await prisma.appointment.create({ data: appt });
    }

    // Create clinical notes (~32)
    const noteTemplates = ["Progress Note", "Initial Assessment", "NDIS Progress Note", "Plan Review", "Discharge Summary"];
    const noteContents = [
      "Patient presents with lower back pain following lifting injury at work. Pain rated 6/10. Limited flexion. Prescribed exercise program and manual therapy. Review in 1 week.",
      "NDIS participant. Continued work on fine motor skills and daily living activities. Good progress with dressing tasks. Next session: kitchen safety assessment.",
      "Speech therapy session focused on fluency techniques. Client demonstrated improved breath control and pausing strategies. Homework: daily reading practice with controlled rate.",
      "Initial assessment for right shoulder pain. ROM limited in abduction and flexion. Strength 4/5. Referred for imaging. Treatment plan: manual therapy and progressive exercises.",
      "NDIS plan review preparation. Updated goals for community access and social skills. Recommend increase in OT support hours for next plan period.",
      "CBT session addressing generalised anxiety. Explored cognitive distortions and introduced thought challenging worksheet. Client engaged well and completed in-session exercises. Homework: daily thought record.",
      "Exercise physiology initial consult. Assessed baseline fitness and functional capacity. Chronic lower back pain with sedentary lifestyle. Developed 6-week progressive exercise program focusing on core stability and aerobic conditioning.",
      "Follow-up session for anxiety management. Client reports reduced frequency of panic attacks since starting breathing exercises. Introduced graded exposure hierarchy for social situations. Good compliance with homework.",
      "Hand therapy session post-distal radius fracture. Improving grip strength — now 60% of uninjured side. Scar mobilisation and progressive resistance exercises. Return to light duties in 2 weeks.",
      "Paediatric language assessment completed. Receptive language age equivalent 3;2 (chronological age 4;6). Expressive language delay noted. Recommend fortnightly sessions targeting vocabulary and sentence structure.",
      "Trauma-focused CBT session 4 of 12. Processing index trauma using narrative exposure. Client demonstrated good tolerance and emotional regulation. Continuing graded approach next session.",
      "Dietitian initial consult for paediatric feeding difficulties. Currently limited to 8 accepted foods. ARFID screening positive. Developed food chaining hierarchy starting with preferred textures.",
      "Sports physio review — ACL reconstruction 8 weeks post-op. Achieving full extension, flexion 120°. Progressing to closed-chain strengthening. Return to running protocol at 12 weeks.",
      "Occupational therapy school readiness assessment. Fine motor skills within age expectations. Visual motor integration below average. Recommend weekly OT to target handwriting readiness.",
      "Group session — chronic pain management. 6 participants. Topics: pacing strategies, sleep hygiene, and graded activity. All participants completed goal-setting exercise for the week.",
      "NDIS plan review meeting attended. Current goals achieved: independent meal preparation, community access 2x/week. New goals proposed: employment preparation and social group participation.",
      "Psychology session — couples therapy. Explored communication patterns and attachment styles. Introduced active listening exercise. Both partners engaged and agreed to practice between sessions.",
      "Exercise physiology follow-up. Client completed 4 of 6 prescribed sessions this fortnight. Improved 6-minute walk test by 40m. Adjusted program to include aquatic therapy component.",
      "Speech pathology — voice therapy for vocal nodules. Resonant voice exercises progressing well. Client reports reduced vocal fatigue at work. Continue fortnightly for 6 weeks.",
      "Initial assessment for knee osteoarthritis. BMI 32, bilateral knee OA grade 3. Significant quadriceps weakness. Commenced land-based strengthening program with hydrotherapy referral.",
      "Paediatric OT session — sensory processing. Implemented Wilbarger brushing protocol. Parent reported improved tolerance for hair washing and teeth brushing since starting program.",
      "Psychology — EMDR session 2 for motor vehicle accident PTSD. Successfully processed 3 target images. SUD reduced from 8 to 4. Client to practise calm place visualisation.",
      "Dietitian review — coeliac disease management. Weight stable. Reviewing food diary shows occasional inadvertent gluten exposure. Education on hidden gluten sources and dining out strategies.",
      "Physiotherapy — post-partum assessment. Diastasis recti 2-finger separation. Pelvic floor strength grade 3/5. Commenced graduated core rehabilitation program.",
      "NDIS progress note — community participation goal. Client independently caught public transport to shopping centre. Completed grocery shopping with checklist. Excellent progress toward independence.",
      "Occupational therapy — workplace ergonomic assessment. Identified poor workstation setup contributing to cervical and thoracic pain. Provided equipment recommendations and postural education.",
      "Psychology — adolescent session for school refusal. Explored maintaining factors including social anxiety and perfectionism. Developed graded return-to-school plan with school counsellor.",
      "Exercise physiology — cardiac rehabilitation phase 2. Completed 6MWT: 450m (up from 380m at baseline). Heart rate recovery improving. Progressing interval training component.",
      "Speech pathology — stuttering management. Smooth speech techniques at sentence level achieved 85% fluency. Client self-monitoring improving. Transition to paragraph-level practice.",
      "Physiotherapy discharge summary — rotator cuff repair. 16 weeks post-op. Full ROM achieved. Strength 5/5 all directions. Return to sport clearance given. Self-management program provided.",
      "NDIS plan review — assistive technology. Trialled 3 AAC devices. Client demonstrated best outcomes with tablet-based high-tech system. Funding request submitted for communication device.",
      "Psychology — relapse prevention planning for depression. Identified early warning signs and protective factors. Created written action plan. Transitioning to monthly maintenance sessions.",
    ];

    const clinicalNotes: Array<{
      date: string; content: string; template: string;
      signed: boolean; clientId: string; practitionerId: string;
    }> = [];

    for (let i = 0; i < 32; i++) {
      const dayOffset = -Math.floor(i / 3); // Spread across recent days
      clinicalNotes.push({
        date: formatDate(addDays(dayOffset)),
        content: noteContents[i % noteContents.length],
        template: pick(noteTemplates, i),
        signed: i % 3 !== 1, // ~2/3 signed
        clientId: pick(clients, i * 3).id,
        practitionerId: pick(practitioners, i * 2).id,
      });
    }

    for (const note of clinicalNotes) {
      await prisma.clinicalNote.create({ data: note });
    }

    // Create invoices (~48)
    const invoiceStatuses = ["Draft", "Sent", "Paid", "Overdue", "Paid", "Sent", "Draft", "Paid"];
    const billingTypes = ["Medicare", "NDIS", "Private", "NDIS", "Medicare", "Private"];
    const lineItems: Array<{ description: string; unitPrice: number }> = [
      { description: "Initial Physiotherapy Assessment (45 min)", unitPrice: 150.00 },
      { description: "Physiotherapy Follow Up (30 min)", unitPrice: 95.00 },
      { description: "Physiotherapy Standard (30 min)", unitPrice: 120.00 },
      { description: "OT Standard Consultation (45 min)", unitPrice: 193.99 },
      { description: "OT Follow Up (30 min)", unitPrice: 135.00 },
      { description: "Speech Pathology Standard (45 min)", unitPrice: 193.99 },
      { description: "Speech Pathology Follow Up (30 min)", unitPrice: 140.00 },
      { description: "Psychology Initial Assessment (60 min)", unitPrice: 260.00 },
      { description: "Psychology Follow Up (50 min)", unitPrice: 200.00 },
      { description: "Psychology Standard (50 min)", unitPrice: 220.00 },
      { description: "Exercise Physiology Initial Assessment (60 min)", unitPrice: 193.99 },
      { description: "Exercise Physiology Follow Up (45 min)", unitPrice: 150.00 },
      { description: "Dietitian Initial Consultation (60 min)", unitPrice: 170.00 },
      { description: "Dietitian Follow Up (30 min)", unitPrice: 95.00 },
      { description: "Group Session (60 min)", unitPrice: 65.00 },
      { description: "Telehealth Consultation (30 min)", unitPrice: 110.00 },
      { description: "Home Visit (60 min)", unitPrice: 250.00 },
      { description: "Workplace Assessment (90 min)", unitPrice: 350.00 },
      { description: "Report Writing", unitPrice: 193.99 },
      { description: "Sensory assessment kit", unitPrice: 43.99 },
      { description: "Psychological testing materials", unitPrice: 40.00 },
      { description: "Home exercise program development", unitPrice: 93.99 },
    ];

    for (let i = 0; i < 48; i++) {
      const dayOffset = -Math.floor(i / 3) - (i % 7); // Spread invoices across past ~30 days
      const invoiceDate = formatDate(addDays(dayOffset));
      const status = pick(invoiceStatuses, i);
      const dueDayOffset = status === "Overdue" ? dayOffset + 14 : dayOffset + 30;
      const dueDate = formatDate(addDays(dueDayOffset));
      const item1 = pick(lineItems, i);
      const hasSecondItem = i % 4 === 0;
      const item2 = hasSecondItem ? pick(lineItems, i + 10) : null;
      const subtotal = item1.unitPrice + (item2 ? item2.unitPrice : 0);

      await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-${String(i + 1).padStart(3, "0")}`,
          date: invoiceDate,
          dueDate: dueDate,
          status,
          subtotal,
          tax: 0,
          total: subtotal,
          billingType: pick(billingTypes, i),
          clientId: pick(clients, i * 2).id,
          items: {
            create: [
              { description: item1.description, quantity: 1, unitPrice: item1.unitPrice, total: item1.unitPrice },
              ...(item2 ? [{ description: item2.description, quantity: 1, unitPrice: item2.unitPrice, total: item2.unitPrice }] : []),
            ],
          },
        },
      });
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
