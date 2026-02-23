// app/layout.js
import { auth } from '@/auth';
import Navbar from '@/components/Navbar';
import './globals.css';

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar session={session} />
        {children}
      </body>
    </html>
  );
}