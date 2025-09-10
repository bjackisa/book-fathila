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
      <body className="antialiased min-h-screen">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl space-y-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
