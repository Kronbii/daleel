/**
 * Seed script for Daleel database
 * Creates comprehensive fake data for visualization
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Helper to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  console.log("Starting comprehensive seed...");

  // Create test admin user
  const adminEmail = "admin@daleel.test";
  const adminPassword = "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("Created admin user:", admin.email);
  console.log("Password:", adminPassword);

  // Create election cycle
  const cycle = await prisma.electionCycle.upsert({
    where: { year: 2022 },
    update: {},
    create: {
      name: "2022 Parliamentary Elections",
      year: 2022,
      isActive: true,
    },
  });

  console.log("Created election cycle:", cycle.name);

  // Create all Lebanese districts
  const districtsData = [
    { nameAr: "بيروت الأولى", nameEn: "Beirut I", nameFr: "Beyrouth I", seatCount: 5 },
    { nameAr: "بيروت الثانية", nameEn: "Beirut II", nameFr: "Beyrouth II", seatCount: 4 },
    { nameAr: "بيروت الثالثة", nameEn: "Beirut III", nameFr: "Beyrouth III", seatCount: 5 },
    { nameAr: "جبل لبنان الأولى", nameEn: "Mount Lebanon I", nameFr: "Mont-Liban I", seatCount: 8 },
    { nameAr: "جبل لبنان الثانية", nameEn: "Mount Lebanon II", nameFr: "Mont-Liban II", seatCount: 6 },
    { nameAr: "جبل لبنان الثالثة", nameEn: "Mount Lebanon III", nameFr: "Mont-Liban III", seatCount: 7 },
    { nameAr: "جبل لبنان الرابعة", nameEn: "Mount Lebanon IV", nameFr: "Mont-Liban IV", seatCount: 6 },
    { nameAr: "الشمال الأولى", nameEn: "North I", nameFr: "Nord I", seatCount: 8 },
    { nameAr: "الشمال الثانية", nameEn: "North II", nameFr: "Nord II", seatCount: 5 },
    { nameAr: "الشمال الثالثة", nameEn: "North III", nameFr: "Nord III", seatCount: 6 },
    { nameAr: "الجنوب الأولى", nameEn: "South I", nameFr: "Sud I", seatCount: 5 },
    { nameAr: "الجنوب الثانية", nameEn: "South II", nameFr: "Sud II", seatCount: 4 },
    { nameAr: "الجنوب الثالثة", nameEn: "South III", nameFr: "Sud III", seatCount: 5 },
    { nameAr: "البقاع الأولى", nameEn: "Bekaa I", nameFr: "Bekaa I", seatCount: 6 },
    { nameAr: "البقاع الثانية", nameEn: "Bekaa II", nameFr: "Bekaa II", seatCount: 5 },
    { nameAr: "البقاع الثالثة", nameEn: "Bekaa III", nameFr: "Bekaa III", seatCount: 4 },
  ];

  const districts = [];
  for (const districtData of districtsData) {
    const existing = await prisma.district.findFirst({
      where: {
        cycleId: cycle.id,
        nameAr: districtData.nameAr,
      },
    });

    if (!existing) {
      const district = await prisma.district.create({
        data: {
          ...districtData,
          cycleId: cycle.id,
        },
      });
      districts.push(district);
      console.log("Created district:", district.nameAr);
    } else {
      const district = await prisma.district.findFirst({
        where: {
          cycleId: cycle.id,
          nameAr: districtData.nameAr,
        },
      });
      if (district) districts.push(district);
      console.log("District already exists:", districtData.nameAr);
    }
  }

  // Create topics
  const topicsData = [
    { key: "economy", nameAr: "الاقتصاد", nameEn: "Economy", nameFr: "Économie" },
    { key: "education", nameAr: "التعليم", nameEn: "Education", nameFr: "Éducation" },
    { key: "healthcare", nameAr: "الصحة", nameEn: "Healthcare", nameFr: "Santé" },
    { key: "security", nameAr: "الأمن", nameEn: "Security", nameFr: "Sécurité" },
    { key: "environment", nameAr: "البيئة", nameEn: "Environment", nameFr: "Environnement" },
    { key: "infrastructure", nameAr: "البنية التحتية", nameEn: "Infrastructure", nameFr: "Infrastructure" },
    { key: "social", nameAr: "الاجتماعي", nameEn: "Social", nameFr: "Social" },
  ];

  const topics = [];
  for (const topicData of topicsData) {
    const topic = await prisma.topic.upsert({
      where: { key: topicData.key },
      update: {},
      create: topicData,
    });
    topics.push(topic);
    console.log("Created topic:", topic.key);
  }

  // Create sample sources (archived)
  const sourcesData = [
    {
      title: "Interview with candidate on economic policy",
      publisher: "Al-Akhbar",
      originalUrl: "https://example.com/news/interview-1",
      archivedUrl: "https://web.archive.org/web/20220101/interview-1",
      archivedAt: new Date("2022-01-15"),
      archiveMethod: "WAYBACK" as const,
      contentType: "article",
    },
    {
      title: "Campaign speech on education reform",
      publisher: "L'Orient-Le Jour",
      originalUrl: "https://example.com/news/speech-1",
      archivedUrl: "https://web.archive.org/web/20220201/speech-1",
      archivedAt: new Date("2022-02-10"),
      archiveMethod: "WAYBACK" as const,
      contentType: "article",
    },
    {
      title: "Press conference on healthcare",
      publisher: "An-Nahar",
      originalUrl: "https://example.com/news/press-1",
      archivedUrl: "https://web.archive.org/web/20220301/press-1",
      archivedAt: new Date("2022-03-05"),
      archiveMethod: "WAYBACK" as const,
      contentType: "article",
    },
    {
      title: "Social media post on security",
      publisher: "Twitter",
      originalUrl: "https://twitter.com/candidate/post-1",
      archivedUrl: "https://web.archive.org/web/20220401/post-1",
      archivedAt: new Date("2022-04-12"),
      archiveMethod: "WAYBACK" as const,
      contentType: "social_media",
    },
    {
      title: "TV interview on environment",
      publisher: "LBCI",
      originalUrl: "https://example.com/video/interview-2",
      archivedUrl: "https://web.archive.org/web/20220501/interview-2",
      archivedAt: new Date("2022-05-20"),
      archiveMethod: "VIDEO_DOWNLOAD" as const,
      contentType: "video",
    },
  ];

  const sources = [];
  for (const sourceData of sourcesData) {
    const source = await prisma.source.create({
      data: sourceData,
    });
    sources.push(source);
    console.log("Created source:", source.title);
  }

  // Create electoral lists
  const listsData = [
    {
      nameAr: "قائمة التغيير والإصلاح",
      nameEn: "Change and Reform List",
      nameFr: "Liste du Changement et de la Réforme",
      status: "OFFICIAL" as const,
      announcedAt: new Date("2022-03-01"),
    },
    {
      nameAr: "قائمة الوحدة الوطنية",
      nameEn: "National Unity List",
      nameFr: "Liste de l'Unité Nationale",
      status: "OFFICIAL" as const,
      announcedAt: new Date("2022-03-05"),
    },
    {
      nameAr: "قائمة المستقبل",
      nameEn: "Future List",
      nameFr: "Liste de l'Avenir",
      status: "OFFICIAL" as const,
      announcedAt: new Date("2022-03-10"),
    },
    {
      nameAr: "قائمة الشعب",
      nameEn: "People's List",
      nameFr: "Liste du Peuple",
      status: "ANNOUNCED" as const,
      announcedAt: new Date("2022-03-15"),
    },
  ];

  const lists = [];
  for (let i = 0; i < listsData.length && i < districts.length; i++) {
    const listData = listsData[i];
    const district = districts[i % districts.length];
    const list = await prisma.electoralList.create({
      data: {
        ...listData,
        cycleId: cycle.id,
        districtId: district.id,
      },
    });
    lists.push(list);
    console.log("Created list:", list.nameAr);
  }

  // Create many candidates
  const candidatesData = [
    // Beirut I
    {
      fullNameAr: "أحمد محمد الخليل",
      fullNameEn: "Ahmad Mohammed Al-Khalil",
      fullNameFr: "Ahmad Mohammed Al-Khalil",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "GEOMETRIC" as const,
    },
    {
      fullNameAr: "فاطمة علي حسن",
      fullNameEn: "Fatima Ali Hassan",
      fullNameFr: "Fatima Ali Hassan",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "INITIALS" as const,
    },
    {
      fullNameAr: "خالد سعد الدين",
      fullNameEn: "Khalid Saad Eddine",
      fullNameFr: "Khalid Saad Eddine",
      status: "POTENTIAL" as const,
      placeholderPhotoStyle: "SILHOUETTE" as const,
    },
    // Beirut II
    {
      fullNameAr: "ليلى جورج نصر",
      fullNameEn: "Layla George Nasr",
      fullNameFr: "Layla George Nasr",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "GEOMETRIC" as const,
    },
    {
      fullNameAr: "مروان بطرس خوري",
      fullNameEn: "Marwan Boutros Khoury",
      fullNameFr: "Marwan Boutros Khoury",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "INITIALS" as const,
    },
    // Mount Lebanon
    {
      fullNameAr: "نورا ريمون فرح",
      fullNameEn: "Nora Raymond Farah",
      fullNameFr: "Nora Raymond Farah",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "GEOMETRIC" as const,
    },
    {
      fullNameAr: "سمير أنطوان معلوف",
      fullNameEn: "Samir Antoine Maalouf",
      fullNameFr: "Samir Antoine Maalouf",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "SILHOUETTE" as const,
    },
    {
      fullNameAr: "رانيا فؤاد عيد",
      fullNameEn: "Rania Fouad Eid",
      fullNameFr: "Rania Fouad Eid",
      status: "POTENTIAL" as const,
      placeholderPhotoStyle: "INITIALS" as const,
    },
    // North
    {
      fullNameAr: "عمر حسن تراب",
      fullNameEn: "Omar Hassan Tarab",
      fullNameFr: "Omar Hassan Tarab",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "GEOMETRIC" as const,
    },
    {
      fullNameAr: "سارة محمود زين",
      fullNameEn: "Sara Mahmoud Zein",
      fullNameFr: "Sara Mahmoud Zein",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "INITIALS" as const,
    },
    {
      fullNameAr: "يوسف عبد الله قاسم",
      fullNameEn: "Youssef Abdullah Qassem",
      fullNameFr: "Youssef Abdullah Qassem",
      status: "WITHDRAWN" as const,
      placeholderPhotoStyle: "SILHOUETTE" as const,
    },
    // South
    {
      fullNameAr: "حسن علي ناصر",
      fullNameEn: "Hassan Ali Nasser",
      fullNameFr: "Hassan Ali Nasser",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "GEOMETRIC" as const,
    },
    {
      fullNameAr: "مريم جمال الدين",
      fullNameEn: "Mariam Jamal Eddine",
      fullNameFr: "Mariam Jamal Eddine",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "INITIALS" as const,
    },
    {
      fullNameAr: "باسم رفيق شعبان",
      fullNameEn: "Bassem Rafiq Shaban",
      fullNameFr: "Bassem Rafiq Shaban",
      status: "POTENTIAL" as const,
      placeholderPhotoStyle: "SILHOUETTE" as const,
    },
    // Bekaa
    {
      fullNameAr: "زينب فؤاد مراد",
      fullNameEn: "Zeinab Fouad Mourad",
      fullNameFr: "Zeinab Fouad Mourad",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "GEOMETRIC" as const,
    },
    {
      fullNameAr: "طلال إبراهيم صالح",
      fullNameEn: "Talal Ibrahim Saleh",
      fullNameFr: "Talal Ibrahim Saleh",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "INITIALS" as const,
    },
    {
      fullNameAr: "هند محمد العلي",
      fullNameEn: "Hind Mohammed Al-Ali",
      fullNameFr: "Hind Mohammed Al-Ali",
      status: "DISQUALIFIED" as const,
      placeholderPhotoStyle: "SILHOUETTE" as const,
    },
    // More candidates for variety
    {
      fullNameAr: "جورج أنطوان سعادة",
      fullNameEn: "George Antoine Saadeh",
      fullNameFr: "George Antoine Saadeh",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "GEOMETRIC" as const,
    },
    {
      fullNameAr: "ناديا كريم بشارة",
      fullNameEn: "Nadia Karim Bshara",
      fullNameFr: "Nadia Karim Bshara",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "INITIALS" as const,
    },
    {
      fullNameAr: "ميشال بيار جعجع",
      fullNameEn: "Michel Pierre Geagea",
      fullNameFr: "Michel Pierre Geagea",
      status: "POTENTIAL" as const,
      placeholderPhotoStyle: "SILHOUETTE" as const,
    },
    {
      fullNameAr: "سعد الدين رفيق الحريري",
      fullNameEn: "Saad Eddine Rafiq Hariri",
      fullNameFr: "Saad Eddine Rafiq Hariri",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "GEOMETRIC" as const,
    },
    {
      fullNameAr: "نبيل بركات",
      fullNameEn: "Nabil Barakat",
      fullNameFr: "Nabil Barakat",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "INITIALS" as const,
    },
    {
      fullNameAr: "وليد جنبلاط",
      fullNameEn: "Walid Jumblatt",
      fullNameFr: "Walid Jumblatt",
      status: "OFFICIAL" as const,
      placeholderPhotoStyle: "SILHOUETTE" as const,
    },
  ];

  const candidates = [];
  for (let i = 0; i < candidatesData.length; i++) {
    const candidateData = candidatesData[i];
    const district = districts[i % districts.length];
    const list = i < lists.length ? lists[i % lists.length] : null;

    const slug = createSlug(candidateData.fullNameEn || candidateData.fullNameAr);

    const candidate = await prisma.candidate.upsert({
      where: { slug },
      update: {},
      create: {
        ...candidateData,
        cycleId: cycle.id,
        districtId: district.id,
        currentListId: list?.id,
        slug,
      },
    });
    candidates.push(candidate);
    console.log("Created candidate:", candidate.fullNameAr);
  }

  // Create affiliations for some candidates
  const affiliationTypes = ["PARTY", "BLOC", "LIST", "ROLE", "ALLIANCE"] as const;
  const partyNames = [
    { ar: "حزب الله", en: "Hezbollah", fr: "Hezbollah" },
    { ar: "التيار الوطني الحر", en: "Free Patriotic Movement", fr: "Mouvement Patriotique Libre" },
    { ar: "القوات اللبنانية", en: "Lebanese Forces", fr: "Forces Libanaises" },
    { ar: "حزب الكتائب", en: "Kataeb Party", fr: "Parti Kataeb" },
    { ar: "تيار المستقبل", en: "Future Movement", fr: "Mouvement du Futur" },
    { ar: "الحزب التقدمي الاشتراكي", en: "Progressive Socialist Party", fr: "Parti Socialiste Progressiste" },
  ];

  for (let i = 0; i < Math.min(candidates.length, 15); i++) {
    const candidate = candidates[i];
    const party = partyNames[i % partyNames.length];
    const source = sources[i % sources.length];

    await prisma.affiliation.create({
      data: {
        candidateId: candidate.id,
        type: affiliationTypes[i % affiliationTypes.length],
        nameAr: party.ar,
        nameEn: party.en,
        nameFr: party.fr,
        startDate: new Date(2020 + (i % 3), i % 12, 1),
        sourceId: source.id,
      },
    });
    console.log(`Created affiliation for ${candidate.fullNameAr}`);
  }

  // Create statements for candidates
  const statementKinds = ["QUOTE", "INTERVIEW", "VOTE", "PROGRAM", "OTHER"] as const;
  const statementSummaries = [
    {
      ar: "دعا إلى إصلاح النظام الاقتصادي ودعم القطاع الخاص",
      en: "Called for economic system reform and support for the private sector",
      fr: "Appelé à la réforme du système économique et au soutien du secteur privé",
    },
    {
      ar: "أكد على أهمية تحسين جودة التعليم في المدارس العامة",
      en: "Emphasized the importance of improving quality of education in public schools",
      fr: "Souligné l'importance d'améliorer la qualité de l'éducation dans les écoles publiques",
    },
    {
      ar: "اقترح خطة شاملة لتحديث نظام الرعاية الصحية",
      en: "Proposed a comprehensive plan to modernize the healthcare system",
      fr: "Proposé un plan complet pour moderniser le système de santé",
    },
    {
      ar: "تحدث عن ضرورة تعزيز الأمن والاستقرار في البلاد",
      en: "Spoke about the need to strengthen security and stability in the country",
      fr: "Parlé de la nécessité de renforcer la sécurité et la stabilité dans le pays",
    },
    {
      ar: "دعا إلى حماية البيئة ومكافحة التلوث",
      en: "Called for environmental protection and pollution control",
      fr: "Appelé à la protection de l'environnement et à la lutte contre la pollution",
    },
  ];

  for (let i = 0; i < Math.min(candidates.length, 20); i++) {
    const candidate = candidates[i];
    const topic = topics[i % topics.length];
    const source = sources[i % sources.length];
    const summary = statementSummaries[i % statementSummaries.length];

    await prisma.statement.create({
      data: {
        candidateId: candidate.id,
        topicId: topic.id,
        kind: statementKinds[i % statementKinds.length],
        summaryAr: summary.ar,
        summaryEn: summary.en,
        summaryFr: summary.fr,
        occurredAt: new Date(2022, i % 12, 1 + (i % 28)),
        sourceId: source.id,
      },
    });
    console.log(`Created statement for ${candidate.fullNameAr}`);
  }

  // Create some candidate submissions
  for (let i = 0; i < Math.min(candidates.length, 5); i++) {
    const candidate = candidates[i];
    await prisma.candidateSubmission.create({
      data: {
        candidateId: candidate.id,
        contentAr: "أود أن أضيف معلومات إضافية عن خلفيتي وخبرتي",
        contentEn: "I would like to add additional information about my background and experience",
        contentFr: "Je voudrais ajouter des informations supplémentaires sur mon parcours et mon expérience",
        status: i % 2 === 0 ? "APPROVED" : "RECEIVED",
        links: ["https://example.com/cv", "https://example.com/interview"],
      },
    });
    console.log(`Created submission for ${candidate.fullNameAr}`);
  }

  // Create some right of replies
  for (let i = 0; i < Math.min(candidates.length, 3); i++) {
    const candidate = candidates[i];
    await prisma.rightOfReply.create({
      data: {
        candidateId: candidate.id,
        contentAr: "أود توضيح بعض النقاط التي تم ذكرها في ملفي الشخصي",
        contentEn: "I would like to clarify some points mentioned in my profile",
        contentFr: "Je voudrais clarifier certains points mentionnés dans mon profil",
        status: i === 0 ? "PUBLISHED" : "RECEIVED",
      },
    });
    console.log(`Created right of reply for ${candidate.fullNameAr}`);
  }

  // Generate electoral centers from CSV file
  console.log("\nGenerating electoral centers from CSV...");
  
  // Delete existing centers to avoid duplicates
  const deletedCount = await prisma.electoralCenter.deleteMany({});
  console.log(`Deleted ${deletedCount.count} existing electoral centers`);
  
  // Read CSV file - try multiple possible locations
  // The CSV should be in the project root (daleel/random_points.csv)
  const csvPaths = [
    path.join(process.cwd(), "random_points.csv"),
    path.join(process.cwd(), "..", "random_points.csv"),
    path.join(process.cwd(), "..", "..", "random_points.csv"),
    path.join(__dirname, "..", "..", "..", "random_points.csv"),
    path.resolve(process.cwd(), "..", "random_points.csv"), // From backend to root
  ];

  let csvContent: string | null = null;
  for (const csvPath of csvPaths) {
    try {
      if (fs.existsSync(csvPath)) {
        csvContent = fs.readFileSync(csvPath, "utf-8");
        console.log(`Found CSV file at: ${csvPath}`);
        break;
      }
    } catch (error) {
      // Continue to next path
    }
  }

  if (!csvContent) {
    throw new Error("Could not find random_points.csv file. Please ensure it exists in the project root.");
  }

  // Parse CSV
  const lines = csvContent.trim().split("\n");
  const points: Array<{ latitude: number; longitude: number }> = [];
  
  for (let i = 1; i < lines.length; i++) { // Skip header
    const line = lines[i].trim();
    if (!line) continue;
    
    const [pointNumber, latitude, longitude] = line.split(",");
    if (latitude && longitude) {
      points.push({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
    }
  }

  console.log(`Parsed ${points.length} points from CSV`);

  // Center name templates
  const centerNameTemplates = [
    { ar: "مدرسة", en: "School", fr: "École" },
    { ar: "معهد", en: "Institute", fr: "Institut" },
    { ar: "جامعة", en: "University", fr: "Université" },
    { ar: "قاعة", en: "Hall", fr: "Salle" },
    { ar: "مركز", en: "Center", fr: "Centre" },
    { ar: "مستوصف", en: "Clinic", fr: "Clinique" },
    { ar: "بلدية", en: "Municipality", fr: "Municipalité" },
    { ar: "نادي", en: "Club", fr: "Club" },
    { ar: "كنيسة", en: "Church", fr: "Église" },
    { ar: "مسجد", en: "Mosque", fr: "Mosquée" },
  ];

  const locationNames = [
    { ar: "الشهداء", en: "Martyrs", fr: "Martyrs" },
    { ar: "الحرية", en: "Freedom", fr: "Liberté" },
    { ar: "الوحدة", en: "Unity", fr: "Unité" },
    { ar: "النهضة", en: "Renaissance", fr: "Renaissance" },
    { ar: "الكرامة", en: "Dignity", fr: "Dignité" },
    { ar: "العدالة", en: "Justice", fr: "Justice" },
    { ar: "السلام", en: "Peace", fr: "Paix" },
    { ar: "الاستقلال", en: "Independence", fr: "Indépendance" },
    { ar: "التحرير", en: "Liberation", fr: "Libération" },
    { ar: "النهار", en: "Day", fr: "Jour" },
    { ar: "القديس", en: "Saint", fr: "Saint" },
    { ar: "الأنبياء", en: "Prophets", fr: "Prophètes" },
    { ar: "المخلص", en: "Savior", fr: "Sauveur" },
    { ar: "القديسة", en: "Saint", fr: "Sainte" },
    { ar: "الرسول", en: "Apostle", fr: "Apôtre" },
  ];

  const streetNames = [
    { ar: "شارع الحمراء", en: "Hamra Street", fr: "Rue Hamra" },
    { ar: "شارع الكورنيش", en: "Corniche", fr: "Corniche" },
    { ar: "شارع المكحول", en: "Makdisi Street", fr: "Rue Makdisi" },
    { ar: "شارع بلس", en: "Bliss Street", fr: "Rue Bliss" },
    { ar: "شارع الجميزة", en: "Gemmayzeh Street", fr: "Rue Gemmayzeh" },
    { ar: "شارع مار مخايل", en: "Mar Mikhael Street", fr: "Rue Mar Mikhael" },
  ];

  // Distribute points evenly across districts
  const pointsPerDistrict = Math.ceil(points.length / districts.length);
  let pointIndex = 0;
  let centerCount = 0;

  for (const district of districts) {
    for (let i = 0; i < pointsPerDistrict && pointIndex < points.length; i++) {
      const point = points[pointIndex];
      
      // Generate center name
      const template = centerNameTemplates[centerCount % centerNameTemplates.length];
      const location = locationNames[Math.floor(centerCount / 10) % locationNames.length];
      const number = (centerCount % 50) + 1;

      const nameAr = `${template.ar} ${location.ar} ${number}`;
      const nameEn = `${location.en} ${template.en} ${number}`;
      const nameFr = `${template.fr} ${location.fr} ${number}`;

      // Generate address (70% chance)
      let addressAr: string | undefined;
      let addressEn: string | undefined;
      let addressFr: string | undefined;

      if (Math.random() > 0.3) {
        const street = streetNames[centerCount % streetNames.length];
        const buildingNumber = Math.floor(Math.random() * 200) + 1;
        addressAr = `${street.ar}، مبنى ${buildingNumber}`;
        addressEn = `${street.en}, Building ${buildingNumber}`;
        addressFr = `${street.fr}, Bâtiment ${buildingNumber}`;
      }

      await prisma.electoralCenter.create({
        data: {
          districtId: district.id,
          nameAr,
          nameEn,
          nameFr,
          latitude: point.latitude,
          longitude: point.longitude,
          addressAr,
          addressEn,
          addressFr,
        },
      });

      pointIndex++;
      centerCount++;
      if (centerCount % 100 === 0) {
        console.log(`Created ${centerCount} electoral centers...`);
      }
    }
  }

  console.log(`\n✅ Seed completed successfully!`);
  console.log(`Created:`);
  console.log(`- ${districts.length} districts`);
  console.log(`- ${topics.length} topics`);
  console.log(`- ${sources.length} sources`);
  console.log(`- ${lists.length} electoral lists`);
  console.log(`- ${candidates.length} candidates`);
  console.log(`- ${centerCount} electoral centers`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

