import { verifyRegistrationResponse } from '@simplewebauthn/server'
import prisma from '~/lib/prisma'
import { requireUser } from '~/server/utils/auth'
import { getRpConfig } from '~/server/utils/passkeyConfig'
import { getRegistrationChallenge } from '~/server/utils/passkeyStore'

export default defineEventHandler(async event => {
  const { id: userId } = await requireUser(event)
  const body = await readBody(event)
  const { response: registrationResponse, name } = body

  if (!registrationResponse) {
    throw createError({ statusCode: 400, statusMessage: 'Missing response' })
  }

  const challenge = getRegistrationChallenge(String(userId))
  if (!challenge) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Challenge expired or not found. Please try again.',
    })
  }

  const origin = getRequestHeader(event, 'origin') || 'http://localhost:3000'
  const { rpID, expectedOrigins } = getRpConfig(origin)

  let verification
  try {
    verification = await verifyRegistrationResponse({
      response: registrationResponse,
      expectedChallenge: challenge,
      expectedOrigin: expectedOrigins,
      expectedRPID: rpID,
      requireUserVerification: false,
    })
  } catch (error) {
    console.error('Registration verification error:', error)
    throw createError({
      statusCode: 400,
      statusMessage: `Passkey verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    })
  }

  if (!verification.verified || !verification.registrationInfo) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Passkey verification failed',
    })
  }

  const { credential, credentialBackedUp } = verification.registrationInfo

  // Check if this credential is already registered
  const existing = await prisma.passkey.findUnique({
    where: { id: credential.id },
  })
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: 'This passkey is already registered',
    })
  }

  await prisma.passkey.create({
    data: {
      id: credential.id,
      userId,
      publicKey: Buffer.from(credential.publicKey).toString('base64'),
      counter: credential.counter,
      backedUp: credentialBackedUp,
      transports: JSON.stringify(credential.transports ?? []),
      name: name || null,
    },
  })

  return { verified: true }
})
