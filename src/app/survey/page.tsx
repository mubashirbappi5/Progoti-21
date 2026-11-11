"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Calendar,
  CalendarDays,
  Utensils,
  UtensilsCrossed,
  Clock,
  Gift,
  Shirt,
  Coffee,
  Sun,
  PenTool,
  Ban,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  School,
  Sparkles,
  Heart,
  Eye,
} from "lucide-react";
import {
  DATE_OPTIONS,
  FOOD_OPTIONS,
  MEAL_SCHEDULE_OPTIONS,
  GIFT_OPTIONS,
  BD_PHONE_REGEX,
} from "@/lib/validations";

interface SurveyFormState {
  fullName: string;
  mobileNumber: string;
  preferredDate: string;
  customDate: string;
  preferredFood: string;
  customFood: string;
  mealSchedule: string;
  preferredGift: string;
  customGift: string;
  // Step 6: 3 text fields
  activity1: string;
  activity2: string;
  activity3: string;
  // Step 7: 3 text fields
  avoid1: string;
  avoid2: string;
  avoid3: string;
  // Step 8
  additionalSuggestions: string;
}

const INITIAL_STATE: SurveyFormState = {
  fullName: "",
  mobileNumber: "",
  preferredDate: "",
  customDate: "",
  preferredFood: "",
  customFood: "",
  mealSchedule: "",
  preferredGift: "",
  customGift: "",
  activity1: "",
  activity2: "",
  activity3: "",
  avoid1: "",
  avoid2: "",
  avoid3: "",
  additionalSuggestions: "",
};

const TOTAL_STEPS = 8;

const STEP_INFO = [
  { title: "ব্যক্তিগত তথ্য", desc: "আপনার নাম ও যোগাযোগের নম্বর" },
  { title: "তারিখ পছন্দ", desc: "পুনর্মিলনীর সুবিধাজনক দিন নির্বাচন" },
  { title: "খাবার মেনু", desc: "স্বাদ ও পছন্দের মূল খাদ্য তালিকা" },
  { title: "খাবার সূচি", desc: "মিলনমেলার সময় ও খাবারের পর্ব" },
  { title: "উপহার পছন্দ", desc: "ব্যাচের স্মরণীয় স্মারক উপহার" },
  { title: "পছন্দের আয়োজন", desc: "যেসব অনুষ্ঠান দেখতে চান (৩টি)" },
  { title: "বর্জনীয় বিষয়", desc: "বিগত অভিজ্ঞতা থেকে যা পরিহার্য (৩টি)" },
  { title: "পর্যালোচনা ও মতামত", desc: "সারসংক্ষেপ যাচাই ও অতিরিক্ত পরামর্শ" },
];

export default function SurveyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SurveyFormState>(INITIAL_STATE);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field change helper
  const updateField = (field: keyof SurveyFormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (stepErrors[field]) {
      setStepErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Step Validation
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
          errors.fullName = "আপনার পূর্ণ নাম লিখুন (কমপক্ষে ২ অক্ষর)";
        }
        const cleanedPhone = formData.mobileNumber.replace(/[\s\-\(\)]/g, "");
        if (!cleanedPhone) {
          errors.mobileNumber = "মোবাইল নম্বর দেওয়া আবশ্যক";
        } else if (!BD_PHONE_REGEX.test(cleanedPhone)) {
          errors.mobileNumber =
            "সঠিক বাংলাদেশি নম্বর দিন (যেমন: 017XXXXXXXX)";
        }
        break;

      case 2:
        if (!formData.preferredDate) {
          errors.preferredDate = "অনুগ্রহ করে পুনর্মিলনীর একটি তারিখ নির্বাচন করুন";
        } else if (
          formData.preferredDate === "পছন্দসই কাস্টম তারিখ" &&
          !formData.customDate
        ) {
          errors.customDate = "পছন্দসই তারিখটি নির্বাচন করুন";
        }
        break;

      case 3:
        if (!formData.preferredFood) {
          errors.preferredFood = "অনুগ্রহ করে খাবারের পছন্দ নির্বাচন করুন";
        } else if (
          formData.preferredFood === "পছন্দসই অন্য খাবার" &&
          (!formData.customFood.trim() || formData.customFood.trim().length < 2)
        ) {
          errors.customFood = "আপনার পছন্দের খাবারের নাম লিখুন";
        }
        break;

      case 4:
        if (!formData.mealSchedule) {
          errors.mealSchedule = "খাবারের সময়সূচি নির্বাচন করুন";
        }
        break;

      case 5:
        if (!formData.preferredGift) {
          errors.preferredGift = "অনুগ্রহ করে উপহারের পছন্দ নির্বাচন করুন";
        } else if (
          formData.preferredGift === "পছন্দসই অন্য উপহার" &&
          (!formData.customGift.trim() || formData.customGift.trim().length < 2)
        ) {
          errors.customGift = "আপনার পছন্দের উপহারের বিবরণ লিখুন";
        }
        break;

      case 6:
        if (
          !formData.activity1.trim() &&
          !formData.activity2.trim() &&
          !formData.activity3.trim()
        ) {
          errors.activity1 =
            "কমপক্ষে ১ম পছন্দের আয়োজন বা অনুষ্ঠানের নাম লিখুন";
        }
        break;

      case 7:
        // Optional
        break;

      case 8:
        // Optional
        break;
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setServerError(null);
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleBack = () => {
    setServerError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setServerError(null);

    const payload = {
      ...formData,
      preferredActivities: [
        formData.activity1.trim(),
        formData.activity2.trim(),
        formData.activity3.trim(),
      ].filter(Boolean),
      activitiesToAvoid: [
        formData.avoid1.trim(),
        formData.avoid2.trim(),
        formData.avoid3.trim(),
      ].filter(Boolean),
    };

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.fieldErrors) {
          setStepErrors(result.fieldErrors);
        }
        setServerError(
          result.error ||
            "মতামত জমা দেওয়া সম্ভব হয়নি। অনুগ্রহ করে তথ্য যাচাই করে আবার চেষ্টা করুন।"
        );
        setIsSubmitting(false);
        return;
      }

      router.push(
        `/survey/success?name=${encodeURIComponent(
          formData.fullName
        )}&id=${result.id || ""}`
      );
    } catch (err: any) {
      console.error("Submission failed:", err);
      setServerError(
        "সার্ভারের সাথে যোগাযোগের সময় নেটওয়ার্ক সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।"
      );
      setIsSubmitting(false);
    }
  };

  const progressPercent = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
      {/* Top Campus Inspiration Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 mb-8 bg-white shadow-md">
        <div className="relative h-36 sm:h-44 w-full bg-slate-900">
          <Image
            src="/images/gallery/campus-wide.jpg"
            alt="শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতন ক্যাম্পাস"
            fill
            className="object-cover opacity-85"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white flex items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-slate-950 shadow-sm mb-2">
                <School className="w-3.5 h-3.5" />
                <span>শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতন</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                প্রগতি ২১ • ঈদুল ফিতর পুনর্মিলনী ২০২৭
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 mt-1">
                আপনার সুচিন্তিত মতামত আমাদের আয়োজনকে করবে স্মরণীয় ও সফল।
              </p>
            </div>

            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/30 bg-white p-1 shrink-0 hidden sm:block shadow-md">
              <Image
                src="/images/logo.jpg"
                alt="প্রগতি ২১ লোগো"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-700 font-bold text-xs flex items-center justify-center border border-amber-500/30">
              {currentStep}
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {STEP_INFO[currentStep - 1].title}
              </h3>
              <p className="text-xs text-slate-500 hidden sm:block">
                {STEP_INFO[currentStep - 1].desc}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            ধাপ {currentStep} / {TOTAL_STEPS} • {progressPercent}% সম্পন্ন
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/80">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300 rounded-full shadow-sm"
            style={{ width: `${Math.max(progressPercent, 12)}%` }}
          />
        </div>

        {/* Mini Step Pills for quick view */}
        <div className="grid grid-cols-8 gap-1.5 sm:gap-2 mt-4">
          {STEP_INFO.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div
                key={step.title}
                className={`py-1.5 rounded-lg flex flex-col items-center justify-center transition-all ${
                  isCurrent
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : isCompleted
                    ? "bg-amber-50 text-amber-800 border border-amber-200 font-medium"
                    : "bg-slate-100 text-slate-400"
                }`}
                title={step.title}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span className="text-[11px]">{stepNum}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-rose-800">সাবমিশন ত্রুটি</p>
            <p className="mt-0.5 text-xs text-rose-700">{serverError}</p>
          </div>
        </div>
      )}

      {/* Main White Form Container */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg shadow-slate-100 transition-all">
          {/* STEP 1: ব্যক্তিগত তথ্য */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-500" />
                  ব্যক্তিগত তথ্য দিন
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  আপনার নাম ও মোবাইল নম্বর দিয়ে নিশ্চিত করুন যাতে ডুপ্লিকেট সাবমিশন এড়ানো যায়।
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  আপনার পূর্ণ নাম <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="যেমন: তানভীর আহমেদ / মুবাশির বাপ্পী"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                      stepErrors.fullName
                        ? "border-rose-500 ring-1 ring-rose-500"
                        : "border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    }`}
                  />
                </div>
                {stepErrors.fullName && (
                  <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {stepErrors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  মোবাইল নম্বর <span className="text-amber-500">*</span>
                  <span className="text-xs font-normal text-slate-500 ml-2">
                    (বাংলাদেশি ১১ ডিজিট)
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="017XXXXXXXX"
                    value={formData.mobileNumber}
                    onChange={(e) => updateField("mobileNumber", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                      stepErrors.mobileNumber
                        ? "border-rose-500 ring-1 ring-rose-500"
                        : "border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    }`}
                  />
                </div>
                {stepErrors.mobileNumber && (
                  <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {stepErrors.mobileNumber}
                  </p>
                )}
                <p className="text-[11px] text-slate-500 mt-1.5">
                  একটি মোবাইল নম্বর থেকে কেবল একটিমাত্র মতামত গ্রহণ করা হবে।
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: পুনর্মিলনীর তারিখ */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  পুনর্মিলনী আয়োজনের তারিখ পছন্দ
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  ঈদের পর কোন দিনটিতে আপনি পুনর্মিলনী আয়োজন করতে চান?
                </p>
              </div>

              {stepErrors.preferredDate && (
                <p className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {stepErrors.preferredDate}
                </p>
              )}

              {/* Interactive Option Cards */}
              <div className="grid grid-cols-1 gap-3.5">
                {[
                  {
                    value: "ঈদের ২য় দিন",
                    icon: Calendar,
                    title: "ঈদের ২য় দিন",
                    desc: "ঈদের পরের দিনই বন্ধুদের সাথে দ্রুত একত্রিত হওয়া",
                  },
                  {
                    value: "ঈদের ৩য় দিন",
                    icon: CalendarDays,
                    title: "ঈদের ৩য় দিন",
                    desc: "পারিবারিক ব্যস্ততা কাটিয়ে আরামদায়ক মিলনমেলা",
                  },
                  {
                    value: "পছন্দসই কাস্টম তারিখ",
                    icon: Clock,
                    title: "পছন্দসই কাস্টম তারিখ",
                    desc: "আপনার অন্য কোনো নির্দিষ্ট তারিখের প্রস্তাব থাকলে তা লিখুন",
                  },
                ].map((opt) => {
                  const isSelected = formData.preferredDate === opt.value;
                  const Icon = opt.icon;

                  return (
                    <div
                      key={opt.value}
                      onClick={() => updateField("preferredDate", opt.value)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isSelected
                          ? "border-amber-500 bg-amber-50/70 shadow-sm"
                          : "border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "bg-amber-500 text-slate-950 font-bold"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4
                            className={`text-base font-bold ${
                              isSelected ? "text-amber-950" : "text-slate-800"
                            }`}
                          >
                            {opt.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {opt.desc}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "border-amber-500 bg-amber-500 text-slate-950"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Conditional Custom Date Picker */}
              {formData.preferredDate === "পছন্দসই কাস্টম তারিখ" && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 animate-fadeIn">
                  <label className="block text-xs font-bold text-amber-950 mb-2">
                    পছন্দের নির্দিষ্ট তারিখ নির্বাচন করুন *
                  </label>
                  <input
                    type="date"
                    value={formData.customDate}
                    onChange={(e) => updateField("customDate", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                  {stepErrors.customDate && (
                    <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {stepErrors.customDate}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: খাবার মেনু */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-amber-500" />
                  খাবার মেনু পছন্দ
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  পুনর্মিলনীতে আপনি কোন ধরনের খাবার উপভোগ করতে চান?
                </p>
              </div>

              {stepErrors.preferredFood && (
                <p className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {stepErrors.preferredFood}
                </p>
              )}

              {/* Interactive Food Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    value: "কাচ্চি বিরিয়ানি",
                    icon: UtensilsCrossed,
                    title: "কাচ্চি বিরিয়ানি",
                    desc: "ঐতিহ্যবাহী খাসির কাচ্চি বিরিয়ানি ও বোরহানি",
                  },
                  {
                    value: "মোরগ পোলাও",
                    icon: Utensils,
                    title: "মোরগ পোলাও",
                    desc: "সুস্বাদু দেশি মোরগ পোলাও, ডিম ও সালাদ",
                  },
                  {
                    value: "ফ্রাইড রাইস ও চিকেন / অন্যান্য",
                    icon: Sparkles,
                    title: "ফ্রাইড রাইস ও চিকেন",
                    desc: "চাইনিজ ফ্রাইড রাইস, ফ্রাইড চিকেন ও ভেজিটেবল",
                  },
                  {
                    value: "পছন্দসই অন্য খাবার",
                    icon: PenTool,
                    title: "অন্য কোনো খাবার",
                    desc: "আপনার পছন্দের বিশেষ কোনো খাদ্য তালিকা লিখুন",
                  },
                ].map((item) => {
                  const isSelected = formData.preferredFood === item.value;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.value}
                      onClick={() => updateField("preferredFood", item.value)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-amber-500 bg-amber-50/70 shadow-sm"
                          : "border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-amber-500 text-slate-950 font-bold"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? "border-amber-500 bg-amber-500 text-slate-950"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <div>
                        <h4
                          className={`text-base font-bold ${
                            isSelected ? "text-amber-950" : "text-slate-800"
                          }`}
                        >
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Conditional Custom Food Text */}
              {formData.preferredFood === "পছন্দসই অন্য খাবার" && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 animate-fadeIn">
                  <label className="block text-xs font-bold text-amber-950 mb-2">
                    পছন্দের খাবারের বিবরণ লিখুন *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: তেহারি, ভুনা খিচুড়ি বা অন্য কোনো স্পেশাল খাবার"
                    value={formData.customFood}
                    onChange={(e) => updateField("customFood", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                  {stepErrors.customFood && (
                    <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {stepErrors.customFood}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: খাবার সূচি */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  খাবারের সময়সূচি পছন্দ
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  পুনর্মিলনীতে আপনি কোন ধরণের খাবার বিন্যাস পছন্দ করবেন?
                </p>
              </div>

              {stepErrors.mealSchedule && (
                <p className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {stepErrors.mealSchedule}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    value: "শুধুমাত্র দুপুরের খাবার",
                    icon: Sun,
                    title: "শুধুমাত্র দুপুরের খাবার",
                    desc: "দুপুরে জমজমাট ভোজ এবং একসাথে ছবি তোলা ও আড্ডা",
                  },
                  {
                    value: "দুপুরের খাবার + সন্ধ্যার নাস্তা",
                    icon: Coffee,
                    title: "দুপুর + সন্ধ্যার নাস্তা",
                    desc: "দুপুরের মূল খাবার ও সন্ধ্যায় চা-কফি-নাস্তায় দীর্ঘ আড্ডা",
                  },
                ].map((item) => {
                  const isSelected = formData.mealSchedule === item.value;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.value}
                      onClick={() => updateField("mealSchedule", item.value)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-amber-500 bg-amber-50/70 shadow-sm"
                          : "border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-amber-500 text-slate-950 font-bold"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? "border-amber-500 bg-amber-500 text-slate-950"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                      <div>
                        <h4
                          className={`text-base font-bold ${
                            isSelected ? "text-amber-950" : "text-slate-800"
                          }`}
                        >
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: উপহার পছন্দ */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-500" />
                  পুনর্মিলনীর স্মারক উপহার পছন্দ
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  পুনর্মিলনীতে আপনি স্মৃতি হিসেবে কোন উপহারটি বেশি পছন্দ করবেন?
                </p>
              </div>

              {stepErrors.preferredGift && (
                <p className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {stepErrors.preferredGift}
                </p>
              )}

              <div className="grid grid-cols-1 gap-3.5">
                {[
                  {
                    value: "কাস্টমাইজড গিফট বক্স",
                    icon: Gift,
                    title: "কাস্টমাইজড গিফট বক্স",
                    desc: "প্রগতি ২১ লোগোযুক্ত স্পেশাল গিফট বক্স (টি-শার্ট, মগ বা অন্যান্য স্মারকসহ)",
                  },
                  {
                    value: "শুধুমাত্র স্পেশাল ব্যাচ টি-শার্ট",
                    icon: Shirt,
                    title: "শুধুমাত্র স্পেশাল ব্যাচ টি-শার্ট",
                    desc: "উচ্চমানের প্রিমিয়াম ফেব্রিকের প্রগতি ২১ ব্যাচ টি-শার্ট",
                  },
                  {
                    value: "পছন্দসই অন্য উপহার",
                    icon: PenTool,
                    title: "পছন্দসই অন্য কোনো স্মারক উপহার",
                    desc: "আপনার অন্য কোনো সুন্দর উপহারের আইডিয়া থাকলে তা লিখুন",
                  },
                ].map((item) => {
                  const isSelected = formData.preferredGift === item.value;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.value}
                      onClick={() => updateField("preferredGift", item.value)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isSelected
                          ? "border-amber-500 bg-amber-50/70 shadow-sm"
                          : "border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "bg-amber-500 text-slate-950 font-bold"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4
                            className={`text-base font-bold ${
                              isSelected ? "text-amber-950" : "text-slate-800"
                            }`}
                          >
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "border-amber-500 bg-amber-500 text-slate-950"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Conditional Custom Gift Text */}
              {formData.preferredGift === "পছন্দসই অন্য উপহার" && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 animate-fadeIn">
                  <label className="block text-xs font-bold text-amber-950 mb-2">
                    পছন্দের উপহারের বিবরণ লিখুন *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ক্রেস্ট, স্মারক ডায়েরি, ওয়াটার বোতল ইত্যাদি"
                    value={formData.customGift}
                    onChange={(e) => updateField("customGift", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                  {stepErrors.customGift && (
                    <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {stepErrors.customGift}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 6: পছন্দের ৩টি কার্যক্রম (মুক্ত টেক্সট ফিল্ড) */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>মুক্ত মতামত</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-amber-500" />
                  পুনর্মিলনীতে আপনার পছন্দের ৩টি আয়োজন
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  অনুষ্ঠানে আপনি কী ধরণের আয়োজন দেখতে চান? নিচের ৩টি ঘরে আপনার মনের মতো কার্যক্রমগুলো লিখে দিন।
                </p>
              </div>

              {stepErrors.activity1 && (
                <p className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {stepErrors.activity1}
                </p>
              )}

              <div className="space-y-4">
                {/* Field 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold">
                      ১
                    </span>
                    <span>১ম পছন্দের আয়োজন <span className="text-amber-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: সাংস্কৃতিক সন্ধ্যা, গান-বাজনা ও বন্ধুদের পারফরম্যান্স"
                    value={formData.activity1}
                    onChange={(e) => updateField("activity1", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* Field 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                      ২
                    </span>
                    <span>২য় পছন্দের আয়োজন (ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: বন্ধুদের বাঁধভাঙা আড্ডা ও পুরানো স্কুল জীবনের স্মৃতিচারণ"
                    value={formData.activity2}
                    onChange={(e) => updateField("activity2", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* Field 3 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                      ৩
                    </span>
                    <span>৩য় পছন্দের আয়োজন (ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ফটো সেশন, সেলফি ও মজার খেলাধুলা/কুইজ প্রতিযোগিতা"
                    value={formData.activity3}
                    onChange={(e) => updateField("activity3", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: বিগত অভিজ্ঞতায় বর্জনীয় বিষয় (মুক্ত টেক্সট ফিল্ড) */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 mb-2">
                  <Ban className="w-3.5 h-3.5" />
                  <span>পরিহারযোগ্য বিষয়াবলী</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Ban className="w-5 h-5 text-rose-500" />
                  বিগত অভিজ্ঞতা থেকে যা এবার পরিহার করা উচিত
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  আগের মিলনমেলার কোনো অভিজ্ঞতা কি পুনরাবৃত্তি না করা উচিত? আপনার মূল্যবান ৩টি পরামর্শ লিখে দিন।
                </p>
              </div>

              <div className="space-y-4">
                {/* Avoid 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">
                      ১
                    </span>
                    <span>১ম পরিহারযোগ্য বিষয় (ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: অতিরিক্ত আনুষ্ঠানিকতা বা দীর্ঘ বক্তব্য"
                    value={formData.avoid1}
                    onChange={(e) => updateField("avoid1", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* Avoid 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                      ২
                    </span>
                    <span>২য় পরিহারযোগ্য বিষয় (ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: খাবার পরিবেশনে অনাকাঙ্ক্ষিত বিলম্ব"
                    value={formData.avoid2}
                    onChange={(e) => updateField("avoid2", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* Avoid 3 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                      ৩
                    </span>
                    <span>৩য় পরিহারযোগ্য বিষয় (ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: অতিরিক্ত সময়ক্ষেপণ বা বিশৃঙ্খলা"
                    value={formData.avoid3}
                    onChange={(e) => updateField("avoid3", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: সারসংক্ষেপ ও অতিরিক্ত পরামর্শ */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  সারসংক্ষেপ যাচাই ও অতিরিক্ত পরামর্শ
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  সাবমিট করার আগে আপনার প্রদত্ত তথ্যসমূহ মিলিয়ে নিন এবং কোনো পরামর্শ থাকলে যোগ করুন।
                </p>
              </div>

              {/* Review Summary Card */}
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-600" />
                    আপনার পছন্দের সারসংক্ষেপ
                  </h4>
                  <span className="text-[11px] text-amber-800 font-semibold">
                    {formData.fullName}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">তারিখ: </span>
                    <span className="font-semibold text-slate-800">
                      {formData.preferredDate === "পছন্দসই কাস্টম তারিখ"
                        ? formData.customDate || "কাস্টম"
                        : formData.preferredDate || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">খাবার মেনু: </span>
                    <span className="font-semibold text-slate-800">
                      {formData.preferredFood === "পছন্দসই অন্য খাবার"
                        ? formData.customFood || "কাস্টম"
                        : formData.preferredFood || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">খাবার সূচি: </span>
                    <span className="font-semibold text-slate-800">
                      {formData.mealSchedule || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">উপহার: </span>
                    <span className="font-semibold text-slate-800">
                      {formData.preferredGift === "পছন্দসই অন্য উপহার"
                        ? formData.customGift || "কাস্টম"
                        : formData.preferredGift || "—"}
                    </span>
                  </div>
                </div>

                {(formData.activity1 || formData.activity2 || formData.activity3) && (
                  <div className="pt-2 border-t border-amber-200/40 text-xs">
                    <span className="text-slate-500 font-medium">পছন্দের আয়োজন: </span>
                    <span className="font-semibold text-slate-800">
                      {[formData.activity1, formData.activity2, formData.activity3]
                        .filter(Boolean)
                        .join(" • ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Textarea for additional comments */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center justify-between">
                  <span>অতিরিক্ত কোনো পরামর্শ বা মতামত (ঐচ্ছিক)</span>
                  <span className="text-xs font-normal text-slate-400">ঐচ্ছিক</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="পুনর্মিলনী আয়োজনকে আরও নিখুঁত ও প্রাণবন্ত করতে আপনার যে কোনো ভাবনা বা পরামর্শ এখানে লিখে জানাতে পারেন..."
                  value={formData.additionalSuggestions}
                  onChange={(e) =>
                    updateField("additionalSuggestions", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
                <span>
                  আপনার সুচিন্তিত প্রতিটি মতামত প্রগতি ২১ কমিটির কাছে সরাসরি সংরক্ষিত হবে।
                </span>
              </div>
            </div>
          )}

          {/* Form Actions Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>পূর্ববর্তী ধাপ</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all"
              >
                <span>পরবর্তী ধাপ ({currentStep + 1}/{TOTAL_STEPS})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>জমা দেওয়া হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>মতামত চূড়ান্তভাবে জমা দিন</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
