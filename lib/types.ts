// Global type definitions for the application

export interface User {
  id: number
  email: string
  username: string
  password: string
  profilePicture?: string | null
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date | null
}

export interface AuthCredentials {
  username: string
  password: string
}

export interface AuthToken {
  id?: number
  nombre?: string
  email?: string | null
  profilePicture?: string | null
  [key: string]: unknown
}

export interface AuthSession {
  user?: {
    id?: number
    nombre?: string
    email?: string | null
    name?: string | null
    image?: string | null
    profilePicture?: string | null
  }
  expires: string
  [key: string]: unknown
}

// Registration form data
export interface RegisterData {
  email: string
  username: string
  password: string
}

// Login form data
export interface LoginData {
  username: string
  password: string
}

// User data without sensitive information (for API responses)
export interface PublicUser {
  id: number
  username: string
  profilePicture?: string | null
  role?: 'USER' | 'ADMIN'
  createdAt: Date
}
