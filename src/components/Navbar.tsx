"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ClipboardEdit, ShieldCheck, Image as ImageIcon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.01]"
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white p-0.5 shadow-sm">
            <Image
              src="/images/logo.jpg"
              alt="প্রগতি ২১ লোগো"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl sm:text-2xl tracking-wide text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
              প্রগতি <span className="text-amber-500 dark:text-amber-400">২১</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5 truncate max-w-[180px] sm:max-w-none">
              শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতন
            </span>
          </div>
        </Link>

        {/* Navigation Links + Theme Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              হোম
            </Link>

            <Link
              href="/#gallery"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>স্মৃতি অ্যালবাম</span>
            </Link>

            <Link
              href="/survey"
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                pathname.startsWith("/survey")
                  ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
              }`}
            >
              <ClipboardEdit className="w-4 h-4" />
              <span>মতামত দিন</span>
            </Link>

            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isAdmin
                  ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40"
              }`}
              title="অ্যাডমিন প্যানেল"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span className="hidden sm:inline">অ্যাডমিন</span>
            </Link>
          </nav>

          {/* Theme Toggle Button */}
          <div className="pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
