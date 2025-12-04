import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const authRouts = [
    "/login",
    "/register",
    "/forgotPasswords",
    "/resetPassword",
    "/verifyCode",
  ];
  const registeredRoute = [
    "/",
    "/myPosts",
    "/myProfile",
    "/changePassword",
    "/changeDetails",
  ];

  if (token && authRouts.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && registeredRoute.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/myPosts",
    "/myProfile",
    "/changePassword",
    "/changeDetails",
    "/login",
    "/register",
    "/forgotPasswords",
    "/resetPassword",
    "/verifyCode",
  ],
};
