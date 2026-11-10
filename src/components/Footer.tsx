import Link from "next/link";
import { Heart, Sparkles, Shield, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-amber-500/10 bg-navy-950/90 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-white text-base tracking-wide">
              PROGOTI <span className="text-amber-400">21</span>
            </span>
            <span className="text-xs bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20">
              Eid Reunion 2027
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Connecting friends, celebrating memories, and building an unforgettable reunion together.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <Link
            href="/survey"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            Take Survey <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/login"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400/70" /> Admin Portal
          </Link>
        </div>

        <div className="text-center md:text-right text-xs text-slate-400">
          <p className="flex items-center justify-center md:justify-end gap-1 font-medium text-slate-400">
            Organized with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> by the Progoti 21 Reunion Committee
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            © {new Date().getFullYear()} Progoti 21. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
