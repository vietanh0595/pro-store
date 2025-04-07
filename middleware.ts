import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/cron")) {
    if (
      request.headers.get("Authorization") !==
      `Bearer ${process.env.CRON_SECRET}`
    ) {
      return Response.json(
        { success: false, message: "unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }
  const { auth } = NextAuth(authConfig);
  // @ts-expect-error
  return auth(request);
}
