import formidable from 'formidable'
import { promises as fs } from 'fs'
import path from 'path'
import prisma from '~/lib/prisma'
import { requireUser } from '~/server/utils/auth'

export default defineEventHandler(async event => {
  if (event.method === 'POST') {
    return handleUpload(event)
  } else if (event.method === 'DELETE') {
    return handleDelete(event)
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})

async function handleUpload(event: any) {
  const { id: userId } = await requireUser(event)

  try {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowEmptyFiles: false,
      multiples: false,
    })

    const [_fields, files] = await form.parse(event.node.req)
    const file = Array.isArray(files.file) ? files.file[0] : files.file

    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded',
      })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.mimetype || '')) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
      })
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles')
    await fs.mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const fileExtension = path.extname(file.originalFilename || '')
    const filename = `${userId}-${Date.now()}${fileExtension}`
    const filePath = path.join(uploadDir, filename)
    const publicUrl = `/uploads/profiles/${filename}`

    // Move file to destination
    await fs.copyFile(file.filepath, filePath)

    // Clean up temp file
    await fs.unlink(file.filepath)

    // Get current user to delete old profile picture
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { profilePicture: true },
    })

    // Delete old profile picture if it exists
    if (
      currentUser?.profilePicture &&
      currentUser.profilePicture.startsWith('/uploads/')
    ) {
      const oldFilePath = path.join(
        process.cwd(),
        'public',
        currentUser.profilePicture
      )
      try {
        await fs.unlink(oldFilePath)
      } catch (error) {
        // File might not exist, continue
        console.log('Could not delete old profile picture:', error)
      }
    }

    // Update user with new profile picture URL
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profilePicture: publicUrl,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        updatedAt: true,
      },
    })

    return {
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: publicUrl,
        user: updatedUser,
      },
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Profile picture upload error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload profile picture',
    })
  }
}

async function handleDelete(event: any) {
  const { id: userId } = await requireUser(event)

  try {
    // Get current user
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { profilePicture: true },
    })

    if (!dbUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      })
    }

    // Delete profile picture file if it exists
    if (
      dbUser.profilePicture &&
      dbUser.profilePicture.startsWith('/uploads/')
    ) {
      const filePath = path.join(process.cwd(), 'public', dbUser.profilePicture)
      try {
        await fs.unlink(filePath)
      } catch (error) {
        // File might not exist, continue
        console.log('Could not delete profile picture file:', error)
      }
    }

    // Update user to remove profile picture
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profilePicture: null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        updatedAt: true,
      },
    })

    return {
      message: 'Profile picture removed successfully',
      user: updatedUser,
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Profile picture delete error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to remove profile picture',
    })
  }
}
