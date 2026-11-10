"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ClipboardEdit, ShieldCheck, Heart } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-500/15 bg-navy-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-navy-950 font-bold shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-navy-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-wider text-white group-hover:text-amber-400 transition-colors">
              PROGOTI <span className="text-amber-400">21</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-widest uppercase font-medium -mt-1">
              Eid Reunion 2027
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-amber-400 bg-amber-400/10"
                : "text-slate-300 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            Home
          </Link>

          <Link
            href="/survey"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              pathname.startsWith("/survey")
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-navy-950 shadow-md shadow-amber-500/25"
                : "bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
            }`}
          >
            <ClipboardEdit className="w-4 h-4" />
            <span>Survey</span>
          </Link>

          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isAdmin
                ? "text-amber-400 bg-amber-400/10 border border-amber-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400/80" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
