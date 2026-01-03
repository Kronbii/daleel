/**
 * Seed script for Daleel database
 * Creates default election cycle, districts, topics, and test admin user
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create test admin user
  const adminEmail = "admin@daleel.test";
  const adminPassword = "admin123"; // Change in production!
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

  // Create default election cycle
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

  // Create sample districts
  const districts = [
    {
      cycleId: cycle.id,
      nameAr: "بيروت الأولى",
      nameEn: "Beirut I",
      nameFr: "Beyrouth I",
      seatCount: 5,
    },
    {
      cycleId: cycle.id,
      nameAr: "بيروت الثانية",
      nameEn: "Beirut II",
      nameFr: "Beyrouth II",
      seatCount: 4,
    },
    {
      cycleId: cycle.id,
      nameAr: "جبل لبنان",
      nameEn: "Mount Lebanon",
      nameFr: "Mont-Liban",
      seatCount: 35,
    },
  ];

  for (const districtData of districts) {
    // Check if exists first (unique constraint on cycleId + nameAr)
    const existing = await prisma.district.findFirst({
      where: {
        cycleId: districtData.cycleId,
        nameAr: districtData.nameAr,
      },
    });

    if (!existing) {
      const district = await prisma.district.create({
        data: districtData,
      });
      console.log("Created district:", district.nameAr);
    } else {
      console.log("District already exists:", districtData.nameAr);
    }
  }

  // Create sample topics
  const topics = [
    { key: "economy", nameAr: "الاقتصاد", nameEn: "Economy", nameFr: "Économie" },
    { key: "education", nameAr: "التعليم", nameEn: "Education", nameFr: "Éducation" },
    { key: "healthcare", nameAr: "الصحة", nameEn: "Healthcare", nameFr: "Santé" },
    { key: "security", nameAr: "الأمن", nameEn: "Security", nameFr: "Sécurité" },
    { key: "environment", nameAr: "البيئة", nameEn: "Environment", nameFr: "Environnement" },
  ];

  for (const topicData of topics) {
    const topic = await prisma.topic.upsert({
      where: { key: topicData.key },
      update: {},
      create: topicData,
    });
    console.log("Created topic:", topic.key);
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

