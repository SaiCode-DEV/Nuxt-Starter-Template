/**
 * Returns the WebAuthn Relying Party configuration derived from env or request origin.
 */
export function getRpConfig(origin: string) {
  // Prefer explicit env vars; fall back to deriving from request origin
  const rpID =
    process.env.WEBAUTHN_RP_ID || new URL(origin).hostname

  const rpName = process.env.WEBAUTHN_RP_NAME || 'BWRP Quests'

  // Allow multiple expected origins (comma-separated) or derive from rpID
  const expectedOrigins = process.env.WEBAUTHN_ORIGIN
    ? process.env.WEBAUTHN_ORIGIN.split(',').map(o => o.trim())
    : [origin]

  return { rpID, rpName, expectedOrigins }
}
