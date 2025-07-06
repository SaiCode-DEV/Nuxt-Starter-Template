import type { H3Event } from 'h3'
import type { Socket } from 'socket.io'
import { Server } from 'socket.io'

// This is a simplified in-memory store. For production, you'd want a more robust solution.
const countSubscribers = new Set<Socket>()

// Define a global object to hold the socket.io server instance
declare global {
  var io: Server | undefined
}

export const appSocket = {
  emit: (channel: string, ...args: any[]) => {
    if (global.io) {
      global.io.emit(channel, ...args)
    }
  },
}

export default defineEventHandler((event: H3Event) => {
  // Attach the appSocket to the event context
  event.context.appSocket = appSocket

  // If the socket.io server is already running, we're done.
  if (global.io) {
    return
  }

  // Get the underlying Node.js server from the H3 event
  // @ts-ignore
  const httpServer = event.node.res.socket?.server
  if (httpServer) {
    // Create a new socket.io server
    const io = new Server(httpServer)

    io.on('connection', (socket: Socket) => {
      console.log(`[socket.io] user connected: ${socket.id}`)

      // Add the new socket to our set of subscribers
      countSubscribers.add(socket)

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`[socket.io] user disconnected: ${socket.id}`)
        countSubscribers.delete(socket)
      })
    })

    // Store the server instance in the global scope
    global.io = io
  }
})
