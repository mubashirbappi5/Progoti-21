"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  Sparkles,
} from "lucide-react";

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  caption: string;
  category: "campus" | "memories";
  categoryLabel: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "campus-wide",
    src: "/images/gallery/campus-wide.jpg",
    title: "আমাদের প্রাণের প্রিয় ক্যাম্পাস",
    caption:
      "শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতনের শ্যামল সবুজ মাঠ, বিদ্যালয় ভবন ও স্মৃতিময় চত্বর।",
    category: "campus",
    categoryLabel: "ক্যাম্পাস",
  },
  {
    id: "school-gate",
    src: "/images/gallery/school-gate.jpg",
    title: "প্রতিষ্ঠানের ঐতিহাসিক প্রবেশদ্বার",
    caption:
      "শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতন (স্থাপিত: ২০০৫ সন) — যেখান থেকে শুরু হয়েছিল আমাদের পথচলা।",
    category: "campus",
    categoryLabel: "ক্যাম্পাস",
  },
  {
    id: "batch-group-3",
    src: "/images/gallery/batch-group-3.jpg",
    title: "ক্যাম্পাস প্রাঙ্গণে বন্ধুদের আড্ডা",
    caption: "সাদা টি-শার্টে চিরচেনা বন্ধুদের প্রাণবন্ত উল্লাস ও অবিচ্ছেদ্য বন্ধুত্ব।",
    category: "memories",
    categoryLabel: "স্মৃতি",
  },
  {
    id: "batch-21-formation",
    src: "/images/gallery/batch-21-formation.jpg",
    title: "মাঠে তৈরি ঐতিহাসিক '২১'",
    caption: "ক্যাম্পাসের সবুজ মাঠে সকল বন্ধুদের সম্মিলিত ভালোবাসায় আঁকা চিরন্তন প্রতীক।",
    category: "memories",
    categoryLabel: "স্মৃতি",
  },
  {
    id: "batch-group-1",
    src: "/images/gallery/batch-group-1.jpg",
    title: "শহীদ মিনারের সামনে পূর্ণ ব্যাচ",
    caption: "এক ফ্রেমে আমাদের প্রিয় সহপাঠী ও সোনালী দিনের অমলিন প্রতিচ্ছবি।",
    category: "memories",
    categoryLabel: "স্মৃতি",
  },
  {
    id: "batch-group-2",
    src: "/images/gallery/batch-group-2.jpg",
    title: "বন্ধুদের মিলনমেলা ও জয়ধ্বনি",
    caption: "স্মৃতির রঙিন দিনগুলো এবং অটুট বন্ধুত্বের চিরন্তন অঙ্গীকার।",
    category: "memories",
    categoryLabel: "স্মৃতি",
  },
  {
    id: "campus-lawn",
    src: "/images/gallery/campus.jpg",
    title: "ক্যাম্পাসের গাছঘেরা প্রিয় প্রাঙ্গণ",
    caption: "গাছের ছায়ায় গোল চত্বর—যেখানে কেটেছে জীবনের বাঁধভাঙা আনন্দের বহু বিকেল।",
    category: "campus",
    categoryLabel: "ক্যাম্পাস",
  },
];

export default function PhotoGallery() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "campus" | "memories">("all");
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (selectedFilter === "all") return true;
    return item.category === selectedFilter;
  });

  const handleNext = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) =>
      prev !== null ? (prev + 1) % filteredItems.length : null
    );
  }, [activePhotoIndex, filteredItems.length]);

  const handlePrev = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) =>
      prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null
    );
  }, [activePhotoIndex, filteredItems.length]);

  // Keyboard controls for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === "Escape") setActivePhotoIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, handleNext, handlePrev]);

  return (
    <div className="w-full">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <button
          onClick={() => {
            setSelectedFilter("all");
            setActivePhotoIndex(null);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedFilter === "all"
              ? "bg-amber-500 text-slate-950 shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          সকল ছবি ({GALLERY_ITEMS.length})
        </button>

        <button
          onClick={() => {
            setSelectedFilter("campus");
            setActivePhotoIndex(null);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedFilter === "campus"
              ? "bg-amber-500 text-slate-950 shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          আমাদের ক্যাম্পাস (৩)
        </button>

        <button
          onClick={() => {
            setSelectedFilter("memories");
            setActivePhotoIndex(null);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedFilter === "memories"
              ? "bg-amber-500 text-slate-950 shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          বন্ধুদের স্মৃতি (৪)
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((img, idx) => (
          <div
            key={img.id}
            onClick={() => setActivePhotoIndex(idx)}
            className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/50 transition-all flex flex-col"
          >
            <div className="relative h-60 sm:h-64 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
              <Image
                src={img.src}
                alt={img.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />

              {/* Category Badge */}
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-black/60 backdrop-blur-sm text-white border border-white/10">
                {img.categoryLabel}
              </span>

              {/* Hover Zoom Icon */}
              <div className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between border-t border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {img.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {img.caption}
                </p>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-3 flex items-center gap-1">
                <span>বড় করে দেখতে ক্লিক করুন</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Preview Modal */}
      {activePhotoIndex !== null && filteredItems[activePhotoIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActivePhotoIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {filteredItems[activePhotoIndex].categoryLabel}
                </span>
                <span className="text-xs text-slate-400">
                  {activePhotoIndex + 1} / {filteredItems.length}
                </span>
              </div>

              <button
                onClick={() => setActivePhotoIndex(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="বন্ধ করুন (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="relative w-full h-[55vh] sm:h-[65vh] bg-black flex items-center justify-center">
              <Image
                src={filteredItems[activePhotoIndex].src}
                alt={filteredItems[activePhotoIndex].title}
                fill
                className="object-contain"
                priority
              />

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition-all"
                title="পূর্ববর্তী ছবি (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition-all"
                title="পরবর্তী ছবি (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Footer Caption */}
            <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 text-white">
              <h4 className="text-lg font-bold text-amber-400">
                {filteredItems[activePhotoIndex].title}
              </h4>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                {filteredItems[activePhotoIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

