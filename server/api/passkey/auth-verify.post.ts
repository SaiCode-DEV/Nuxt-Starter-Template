import type { AuthenticatorTransportFuture } from '@simplewebauthn/server'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import prisma from '~/lib/prisma'
import { getRpConfig } from '~/server/utils/passkeyConfig'
import { getAuthenticationChallenge } from '~/server/utils/passkeyStore'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { response: authResponse, challengeKey } = body

  if (!authResponse || !challengeKey) {
    throw createError({ statusCode: 400, statusMessage: 'Missing parameters' })
  }

  const challenge = getAuthenticationChallenge(challengeKey)
  if (!challenge) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Challenge expired or not found. Please try again.',
    })
  }

  // Look up the passkey by credential ID
  const passkey = await prisma.passkey.findUnique({
    where: { id: authResponse.id },
    include: { user: true },
  })

  if (!passkey) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Passkey not found',
    })
  }

  const origin = getRequestHeader(event, 'origin') || 'http://localhost:3000'
  const { rpID, expectedOrigins } = getRpConfig(origin)

  let verification
  try {
    verification = await verifyAuthenticationResponse({
      response: authResponse,
      expectedChallenge: challenge,
      expectedOrigin: expectedOrigins,
      expectedRPID: rpID,
      credential: {
        id: passkey.id,
        publicKey: new Uint8Array(Buffer.from(passkey.publicKey, 'base64')),
        counter: Number(passkey.counter),
        transports: JSON.parse(
          passkey.transports
        ) as AuthenticatorTransportFuture[],
      },
      requireUserVerification: false,
    })
  } catch (error) {
    console.error('Authentication verification error:', error)
    throw createError({
      statusCode: 400,
      statusMessage: `Passkey authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    })
  }

  if (!verification.verified) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Passkey authentication failed',
    })
  }

  // Update the counter to prevent replay attacks
  await prisma.passkey.update({
    where: { id: passkey.id },
    data: {
      counter: BigInt(verification.authenticationInfo.newCounter),
      lastUsedAt: new Date(),
    },
  })

  // Set the nuxt-auth-utils session directly
  await setUserSession(event, {
    user: {
      id: passkey.user.id,
      username: passkey.user.username,
      email: passkey.user.email,
      image: passkey.user.profilePicture ?? null,
    },
  })

  return { verified: true }
})
