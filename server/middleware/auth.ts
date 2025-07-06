// file: ~/server/middleware/auth.ts
import { getServerSession } from '#auth'

export default eventHandler(async event => {
  const url = event.node.req.url || ''

  // Skip authentication for certain paths
  if (UnauthenticatedPaths.some(path => url.startsWith(path))) {
    return
  }

  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusMessage: 'Unauthenticated',
      statusCode: 403,
    })
  }
})

const UnauthenticatedPaths = ['/api/auth', '/api/health', '/ws/']
