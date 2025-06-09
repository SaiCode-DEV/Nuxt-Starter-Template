import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()

async function main() {
  // Check if there are any users already
  const userCount = await prisma.user.count()
  if (userCount > 0) {
    console.log('Database already has users, skipping seeding')
    return
  }

  // Create default admin user
  await prisma.user.create({
    data: {
      email: 'admin@admins.local',
      username: 'admin',
      password: await hash('admin123'),
      role: 'ADMIN',
    },
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
