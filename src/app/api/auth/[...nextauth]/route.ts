import NextAuth from 'next-auth'

const authOptions = {
  providers: [
    {
      id: "strava",
      name: "Strava",
      type: "oauth",
      authorization: {
        url: "https://www.strava.com/oauth/authorize",
        params: {
          scope: "read,activity:read_all,profile:read_all",
          response_type: "code",
        }
      },
      token: "https://www.strava.com/oauth/token",
      userinfo: "https://www.strava.com/api/v3/athlete",
      clientId: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
      profile(profile: {
        id: number;
        firstname: string;
        lastname: string;
        email: string;
        profile: string;
      }) {
        return {
          id: profile.id.toString(),
          name: `${profile.firstname} ${profile.lastname}`,
          email: profile.email,
          image: profile.profile,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }: {
      token: any;
      account: any;
    }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: {
      session: any;
      token: any;
    }) {
      return {
        ...session,
        accessToken: token.accessToken,
      }
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
