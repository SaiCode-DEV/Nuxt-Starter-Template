import { NuxtAuthHandler } from '#auth'
import { verify } from 'argon2'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '~/lib/prisma'
import type { AuthCredentials, User } from '~/lib/types'

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/login',
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      async authorize(
        credentials: AuthCredentials | null
      ): Promise<User | null> {
        if (!credentials) return null

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await verify(
            user.password,
            credentials.password
          )

          if (!isPasswordValid) {
            return null
          }

          return user
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user && 'username' in user) {
        token.id = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id
        token.nombre = (user as unknown as User).username
        token.email = user.email
        token.profilePicture = (user as unknown as User).profilePicture
      }

      // Refresh user data from database when session is updated
      if (trigger === 'update' && token.id) {
        try {
          const freshUser = await prisma.user.findUnique({
            where: { id: token.id as number },
            select: {
              id: true,
              username: true,
              email: true,
              profilePicture: true,
            },
          })

          if (freshUser) {
            token.nombre = freshUser.username
            token.email = freshUser.email
            token.profilePicture = freshUser.profilePicture
          }
        } catch (error) {
          console.error('Error refreshing user data:', error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // Always fetch fresh user data for the session
        try {
          const freshUser = await prisma.user.findUnique({
            where: { id: token.id as number },
            select: {
              id: true,
              username: true,
              email: true,
              profilePicture: true,
            },
          })

          if (freshUser) {
            // Extend session.user with fresh data
            const extendedUser = session.user as typeof session.user & {
              id?: number
              nombre?: string
            }
            extendedUser.id = freshUser.id
            extendedUser.nombre = freshUser.username
            extendedUser.email = freshUser.email
            extendedUser.image = freshUser.profilePicture
          }
        } catch (error) {
          console.error('Error fetching user data for session:', error)
          // Fallback to token data if database fetch fails
          const extendedUser = session.user as typeof session.user & {
            id?: number
            nombre?: string
          }
          extendedUser.id = token.id as number
          extendedUser.nombre = token.nombre as string
          extendedUser.email = token.email as string | null
          extendedUser.image = token.profilePicture as string | null
        }
      }
      return session
    },
  },
})
