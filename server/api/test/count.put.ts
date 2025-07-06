import prisma from '~/lib/prisma'

export default defineEventHandler(async event => {
  const { count } = await readBody(event)

  if (typeof count !== 'number') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid count value',
    })
  }

  let testRecord = await prisma.test.findFirst()

  if (!testRecord) {
    testRecord = await prisma.test.create({
      data: {
        count,
      },
    })
  } else {
    testRecord = await prisma.test.update({
      where: { id: testRecord.id },
      data: {
        count,
      },
    })
  }

  // Broadcast the updated count to all connected socket.io clients
  if (event.context.appSocket) {
    event.context.appSocket.emit('count_update', { count: testRecord.count })
  }

  return { count: testRecord.count }
})
