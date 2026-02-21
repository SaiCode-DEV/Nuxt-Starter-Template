export default eventHandler(async event => {
  const url = event.node.req.url

  // Skip authentication for certain paths
  if (
    url?.startsWith('/api/login') ||
    url?.startsWith('/api/logout') ||
    url?.startsWith('/api/register') ||
    url?.startsWith('/api/public') ||
    url === '/api/health' ||
    url === '/api/user/me' ||
    url?.startsWith('/api/passkey/') ||
    url === '/api/auth/login' ||
    url === '/api/auth/logout' ||
    !url?.startsWith('/api/')) {
    return
  }

  const { user } = await getUserSession(event)
  if (!user) {
    // redirect to login or throw an error if on api route
    setResponseHeader(event, 'Cache-Control', 'no-store') // Prevent caching of the response
    setResponseHeader(event, 'Location', '/auth/login')

    throw createError({
      statusMessage: 'Unauthenticated',
      statusCode: 302,
    })
  }
})
