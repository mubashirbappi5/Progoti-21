import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  UtensilsCrossed,
  Gift,
  Users,
  ArrowRight,
  Heart,
  ImageIcon,
  School,
  MapPin,
  Sparkles,
} from "lucide-react";
import PhotoGallery from "@/components/PhotoGallery";

export default function HomePage() {
  const highlights = [
    {
      icon: Calendar,
      title: "পুনর্মিলনীর তারিখ",
      desc: "ঈদের ২য় দিন, ৩য় দিন অথবা আপনার সুবিধাজনক যেকোনো তারিখ বেছে নিন।",
    },
    {
      icon: UtensilsCrossed,
      title: "খাবার মেনু",
      desc: "কাচ্চি বিরিয়ানি, মোরগ পোলাও নাকি ফ্রাইড রাইস—পছন্দের মেনু নির্বাচন করুন।",
    },
    {
      icon: Gift,
      title: "স্মারক ও উপহার",
      desc: "ব্যাচের লোগো খচিত প্রিমিয়াম গিফট বক্স অথবা স্পেশাল ব্যাচ টি-শার্ট।",
    },
    {
      icon: Users,
      title: "অনুষ্ঠান ও আয়োজন",
      desc: "আড্ডা, স্মৃতিচারণ ও গান-বাজনাসহ আপনার পছন্দের আয়োজন সরাসরি লিখে দিন।",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 sm:py-20 px-4 sm:px-6 lg:px-8 text-center transition-colors">
        <div className="max-w-4xl mx-auto">
          {/* Logo & School Badge */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white p-2 shadow-sm mb-4">
              <Image
                src="/images/logo.jpg"
                alt="প্রগতি ২১ লোগো"
                fill
                className="object-contain p-1"
                priority
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <School className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতন • এসএসসি ব্যাচ ২০২১</span>
            </div>
          </div>

          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm tracking-widest uppercase mb-2">
            প্রগতি ২১ • ঈদুল ফিতর পুনর্মিলনী ২০২৭
          </p>

          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            আসুন আমাদের পুনর্মিলনীকে স্মরণীয় করে তুলি!
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            ঈদুল ফিতরের পর আমরা সকল বন্ধুরা আবারও প্রিয় ক্যাম্পাসের প্রাঙ্গণে একসাথে মিলিত হতে যাচ্ছি।
            আপনার মূল্যবান মতামত শেয়ার করুন এবং একটি অবিস্মরণীয় পুনর্মিলনী আয়োজনে সাহায্য করুন।
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/survey"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-base bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm transition-colors"
            >
              <span>আপনার মতামত দিন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#gallery"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium text-base text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-white border border-slate-300 dark:border-slate-700 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-amber-500" />
              <span>স্মৃতি অ্যালবাম দেখুন</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Campus & Institution Showcase */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Wide Campus Image Card */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 min-h-[300px] sm:min-h-[380px] shadow-sm group">
            <Image
              src="/images/gallery/campus-wide.jpg"
              alt="শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতন সবুজ ক্যাম্পাস"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-slate-950 mb-2">
                <MapPin className="w-3.5 h-3.5" />
                আমাদের মিলনমেলার স্মৃতিময় প্রাঙ্গণ
              </span>
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
                শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতন
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
                যেখানে কেটেছে সোনালী শৈশব ও কৈশোরের বাঁধভাঙা আনন্দের দিনগুলো। সেখানেই আবার বসবে আমাদের প্রগতি ২১-এর বন্ধুদের প্রাণের আড্ডা।
              </p>
            </div>
          </div>

          {/* Side Cards: School Gate & Batch Hangout */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* School Gate Card */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 h-48 sm:h-52 shadow-sm group">
              <Image
                src="/images/gallery/school-gate.jpg"
                alt="শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতন প্রবেশদ্বার"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-[11px] font-semibold text-amber-400">ঐতিহাসিক প্রবেশদ্বার • স্থাপিত ২০০৫</p>
                <h3 className="text-sm sm:text-base font-bold">শিক্ষাঙ্গনের পরিচিত ফটক</h3>
              </div>
            </div>

            {/* Batch Hangout Card */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 h-48 sm:h-52 shadow-sm group">
              <Image
                src="/images/gallery/batch-group-3.jpg"
                alt="প্রগতি ২১ বন্ধুদের আড্ডা"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-[11px] font-semibold text-amber-400">অটুট বন্ধুত্ব • প্রগতি ২১</p>
                <h3 className="text-sm sm:text-base font-bold">ক্যাম্পাস প্রাঙ্গণে বন্ধুদের চিরচেনা উল্লাস</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            জরিপের মূল বিষয়সমূহ
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            সবার মতামতের ভিত্তিতেই অনুষ্ঠানের সময়সূচি, ভেন্যু ও আয়োজন চূড়ান্ত করা হবে।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm hover:border-amber-400/50 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section id="gallery" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>স্মৃতির অ্যালবাম</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            প্রগতি ২১ স্মৃতি অ্যালবাম ও ফটো গ্যালারি
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতনের সবুজ চত্বর, প্রিয় সহপাঠীদের হাসি এবং চিরচেনা বন্ধুত্ব
          </p>
        </div>

        {/* Interactive Photo Gallery with Category Filters & Modal Zoom */}
        <PhotoGallery />
      </section>

      {/* Survey Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 shadow-sm">
          <Heart className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            আপনার মতামত আমাদের জন্য অপরিহার্য
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            মাত্র ২ মিনিট সময় দিয়ে সার্ভেটি পূরণ করুন। আপনার প্রতিটি মতামত পুনর্মিলনীকে সফল ও স্মরণীয় করতে সাহায্য করবে।
          </p>

          <div className="mt-6 flex justify-center">
            <Link
              href="/survey"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-base text-slate-950 bg-amber-500 hover:bg-amber-600 transition-colors"
            >
              <span>সার্ভে শুরু করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
