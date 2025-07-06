import { defineWebSocketHandler } from 'h3'

// Store active WebSocket connections
// IMPORTANT: In a real-world scenario with multiple server instances,
// this in-memory store won't work. You'd need a pub/sub system like Redis.
export const countSubscribers = new Set<any>() // Store peer objects

export default defineWebSocketHandler({
  open(peer) {
    console.log('[ws] count: open', peer)
    countSubscribers.add(peer)
  },

  message(peer, message) {
    console.log('[ws] count: message', peer, message)
    // We don't expect messages from client for this simple case
  },

  close(peer, event) {
    console.log('[ws] count: close', peer, event)
    countSubscribers.delete(peer)
  },

  error(peer, error) {
    console.log('[ws] count: error', peer, error)
    countSubscribers.delete(peer) // Remove on error as well
  },
})

// Function to broadcast count updates
export function broadcastCountUpdate(newCount: number) {
  console.log(
    `[ws] count: Broadcasting count update: ${newCount} to ${countSubscribers.size} subscribers`
  )
  for (const peer of countSubscribers) {
    try {
      peer.send(JSON.stringify({ type: 'count_update', count: newCount }))
    } catch (err) {
      console.error('[ws] count: Error sending message to peer:', err)
      // Optionally remove peer if send fails repeatedly
      // countSubscribers.delete(peer)
    }
  }
}
