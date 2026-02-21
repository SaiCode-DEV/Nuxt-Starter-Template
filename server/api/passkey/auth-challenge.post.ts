import type { AuthenticatorTransportFuture } from '@simplewebauthn/server'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import prisma from '~/lib/prisma'
import { getRpConfig } from '~/server/utils/passkeyConfig'
import { setAuthenticationChallenge } from '~/server/utils/passkeyStore'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  // username is optional – if omitted we do a discoverable-credential flow
  const { username } = body ?? {}

  const origin = getRequestHeader(event, 'origin') || 'http://localhost:3000'
  const { rpID } = getRpConfig(origin)

  let allowCredentials: {
    id: string
    transports: AuthenticatorTransportFuture[]
  }[] = []
  let challengeKey = 'anonymous'

  if (username) {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { passkeys: true },
    })

    if (!user || user.passkeys.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No passkeys registered for this user',
      })
    }

    allowCredentials = user.passkeys.map(pk => ({
      id: pk.id,
      transports: JSON.parse(pk.transports) as AuthenticatorTransportFuture[],
    }))
    challengeKey = `user:${user.id}`
  }

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: allowCredentials.length > 0 ? allowCredentials : [],
    userVerification: 'preferred',
  })

  setAuthenticationChallenge(challengeKey, options.challenge)

  return { ...options, challengeKey }
})
