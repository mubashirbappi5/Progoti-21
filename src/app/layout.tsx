import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "PROGOTI 21 – Eid-ul-Fitr Reunion Survey 2027",
  description:
    "Let's make our reunion memorable! Share your preferences for the Progoti 21 Eid-ul-Fitr Reunion 2027.",
  keywords: [
    "Progoti 21",
    "Eid Reunion",
    "Reunion Survey",
    "Progoti 21 Survey",
    "Batch 21 Reunion 2027",
  ],
  authors: [{ name: "Progoti 21 Committee" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-navy-950 text-slate-100 selection:bg-amber-500 selection:text-navy-950">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
