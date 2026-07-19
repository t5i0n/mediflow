import { prisma } from "../src/lib/prisma.js";

async function main() {
  const cardiology = await prisma.department.create({
    data: { name: "Cardiology", description: "Heart & cardiovascular care" },
  });

  const dermatology = await prisma.department.create({
    data: { name: "Dermatology", description: "Skin, hair & nail care" },
  });

  console.log("Seeded departments:", cardiology.name, dermatology.name);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
