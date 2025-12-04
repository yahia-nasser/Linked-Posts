import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      accessToken: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    accessTokenExpires: date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    accessTokenExpires: date;
  }
}
