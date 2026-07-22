import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  const cardiology = await prisma.department.upsert({
    where: { name: "Cardiology" },
    update: {},
    create: { name: "Cardiology", description: "Heart & cardiovascular care" },
  });

  const dermatology = await prisma.department.upsert({
    where: { name: "Dermatology" },
    update: {},
    create: { name: "Dermatology", description: "Skin, hair & nail care" },
  });

  const doctorPasswordHash = await bcrypt.hash("doctorpass123", 10);

  await prisma.user.upsert({
    where: { email: "sara.yohannes@mediflow.com" },
    update: {},
    create: {
      email: "sara.yohannes@mediflow.com",
      passwordHash: doctorPasswordHash,
      role: "DOCTOR",
      doctor: {
        create: {
          firstName: "Sara",
          lastName: "Yohannes",
          specialization: "Cardiology",
          yearsExperience: 8,
          departmentId: cardiology.id,
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "alex.abraham@mediflow.com" },
    update: {},
    create: {
      email: "alex.abraham@mediflow.com",
      passwordHash: doctorPasswordHash,
      role: "DOCTOR",
      doctor: {
        create: {
          firstName: "Alex",
          lastName: "Abraham",
          specialization: "Dermatology",
          yearsExperience: 5,
          departmentId: dermatology.id,
        },
      },
    },
  });

  const adminPasswordHash = await bcrypt.hash("adminpass123", 10);

  await prisma.user.upsert({
    where: { email: "admin@mediflow.com" },
    update: {},
    create: {
      email: "admin@mediflow.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  console.log("Seed complete: departments + doctors created");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
