import { getServerSession } from '#auth'
import { hash, verify } from 'argon2'
import prisma from '~/lib/prisma'

export default defineEventHandler(async event => {
  const session = await getServerSession(event)

  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const body = await readBody(event)
  const { currentPassword, newPassword } = body

  if (!currentPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Current password and new password are required',
    })
  }

  if (newPassword.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'New password must be at least 6 characters long',
    })
  }

  try {
    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        password: true,
      },
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      })
    }

    // Verify current password
    const isCurrentPasswordValid = await verify(user.password, currentPassword)

    if (!isCurrentPasswordValid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Current password is incorrect',
      })
    }

    // Hash new password
    const hashedNewPassword = await hash(newPassword)

    // Update user password
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    })

    return {
      message: 'Password updated successfully',
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Password update error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update password',
    })
  }
})
