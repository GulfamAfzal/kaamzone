// middleware.js
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // Exclude /register and /login from being forced to dashboard
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.jpg|register|login).*)'],
};