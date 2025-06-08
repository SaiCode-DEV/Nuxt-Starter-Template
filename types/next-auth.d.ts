import type { DefaultSession, DefaultUser } from 'next-auth'
import type { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id?: number
      nombre?: string
      email?: string | null
      name?: string | null
      image?: string | null
      profilePicture?: string | null
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: number
    username: string
    profilePicture?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: number
    nombre?: string
    profilePicture?: string | null
  }
}
