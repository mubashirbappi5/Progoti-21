"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { Heart, Home, CheckCircle2, School, MapPin } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const submissionId = searchParams.get("id");

  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 text-center shadow-md transition-colors">
        {/* Logo and Checkmark */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-300 bg-white p-1 shadow-sm">
            <Image
              src="/images/logo.jpg"
              alt="প্রগতি ২১ লোগো"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* School Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 border border-amber-500/20 mb-3">
          <School className="w-3.5 h-3.5" />
          <span>শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতন</span>
        </div>

        {/* Name greeting if available */}
        {name && (
          <p className="text-base font-semibold text-amber-600 mb-1">
            প্রিয় {name},
          </p>
        )}

        {/* Heading: ধন্যবাদ! */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          ধন্যবাদ!
        </h1>

        {/* Secondary text */}
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          আপনার মতামত আমাদের জন্য অত্যন্ত মূল্যবান। আপনার সাড়া সফলভাবে জমা হয়েছে।
        </p>

        {/* Warm Batch Photo Card */}
        <div className="mt-5 relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 shadow-sm">
          <div className="relative h-44 sm:h-48 w-full">
            <Image
              src="/images/gallery/batch-group-3.jpg"
              alt="প্রগতি ২১ বন্ধুদের আড্ডা"
              fill
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-3 text-white text-center">
            <p className="text-xs font-semibold text-amber-300 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" />
              ইনশাআল্লাহ আবার দেখা হচ্ছে প্রিয় প্রাঙ্গণে!
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              &ldquo;আসুন আবার দেখা করি এবং অবিস্মরণীয় স্মৃতি তৈরি করি!&rdquo;
            </p>
          </div>
        </div>

        {/* Brand Tagline */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-center gap-2">
          <span className="text-xl font-bold tracking-wide text-slate-900">
            প্রগতি <span className="text-amber-500">২১</span>
          </span>
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
        </div>

        {submissionId && (
          <p className="text-[11px] text-slate-400 font-mono mt-2">
            রেসপন্স আইডি: {submissionId.slice(0, 8)}...{submissionId.slice(-4)}
          </p>
        )}

        {/* Return Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>হোমপেজে ফিরে যান</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SurveySuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-amber-500 font-bold">
          লোড হচ্ছে...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
