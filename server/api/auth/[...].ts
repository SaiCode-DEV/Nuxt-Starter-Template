// Catch-all for /api/auth/* — specific endpoints (login.post.ts, logout.post.ts) take precedence.
// Remaining requests return 404.
export default defineEventHandler(() => {
  throw createError({ statusCode: 404, statusMessage: 'Not found' })
})
