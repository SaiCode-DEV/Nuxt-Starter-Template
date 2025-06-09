// Session management utilities for handling user deletions and session invalidation

import prisma from '~/lib/prisma'

/**
 * Invalidate all sessions for a specific user by checking if user exists
 * This works by leveraging the JWT/session callbacks that validate user existence
 */
export async function invalidateUserSessions(userId: number): Promise<void> {
  try {
    // Verify user doesn't exist
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (user) {
      console.warn(
        `Attempted to invalidate sessions for existing user ${userId}`
      )
      return
    }

    // Since NextAuth doesn't provide direct session invalidation,
    // the JWT and session callbacks will handle invalidation when
    // they try to verify the user and find they don't exist
    console.log(
      `Sessions for deleted user ${userId} will be invalidated on next request`
    )
  } catch (error) {
    console.error('Error in session invalidation:', error)
    throw error
  }
}

/**
 * Check if a user exists and their session should remain valid
 */
export async function validateUserForSession(userId: number): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    })

    return !!user
  } catch (error) {
    console.error('Error validating user for session:', error)
    return false
  }
}
