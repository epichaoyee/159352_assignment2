import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Plane } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dairy Flat Airways",
  description: "Boutique airline service from Dairy Flat Airport",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" className="flex items-center gap-2">
                <Plane className="h-8 w-8 text-primary-600" />
                <span className="font-bold text-xl text-gray-900">Dairy Flat Airways</span>
              </Link>
              <div className="flex gap-6">
                <Link href="/" className="text-gray-600 hover:text-primary-600 font-medium">Search Flights</Link>
                <Link href="/my-bookings" className="text-gray-600 hover:text-primary-600 font-medium">My Bookings</Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-[calc(100vh-64px)] bg-gray-50">
          {children}
        </main>
        <footer className="bg-white border-t py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
            <p>&copy; 2026 Dairy Flat Airways. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
