import { hash } from 'argon2'
import prisma from '~/lib/prisma'
import type { RegisterData } from '~/lib/types'

export default defineEventHandler(async event => {
  const body: RegisterData = await readBody(event)
  const userExists = await prisma.user.findFirst({
    where: {
      OR: [{ email: body.email }, { username: body.username }],
    },
  })

  if (userExists) {
    throw createError({
      statusCode: 403,
      statusMessage: 'User already exists',
    })
  }

  await prisma.user.create({
    data: {
      email: body.email,
      username: body.username,
      password: await hash(body.password),
    },
  })

  setResponseStatus(event, 201)

  return { message: 'User created' }
})
