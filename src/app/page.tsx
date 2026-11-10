"use client";

import Link from "next/link";
import {
  Calendar,
  UtensilsCrossed,
  Gift,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  Heart,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const highlightCards = [
    {
      icon: Calendar,
      title: "Reunion Date",
      desc: "Vote for 2nd day, 3rd day after Eid, or suggest your preferred custom date.",
      badge: "Schedule",
    },
    {
      icon: UtensilsCrossed,
      title: "Food & Feast",
      desc: "Authentic Biryani, Morog Pulao, or special meal arrangements tailored for the batch.",
      badge: "Dining",
    },
    {
      icon: Gift,
      title: "Reunion Keepsakes",
      desc: "Customized commemorative gift boxes or signature batch t-shirts for every member.",
      badge: "Gifts",
    },
    {
      icon: Users,
      title: "Activities & Fun",
      desc: "Choose the games and musical sessions you love—and eliminate repetitive speeches.",
      badge: "Memories",
    },
  ];

  return (
    <div className="relative overflow-hidden flex flex-col justify-center">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-amber-500/15 via-blue-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute -top-32 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-96 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-28 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Subtitle / Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-900/90 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold shadow-lg shadow-amber-500/10 mb-8"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="tracking-wide">PROGOTI 21 – Eid-ul-Fitr Reunion Survey 2027</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]"
        >
          Let&apos;s Make Our <br className="hidden sm:inline" />
          <span className="gold-gradient-text drop-shadow-sm">Reunion Memorable!</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          After Eid-ul-Fitr, we are planning to bring all our friends together again.
          Share your preferences and help us organize an unforgettable reunion.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/survey"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-navy-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
          >
            <span>Share Your Opinion</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="#highlights"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base text-slate-200 bg-navy-900/80 border border-slate-700/60 hover:bg-navy-800/80 hover:border-amber-500/30 transition-all duration-200"
          >
            <span>Explore Survey Topics</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </motion.div>

        {/* Feature Highlights Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left"
        >
          <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-900/40 border border-slate-800/60">
            <div className="p-2 rounded-md bg-amber-400/10 text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Reunion Date</p>
              <p className="text-sm font-semibold text-white">Post Eid-ul-Fitr</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-900/40 border border-slate-800/60">
            <div className="p-2 rounded-md bg-amber-400/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Duration</p>
              <p className="text-sm font-semibold text-white">Full Day Reunion</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-900/40 border border-slate-800/60">
            <div className="p-2 rounded-md bg-amber-400/10 text-amber-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Participants</p>
              <p className="text-sm font-semibold text-white">Progoti 21 Batch</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-900/40 border border-slate-800/60">
            <div className="p-2 rounded-md bg-amber-400/10 text-amber-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Database</p>
              <p className="text-sm font-semibold text-white">Neon PostgreSQL</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Survey Highlights Cards */}
      <section id="highlights" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Your Voice Shapes Our Reunion
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Take 2 minutes to share what you want to experience—and what you&apos;d love to avoid.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlightCards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl glass-panel border border-amber-500/15 hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-navy-950 transition-colors">
                    <card.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-amber-300/80 uppercase tracking-wider bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Included in survey</span>
                <CheckCircle2 className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reunion Promise Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-navy-900 via-navy-900 to-amber-950/30 border border-amber-500/20 relative overflow-hidden text-center shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <Heart className="w-10 h-10 text-amber-400 mx-auto mb-4 fill-amber-400/20" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Every Opinion Directly Counts
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            The reunion organizing committee will finalize the venue, schedule, menu, and gifts
            based on the majority results calculated in our real-time analytics dashboard.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/survey"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-navy-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <span>Take the Survey Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
