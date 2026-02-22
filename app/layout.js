// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; // Import your new Navbar

// Configure the Inter font
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata = {
  title: "KaamZone | Digital Labor Marketplace",
  description: "Secure, Nationwide Labor Marketplace in Pakistan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-slate-50 antialiased`}>
        {/* The Navbar will now sit at the top of every page */}
        <Navbar /> 
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}