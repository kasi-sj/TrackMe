import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

export function middleware(req: NextRequest, event: NextFetchEvent) {
    const url = req.url;
    if (url.endsWith('dashboard')) {
        
    }
  return NextResponse.next();
}
