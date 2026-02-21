/**
 * In-memory stores for WebAuthn challenges.
 * Entries expire after 5 minutes to prevent stale data.
 */

const CHALLENGE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface ChallengeEntry {
  challenge: string
  expiresAt: number
}

// userId (string) -> challenge
const registrationChallenges = new Map<string, ChallengeEntry>()

// userIdentifier (username or userId string) -> challenge
const authenticationChallenges = new Map<string, ChallengeEntry>()

function purgeExpired<T extends { expiresAt: number }>(map: Map<string, T>) {
  const now = Date.now()
  for (const [key, entry] of map) {
    if (entry.expiresAt < now) {
      map.delete(key)
    }
  }
}

export function setRegistrationChallenge(userId: string, challenge: string) {
  purgeExpired(registrationChallenges)
  registrationChallenges.set(userId, {
    challenge,
    expiresAt: Date.now() + CHALLENGE_TTL_MS,
  })
}

export function getRegistrationChallenge(userId: string): string | null {
  const entry = registrationChallenges.get(userId)
  if (!entry || entry.expiresAt < Date.now()) {
    registrationChallenges.delete(userId)
    return null
  }
  registrationChallenges.delete(userId)
  return entry.challenge
}

export function setAuthenticationChallenge(key: string, challenge: string) {
  purgeExpired(authenticationChallenges)
  authenticationChallenges.set(key, {
    challenge,
    expiresAt: Date.now() + CHALLENGE_TTL_MS,
  })
}

export function getAuthenticationChallenge(key: string): string | null {
  const entry = authenticationChallenges.get(key)
  if (!entry || entry.expiresAt < Date.now()) {
    authenticationChallenges.delete(key)
    return null
  }
  authenticationChallenges.delete(key)
  return entry.challenge
}
