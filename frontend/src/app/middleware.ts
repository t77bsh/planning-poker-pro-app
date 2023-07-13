import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get a cookie
  let sessionIdCookie = request.cookies.get("connect.sid");
  console.log(sessionIdCookie)

  // Get all cookies
  const allCookies = request.cookies.getAll();
  console.log(allCookies)
  return NextResponse.next();
}
