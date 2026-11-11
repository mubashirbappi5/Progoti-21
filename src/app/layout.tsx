import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "প্রগতি ২১ – ঈদুল ফিতর পুনর্মিলনী জরিপ ২০২৭",
  description:
    "আসুন আমাদের পুনর্মিলনীকে স্মরণীয় করে তুলি! প্রগতি ২১ ব্যাচের ঈদুল ফিতর পুনর্মিলনী ২০২৭ এর জরিপে আপনার মতামত দিন।",
  keywords: [
    "প্রগতি ২১",
    "Progoti 21",
    "ঈদ পুনর্মিলনী",
    "Eid Reunion 2027",
    "প্রগতি ২১ জরিপ",
    "ব্যাচ ২১ পুনর্মিলনী",
  ],
  authors: [{ name: "প্রগতি ২১ পুনর্মিলনী কমিটি" }],
  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
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
    <html lang="bn" suppressHydrationWarning className="dark scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('progoti_theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
