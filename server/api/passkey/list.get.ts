import prisma from '~/lib/prisma'
import { requireUser } from '~/server/utils/auth'

export default defineEventHandler(async event => {
  const { id: userId } = await requireUser(event)

  const passkeys = await prisma.passkey.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      backedUp: true,
      createdAt: true,
      lastUsedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return passkeys
})
