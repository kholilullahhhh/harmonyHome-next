const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.room
  .findMany({ select: { id: true, slug: true, price: true } })
  .then(async (rooms) => {
    console.log(JSON.stringify(rooms, null, 1));
    await prisma.$disconnect();
  })
  .catch((e) => {
    console.error('ERR', e.message);
    process.exit(1);
  });