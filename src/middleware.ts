import { type NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const access = req.cookies.get("access");
  if (!access?.value) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callback", req.nextUrl.pathname);

    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: "/((?!api|_next/image|_next/static|favicon.ico|login|OneSignalSDKWorker.js|guest/s/default|.well-known).*)",
};