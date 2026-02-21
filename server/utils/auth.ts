import type { H3Event } from 'h3'

export interface SessionUser {
  id: number
  username: string
  email: string
  image?: string | null
}

/**
 * Returns the authenticated session user or throws 401.
 * Provides proper TypeScript types without requiring a full nuxt prepare.
 */
export async function requireUser(event: H3Event): Promise<SessionUser> {
  const { user } = await getUserSession(event)
  const sessionUser = user as SessionUser | undefined
  if (!sessionUser?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return sessionUser
}
