import NextAuth from 'next-auth'
import StravaProvider from 'next-auth/providers/strava'

const authOptions = {
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read,activity:read_all,profile:read_all"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: any) {
      return {
        ...session,
        accessToken: token.accessToken,
      }
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
