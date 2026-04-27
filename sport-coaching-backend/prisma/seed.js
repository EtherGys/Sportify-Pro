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
    where: { email: "admin@sportcoach.com" },
    update: {},
    create: {
      email: "admin@sportcoach.com",
      password: passwordHash,
      roleId: adminRole.id,
      admin: { create: {} }
    }
  });

  const coach = await prisma.user.upsert({
    where: { email: "coach@sportcoach.com" },
    update: {},
    create: {
      email: "coach@sportcoach.com",
      password: passwordHash,
      roleId: coachRole.id,
      coach: { create: {} }
    },
    include: { coach: true }
  });

  // 🔹 NOUVEAUX COACHS
  const coach2 = await prisma.user.upsert({
    where: { email: "coach2@sportcoach.com" },
    update: {},
    create: {
      email: "coach2@sportcoach.com",
      password: passwordHash,
      roleId: coachRole.id,
      coach: { create: {} }
    },
    include: { coach: true }
  });

  const coach3 = await prisma.user.upsert({
    where: { email: "coach3@sportcoach.com" },
    update: {},
    create: {
      email: "coach3@sportcoach.com",
      password: passwordHash,
      roleId: coachRole.id,
      coach: { create: {} }
    },
    include: { coach: true }
  });

  await prisma.user.upsert({
    where: { email: "client@sportcoach.com" },
    update: {},
    create: {
      email: "client@sportcoach.com",
      password: passwordHash,
      roleId: clientRole.id
    }
  });

  // 🔹 SESSIONS COACH 1
  if (coach.coach) {
    await prisma.session.createMany({
      data: [
        {
          title: "HIT Full Body",
          description: "Séance intense pour tous niveaux",
          date: new Date(Date.now() + 1000 * 60 * 60 * 24),
          duration: 60,
          maxParticipants: 12,
          coachId: coach.coach.id
        },
        {
          title: "Cardio Express",
          description: "Petite séancce de cardio",
          date: new Date(Date.now() + 1000 * 60 * 60 * 48),
          duration: 45,
          maxParticipants: 10,
          coachId: coach.coach.id
        },
        {
          title: "Entraitenement muscles profonds",
          description: "On va se concentrer sur les abdos et le renforcement musculaire",
          date: new Date(Date.now() + 1000 * 60 * 60 * 72),
          duration: 50,
          maxParticipants: 8,
          coachId: coach.coach.id
        }
      ]
    });
  }

  // 🔹 SESSIONS COACH 2
  if (coach2.coach) {
    await prisma.session.createMany({
      data: [
        {
          title: "Yoga Flow",
          description: "Séance de yoga en mode relaxation et flexibilité !",
          date: new Date(Date.now() + 1000 * 60 * 60 * 24),
          duration: 60,
          maxParticipants: 10,
          coachId: coach2.coach.id
        },
        {
          title: "Etirement & mobilité",
          description: "Mon but : améliorer votre felxilité et votre mobilité",
          date: new Date(Date.now() + 1000 * 60 * 60 * 48),
          duration: 45,
          maxParticipants: 8,
          coachId: coach2.coach.id
        }
      ]
    });
  }

  // 🔹 SESSIONS COACH 3
  if (coach3.coach) {
    await prisma.session.createMany({
      data: [
        {
          title: "Entrainement de force",
          description: "On va travailler les muscles et la force",
          date: new Date(Date.now() + 1000 * 60 * 60 * 24),
          duration: 70,
          maxParticipants: 6,
          coachId: coach3.coach.id
        },
        {
          title: "Bootcamp",
          description: "Outdoor intense training",
          date: new Date(Date.now() + 1000 * 60 * 60 * 48),
          duration: 60,
          maxParticipants: 12,
          coachId: coach3.coach.id
        },
        {
          title: "Functional Training",
          description: "Everyday movement improvement",
          date: new Date(Date.now() + 1000 * 60 * 60 * 72),
          duration: 55,
          maxParticipants: 10,
          coachId: coach3.coach.id
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