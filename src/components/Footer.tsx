import Link from "next/link";
import Image from "next/image";
import { Heart, Shield, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100 text-slate-600 py-12 px-4 sm:px-6 lg:px-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-300 bg-white p-0.5">
              <Image
                src="/images/logo.jpg"
                alt="প্রগতি ২১ লোগো"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-slate-900 text-base tracking-wide">
              প্রগতি <span className="text-amber-500">২১</span>
            </span>
            <span className="text-xs bg-amber-500/10 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-medium">
              পুনর্মিলনী ২০২৭
            </span>
          </div>
          <p className="text-xs text-amber-800 font-medium mb-1">
            শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতন (স্থাপিত ২০০৫) • এসএসসি ব্যাচ ২০২১
          </p>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            বন্ধুদের বন্ধন, স্মৃতির মিলনমেলা এবং একটি অবিস্মরণীয় পুনর্মিলনী গড়ে তোলার সম্মিলিত প্রয়াস।
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-600 font-medium">
          <Link
            href="/survey"
            className="hover:text-amber-600 transition-colors flex items-center gap-1"
          >
            সার্ভেতে অংশ নিন <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/#gallery"
            className="hover:text-amber-600 transition-colors flex items-center gap-1"
          >
            ফটো গ্যালারি
          </Link>
          <Link
            href="/admin/login"
            className="hover:text-amber-600 transition-colors flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5 text-amber-500" /> কমিটি লগইন
          </Link>
        </div>

        <div className="text-center md:text-right text-xs text-slate-500">
          <p className="flex items-center justify-center md:justify-end gap-1 font-medium text-slate-700">
            আন্তরিক ভালোবাসায় <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> প্রগতি ২১ পুনর্মিলনী কমিটি
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            © ২০২৭ প্রগতি ২১। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-xs text-slate-600 mt-1.5 font-medium">
            Developed by{" "}
            <a
              href="https://www.mubashirbappi.live/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-amber-700 hover:text-amber-800 hover:underline underline-offset-2 transition-colors"
            >
              Mubashir Bappi
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
