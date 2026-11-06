import { NextResponse, type NextRequest } from 'next/server';
/** 国の既存ページやデータを葉山町版として見せない。 */
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === '/' || path === '/budget-sankey' || path === '/misato' || path === '/unavailable' || path.startsWith('/_next/')) return NextResponse.next();
  const target = request.nextUrl.clone();
  target.pathname = '/unavailable';
  target.search = '';
  return NextResponse.rewrite(target);
}
export const config = { matcher: ['/((?!_next/static|_next/image).*)'] };
