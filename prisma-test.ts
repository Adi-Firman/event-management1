import { prisma } from './src/lib/prisma';  // Sesuaikan path

async function main() {
  // Contoh query
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });