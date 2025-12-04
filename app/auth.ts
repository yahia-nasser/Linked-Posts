import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  pages: { signIn: "/login" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const response = await fetch(`${process.env.API_URL}/users/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const payload = await response.json();
        if (response.ok && payload.message === "success") {
          const decoded: { user: string; exp?: number } = jwtDecode(
            payload.token
          );

          return {
            id: decoded.user,
            name: `User ${decoded.user.slice(0, 5)}`,
            email: `${decoded.user.slice(0, 5)}@example.com`,
            accessToken: payload.token,
            accessTokenExpires: decoded.exp ? decoded.exp * 1000 : null,
          };
        } else {
          throw new Error(payload.message || "Invalid Email or Password");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          accessToken: user.accessToken,
          accessTokenExpires: user.accessTokenExpires,
        };
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return { ...token, error: "TokenExpiredError" };
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        name: token.name,
        email: token.email,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
};
