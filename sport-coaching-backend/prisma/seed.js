const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const roleRecords = await Promise.all(
    ["ADMIN", "COACH", "CLIENT"].map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name }
      })
    )
  );

  const [adminRole, coachRole, clientRole] = roleRecords;
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@sportcoach.app" },
    update: {},
    create: {
      email: "admin@sportcoach.app",
      password: passwordHash,
      roleId: adminRole.id,
      admin: { create: {} }
    }
  });

  const coach = await prisma.user.upsert({
    where: { email: "coach@sportcoach.app" },
    update: {},
    create: {
      email: "coach@sportcoach.app",
      password: passwordHash,
      roleId: coachRole.id,
      coach: { create: {} }
    },
    include: { coach: true }
  });

  await prisma.user.upsert({
    where: { email: "client@sportcoach.app" },
    update: {},
    create: {
      email: "client@sportcoach.app",
      password: passwordHash,
      roleId: clientRole.id
    }
  });

  if (coach.coach) {
    await prisma.session.createMany({
      data: [
        {
          title: "HIIT Full Body",
          description: "Intense workout for all levels",
          date: new Date(Date.now() + 1000 * 60 * 60 * 24),
          duration: 60,
          maxParticipants: 12,
          coachId: coach.coach.id
        }
      ]
    });
  }

  console.info("Seed completed", { admin: admin.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
