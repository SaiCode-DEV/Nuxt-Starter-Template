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
    // redirect to login or throw an error if on api route
    if (url.startsWith('/api/')) {
      throw createError({
        statusMessage: 'Unauthenticated',
        statusCode: 403,
      })
    }
    // For non-API routes, redirect to login
    setResponseStatus(event, 302)
    setResponseHeader(event, 'Location', '/auth/login')
    return
  }
})

const UnauthenticatedPaths = ['/auth', '/api/auth', '/api/health', '/ws/']
