import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get a cookie
  let sessionId = request.cookies.get("connect.sid")?.value;

  // Get all cookies
  // request.cookies.getAll()

  // To change a cookie, first create a response
  const response = NextResponse.next();

  // Set a cookie
  response.cookies.set("connect.sid", sessionId!);

  // Setting a cookie with additional options
  // response.cookies.set({
  // 	name: 'myCookieName',
  // 	value: 'some-value',
  // 	httpOnly: true,
  // })
  return response;
}
