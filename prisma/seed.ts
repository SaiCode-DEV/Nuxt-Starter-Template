import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'

const pool = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter: pool })

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
