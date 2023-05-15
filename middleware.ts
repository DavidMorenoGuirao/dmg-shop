// import { NextResponse, NextRequest, NextFetchEvent } from 'next/server';
// // import type { NextRequest } from 'next/server';
// // import type { Session } from './interfaces' 
// import { getToken } from 'next-auth/jwt';
 
// export async function middleware(req: NextRequest | any, ev: NextFetchEvent ) {
//   const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
 
 
//   if (!session) { 
//     if (req.nextUrl.pathname.startsWith('/api/admin')) {
//       return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
//     } 
//     const requestedPage = req.nextUrl.pathname;
//     return NextResponse.redirect(new URL(`/auth/login?p=${requestedPage}`, req.url));;
//   };
 
//   const validRoles = ['admin'];
//   if (req.nextUrl.pathname.startsWith('/admin')) {
//     if (!validRoles.includes(session.user.role)) {
//       return NextResponse.redirect(new URL('/', req.url));
//     }
//   };
 
//   if (req.nextUrl.pathname.startsWith('/api/admin')) {
//     if (!validRoles.includes(session.user.role)) {
//       return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
//     }
//   };
 
//   return NextResponse.next();
// }
 
// export const config = {
//   matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*'],
// };

// middleware.ts
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
 
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const requestedPage = req.nextUrl.pathname;
    const validRoles = ['admin', 'super-user', 'SEO'];
 
    if( !session ){
        const url = req.nextUrl.clone();
 
        url.pathname = `/auth/login`;
        url.search = `p=${ requestedPage }`;
        
        if( requestedPage.includes('/api') ){
          return new Response( JSON.stringify({ message: 'No autorizado' }),{
            status: 401,
            headers:{
              'Content-Type':'application/json'
            }
          });
        };
 
        return NextResponse.redirect( url );
    };
 
    if( requestedPage.includes('/api/admin') && !validRoles.includes( session.user.role ) ){
 
      return new Response( JSON.stringify({ message: 'No autorizado' }),{
        status: 401,
        headers:{
          'Content-Type':'application/json'
        }
        });
    };
 
    if( requestedPage.includes('/admin') && !validRoles.includes( session.user.role ) ){
 
      return NextResponse.redirect(new URL('/', req.url));
    };
 
    return NextResponse.next();
};
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/checkout/:path*','/orders/:path*','/api/orders/:path*','/admin/:path*','/api/admin/:path*'],
};





// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req: NextRequest) {

//     const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//     // Informacion util del usuario
    
//     if (!session) {
//         const requestedPage = req.nextUrl.pathname;
//         const url = req.nextUrl.clone();
//         url.pathname = "/auth/login";
//         url.search = `p=${requestedPage}`;

//         return NextResponse.redirect(url);
//     }
//     // return NextResponse.redirect(new URL("/auth/login", req.url));
//     return NextResponse.next();
// }

// export const config = {
//     matcher: ["/checkout/address", "/checkout/summary"]
// };