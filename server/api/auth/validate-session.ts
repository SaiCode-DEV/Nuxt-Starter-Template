import { createError, defineEventHandler } from 'h3'
import { requireUser } from '~/server/utils/auth'
import { validateUserForSession } from '~/server/utils/sessionManager'

export default defineEventHandler(async event => {
  const { id: userId } = await requireUser(event)
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
