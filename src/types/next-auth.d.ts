import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: string
      isEmailVerified: boolean
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    role: string
    isEmailVerified: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    isEmailVerified: boolean
  }
}
