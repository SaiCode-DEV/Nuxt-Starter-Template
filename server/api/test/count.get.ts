import prisma from '~/lib/prisma'

export default defineEventHandler(async () => {
  let testRecord = await prisma.test.findFirst()

  if (!testRecord) {
    testRecord = await prisma.test.create({
      data: {
        count: 0,
      },
    })
  }

  return { count: testRecord.count }
})
