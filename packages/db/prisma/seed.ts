import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const practice = await db.practice.upsert({
    where: { slug: "refined-aesthetic" },
    update: {},
    create: {
      name: "Refined Aesthetic",
      slug: "refined-aesthetic",
    },
  });

  await db.provider.upsert({
    where: { clerkUserId: "user_3AfFRtxvTaL7KTV1EyPj5Tg26Se" },
    update: { practiceId: practice.id },
    create: {
      practiceId: practice.id,
      clerkUserId: "user_3AfFRtxvTaL7KTV1EyPj5Tg26Se",
      firstName: "Garrett",
      lastName: "Admin",
      email: "armyof3@gmail.com",
      role: "PRACTICE_OWNER",
    },
  });

  console.log(`Seeded practice: ${practice.name} (${practice.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
