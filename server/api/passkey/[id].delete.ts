import prisma from '~/lib/prisma'
import { requireUser } from '~/server/utils/auth'

export default defineEventHandler(async event => {
  const { id: userId } = await requireUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing passkey ID' })
  }

  const passkey = await prisma.passkey.findUnique({ where: { id } })

  if (!passkey || passkey.userId !== userId) {
    throw createError({ statusCode: 404, statusMessage: 'Passkey not found' })
  }

  await prisma.passkey.delete({ where: { id } })

  return { deleted: true }
})
