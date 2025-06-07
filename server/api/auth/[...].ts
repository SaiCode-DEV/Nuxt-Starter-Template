import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import { verify } from "argon2"
import prisma from '~/lib/prisma'
import type { User, AuthCredentials } from '~/lib/types'

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/login',
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({      async authorize (credentials: AuthCredentials | null): Promise<User | null> {
        if (!credentials) return null

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          })

          if(!user) {
            return null
          }

          const isPasswordValid = await verify(user.password, credentials.password)

          if (!isPasswordValid) {
            return null
          }

          return user
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],  callbacks: {
    async jwt({ token, user }) {
      if (user && 'username' in user) { 
        token.id = user.id
        token.nombre = (user as unknown as User).username
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // Extend session.user with our custom properties
        const extendedUser = session.user as typeof session.user & {
          id?: number
          nombre?: string
        }
        extendedUser.id = token.id as number
        extendedUser.nombre = token.nombre as string
        extendedUser.email = token.email as string | null
      }
      return session
    },
  },
})