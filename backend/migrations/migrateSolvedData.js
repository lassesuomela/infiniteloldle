const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function migrateSolvedData() {
  const users = await prisma.users.findMany();

  for (const user of users) {
    console.log(`Migrating user ${user.id} (${user.nickname})...`);

    const championIds = new Set(
      (user.solvedChampions || "").split(",").map(Number).filter(Boolean)
    );

    const itemIds = new Set(
      (user.solvedItemIds || "").split(",").map(Number).filter(Boolean)
    );

    const oldItemIds = new Set(
      (user.solvedOldItemIds || "").split(",").map(Number).filter(Boolean)
    );

    const splashIds = new Set(
      (user.solvedSplashChampions || "").split(",").map(Number).filter(Boolean)
    );

    await Promise.all([
      ...[...championIds].map((id) =>
        prisma.userSolvedChampions
          .create({
            data: { userId: user.id, championId: id },
          })
          .catch((err) => {
            if (err.code !== "P2002")
              console.error("Champion insert error:", err);
          })
      ),
      ...[...itemIds].map((id) =>
        prisma.userSolvedItems
          .create({
            data: { userId: user.id, itemId: id },
          })
          .catch((err) => {
            if (err.code !== "P2002") console.error("Item insert error:", err);
          })
      ),
      ...[...oldItemIds].map((id) =>
        prisma.userSolvedOldItems
          .create({
            data: { userId: user.id, oldItemId: id },
          })
          .catch((err) => {
            if (err.code !== "P2002")
              console.error("Old item insert error:", err);
          })
      ),
      ...[...splashIds].map((id) =>
        prisma.userSolvedSplashes
          .create({
            data: { userId: user.id, championId: id },
          })
          .catch((err) => {
            if (err.code !== "P2002")
              console.error("Splash insert error:", err);
          })
      ),
    ]);
  }

  console.log("Done migrating.");
  await prisma.$disconnect();
}

migrateSolvedData();
