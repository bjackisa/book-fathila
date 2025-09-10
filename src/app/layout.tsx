import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book Fathila",
  description: "Book a session with Fathila: Mentorship, Consultancy, Business Training, or Mass Coaching.",
  icons: {
    icon: "https://fathilananozi.com/storage/fathila-widget-pic-1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
