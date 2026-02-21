import type { AuthenticatorTransportFuture } from '@simplewebauthn/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import prisma from '~/lib/prisma'
import { requireUser } from '~/server/utils/auth'
import { getRpConfig } from '~/server/utils/passkeyConfig'
import { setRegistrationChallenge } from '~/server/utils/passkeyStore'

export default defineEventHandler(async event => {
  const sessionUser = await requireUser(event)
  const userId = sessionUser.id

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { passkeys: true },
  })

  if (!dbUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const origin = getRequestHeader(event, 'origin') || 'http://localhost:3000'
  const { rpID, rpName } = getRpConfig(origin)

  // Exclude already-registered passkeys so they can't be re-registered
  const excludeCredentials = dbUser.passkeys.map(pk => ({
    id: pk.id,
    transports: JSON.parse(pk.transports) as AuthenticatorTransportFuture[],
  }))

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: new TextEncoder().encode(String(userId)),
    userName: dbUser.username,
    userDisplayName: dbUser.username,
    attestationType: 'none',
    excludeCredentials,
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  })

  setRegistrationChallenge(String(userId), options.challenge)

  return options
})
