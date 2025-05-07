import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { adapter } from '@/lib/adapter'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter,
  session: {
    strategy: 'database',
  },
})

export { handler as GET, handler as POST }
