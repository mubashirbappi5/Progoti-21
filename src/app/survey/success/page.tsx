"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { Heart, Home, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const submissionId = searchParams.get("id");

  useEffect(() => {
    // Launch celebratory confetti burst
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#D4AF37", "#F59E0B", "#38BDF8", "#FFFFFF"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#D4AF37", "#F59E0B", "#38BDF8", "#FFFFFF"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg rounded-3xl glass-panel-glow p-8 sm:p-12 text-center relative overflow-hidden border border-amber-500/30 shadow-2xl"
      >
        {/* Animated Celebration Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-navy-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30 mb-6"
        >
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </motion.div>

        {/* Name greeting if available */}
        {name && (
          <p className="text-sm font-semibold text-amber-300 mb-1">
            Dear {name},
          </p>
        )}

        {/* Heading: Thank You! */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Thank You!
        </h1>

        {/* Secondary text */}
        <p className="mt-4 text-base sm:text-lg text-slate-200 font-medium leading-relaxed">
          Your opinion matters to us. Your response has been successfully submitted.
        </p>

        {/* Memory message */}
        <p className="mt-3 text-sm sm:text-base text-amber-200/90 leading-relaxed italic">
          &ldquo;Let&apos;s meet again and create unforgettable memories!&rdquo;
        </p>

        {/* Brand Tagline */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-center gap-2">
          <span className="text-xl sm:text-2xl font-black tracking-widest text-white">
            PROGOTI <span className="text-amber-400">21</span>
          </span>
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
        </div>

        {submissionId && (
          <p className="text-[11px] text-slate-400 font-mono mt-3">
            Response ID: {submissionId.slice(0, 8)}...{submissionId.slice(-4)}
          </p>
        )}

        {/* Return Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-navy-950 shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/admin/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-slate-200 bg-navy-900/60 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <span>View Committee Dashboard</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SurveySuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-amber-400">
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
