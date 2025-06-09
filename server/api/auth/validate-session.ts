import { getServerSession } from '#auth'
import { createError, defineEventHandler } from 'h3'
import { validateUserForSession } from '~/server/utils/sessionManager'

export default defineEventHandler(async event => {
  const session = await getServerSession(event)

  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No active session',
    })
  }

  const userId = Number(session.user.id)
  const isValid = await validateUserForSession(userId)

  if (!isValid) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Session is no longer valid - user may have been deleted',
    })
  }

  return {
    valid: true,
    userId,
    message: 'Session is valid',
  }
})
