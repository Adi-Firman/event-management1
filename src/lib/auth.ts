import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma"
// Removed incorrect import of authOptions

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub // inject user id ke session
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}


export default NextAuth(authOptions)
export { authOptions as authOptions }


