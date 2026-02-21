export default eventHandler(async event => {
  const { user } = await getUserSession(event)
  return user || 'no session present'
})
