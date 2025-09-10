import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book Fathila",
  description: "Book a session with Fathila: Mentorship, Consultancy, Business Training, or Mass Coaching.",
  icons: {
    icon: "https://fathilananozi.com/storage/fathila-widget-pic-1.png",
  },
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-gradient-to-br from-white via-rose-50 to-pink-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
        <div className="min-h-screen flex justify-center px-4">
          <div className="w-full max-w-2xl py-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
