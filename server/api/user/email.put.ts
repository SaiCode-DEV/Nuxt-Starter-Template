import { getServerSession } from '#auth'
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
  const { email } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required',
    })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email format',
    })
  }

  try {
    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: session.user.id,
        },
      },
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Email is already taken',
      })
    }

    // Update user email
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        email,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        profilePicture: true,
        updatedAt: true,
      },
    })

    return {
      message: 'Email updated successfully',
      user: updatedUser,
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Email update error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update email',
    })
  }
})
