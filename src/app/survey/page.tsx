"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Calendar,
  Utensils,
  Clock,
  Gift,
  PenTool,
  Ban,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  CalendarDays,
  School,
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

const STEP_TITLES = [
  "ব্যক্তিগত তথ্য",
  "তারিখ পছন্দ",
  "খাবার পছন্দ",
  "সময়সূচি",
  "উপহার পছন্দ",
  "পছন্দের আয়োজন",
  "বর্জনীয় বিষয়",
  "পরামর্শ ও প্রিভিউ",
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
            "কমপক্ষে ১টি পছন্দের আয়োজন বা অনুষ্ঠানের নাম লিখুন (ঘর ১)";
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
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
      {/* Top Campus Inspiration Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-8 bg-slate-900 shadow-sm">
        <div className="relative h-32 sm:h-40 w-full">
          <Image
            src="/images/gallery/campus-wide.jpg"
            alt="শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতন ক্যাম্পাস"
            fill
            className="object-cover opacity-60 dark:opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-3 text-white">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <School className="w-3 h-3" />
                শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতন
              </span>
              <span className="text-[11px] text-slate-300 hidden sm:inline">• এসএসসি ব্যাচ ২০২১</span>
            </div>
            <h2 className="text-base sm:text-xl font-bold">
              প্রগতি ২১ • ঈদুল ফিতর পুনর্মিলনী ২০২৭
            </h2>
          </div>
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/20 bg-white p-0.5 shrink-0 hidden sm:block">
            <Image
              src="/images/logo.jpg"
              alt="প্রগতি ২১ লোগো"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Header & Stepper */}
      <div className="text-center mb-8">
        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
          ধাপ {currentStep} / {TOTAL_STEPS} • {STEP_TITLES[currentStep - 1]}
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          প্রগতি ২১ পুনর্মিলনী জরিপ
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          ঈদুল ফিতর পুনর্মিলনী ২০২৭ • আপনার মতামত দিয়ে আয়োজন সুন্দর করুন
        </p>

        {/* Progress Bar */}
        <div className="mt-5 w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Numbers */}
        <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
          {STEP_TITLES.map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div
                key={title}
                className={`flex items-center gap-1 ${
                  isCurrent
                    ? "text-amber-600 dark:text-amber-400 font-bold"
                    : isCompleted
                    ? "text-slate-800 dark:text-slate-300"
                    : "text-slate-400 dark:text-slate-600"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isCompleted
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : isCurrent
                      ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : stepNum}
                </span>
                <span className="hidden md:inline">{title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-800 dark:text-rose-200">সাবমিশন ত্রুটি</p>
            <p className="mt-0.5 text-xs">{serverError}</p>
          </div>
        </div>
      )}

      {/* Main Form Box */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors">
          {/* STEP 1: ব্যক্তিগত তথ্য */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-500" />
                  ধাপ ১: ব্যক্তিগত তথ্য
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  অনুগ্রহ করে আপনার যোগাযোগের তথ্য প্রদান করুন।
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  পূর্ণ নাম <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="যেমন: তানভীর আহমেদ"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
                    stepErrors.fullName
                      ? "border-rose-500"
                      : "border-slate-300 dark:border-slate-800 focus:border-amber-500"
                  }`}
                />
                {stepErrors.fullName && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {stepErrors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  মোবাইল নম্বর <span className="text-amber-500">*</span>
                  <span className="text-xs font-normal text-slate-500 ml-2">
                    (যেমন: 017XXXXXXXX)
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="01712345678"
                    value={formData.mobileNumber}
                    onChange={(e) => updateField("mobileNumber", e.target.value)}
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
                      stepErrors.mobileNumber
                        ? "border-rose-500"
                        : "border-slate-300 dark:border-slate-800 focus:border-amber-500"
                    }`}
                  />
                </div>
                {stepErrors.mobileNumber && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {stepErrors.mobileNumber}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: পুনর্মিলনীর তারিখ */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  ধাপ ২: পুনর্মিলনীর তারিখ
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ঈদের কততম দিনে পুনর্মিলনী আয়োজন করলে ভালো হয়?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DATE_OPTIONS.map((option) => {
                  const isSelected = formData.preferredDate === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateField("preferredDate", option)}
                      className={`p-3.5 rounded-xl border text-left transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white font-semibold"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{option}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-amber-500 bg-amber-500 text-slate-950"
                            : "border-slate-400 dark:border-slate-600"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {stepErrors.preferredDate && (
                <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {stepErrors.preferredDate}
                </p>
              )}

              {formData.preferredDate === "পছন্দসই কাস্টম তারিখ" && (
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-amber-500" />
                    পছন্দসই তারিখটি নির্বাচন করুন <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.customDate}
                    onChange={(e) => updateField("customDate", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                  {stepErrors.customDate && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {stepErrors.customDate}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: খাবার পছন্দ */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-amber-500" />
                  ধাপ ৩: খাবার পছন্দ
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  পুনর্মিলনীর খাবারে আপনার পছন্দের মেনু কোনটি?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FOOD_OPTIONS.map((option) => {
                  const isSelected = formData.preferredFood === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateField("preferredFood", option)}
                      className={`p-3.5 rounded-xl border text-left transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white font-semibold"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{option}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                          isSelected
                            ? "border-amber-500 bg-amber-500 text-slate-950"
                            : "border-slate-400 dark:border-slate-600"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {stepErrors.preferredFood && (
                <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {stepErrors.preferredFood}
                </p>
              )}

              {formData.preferredFood === "পছন্দসই অন্য খাবার" && (
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    অন্যান্য পছন্দের খাবারের বিবরণ লিখুন <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: কাচ্চি বিরিয়ানি সাথে বোরহানি ও ফিরনি"
                    value={formData.customFood}
                    onChange={(e) => updateField("customFood", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  {stepErrors.customFood && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {stepErrors.customFood}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: খাবারের সময়সূচি */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  ধাপ ৪: খাবারের সময়সূচি
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  খাবারের পরিবেশন ব্যবস্থা কেমন হওয়া উচিত?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MEAL_SCHEDULE_OPTIONS.map((option) => {
                  const isSelected = formData.mealSchedule === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateField("mealSchedule", option)}
                      className={`p-4 rounded-xl border text-left transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white font-semibold"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <span className="font-semibold text-sm">{option}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                          isSelected
                            ? "border-amber-500 bg-amber-500 text-slate-950"
                            : "border-slate-400 dark:border-slate-600"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {stepErrors.mealSchedule && (
                <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {stepErrors.mealSchedule}
                </p>
              )}
            </div>
          )}

          {/* STEP 5: উপহার পছন্দ */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-500" />
                  ধাপ ৫: পুনর্মিলনী উপহার
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  স্মৃতিচিহ্ন হিসেবে কী উপহার আপনার পছন্দ?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {GIFT_OPTIONS.map((option) => {
                  const isSelected = formData.preferredGift === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateField("preferredGift", option)}
                      className={`p-3.5 rounded-xl border text-left transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white font-semibold"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{option}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                          isSelected
                            ? "border-amber-500 bg-amber-500 text-slate-950"
                            : "border-slate-400 dark:border-slate-600"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {stepErrors.preferredGift && (
                <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {stepErrors.preferredGift}
                </p>
              )}

              {formData.preferredGift === "পছন্দসই অন্য উপহার" && (
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    আপনার পছন্দের উপহারের বিবরণ লিখুন <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: খোদাইকৃত মেমোরি ক্রেস্ট বা কফি মগ"
                    value={formData.customGift}
                    onChange={(e) => updateField("customGift", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  {stepErrors.customGift && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {stepErrors.customGift}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 6: পছন্দের ৩টি আয়োজন (3 Text Fields) */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-amber-500" />
                  ধাপ ৬: পছন্দের আয়োজন (৩টি অনুষ্ঠান লিখে দিন)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  আসন্ন পুনর্মিলনীতে আপনি দেখতে চান এমন সর্বোচ্চ ৩টি আয়োজনের নাম নিজের ভাষায় লিখুন।
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">
                    পছন্দের আয়োজন ১ <span className="text-amber-600 dark:text-amber-400">* (আবশ্যক)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: বন্ধুদের সাথে আড্ডা ও স্মৃতিচারণ পর্ব"
                    value={formData.activity1}
                    onChange={(e) => updateField("activity1", e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
                      stepErrors.activity1
                        ? "border-rose-500"
                        : "border-slate-300 dark:border-slate-800 focus:border-amber-500"
                    }`}
                  />
                  {stepErrors.activity1 && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {stepErrors.activity1}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    পছন্দের আয়োজন ২ <span className="text-slate-500 font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: গান-বাজনা ও সাংস্কৃতিক অনুষ্ঠান"
                    value={formData.activity2}
                    onChange={(e) => updateField("activity2", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    পছন্দের আয়োজন ৩ <span className="text-slate-500 font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: মজাদার কুইজ ও খেলাধুলা"
                    value={formData.activity3}
                    onChange={(e) => updateField("activity3", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: যা পুনরাবৃত্তি চান না / বর্জনীয় বিষয় (3 Text Fields) */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Ban className="w-5 h-5 text-rose-500" />
                  ধাপ ৭: যা পুনরাবৃত্তি চান না (সর্বোচ্চ ৩টি লিখে দিন)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  পূর্বের পুনর্মিলনীগুলোর কোন বিষয় এবার পরিহার করা উচিত বলে আপনি মনে করেন?
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    বর্জনীয় বিষয় ১
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: দীর্ঘ আনুষ্ঠানিক বক্তৃতা"
                    value={formData.avoid1}
                    onChange={(e) => updateField("avoid1", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    বর্জনীয় বিষয় ২ <span className="text-slate-500 font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: খাবার পরিবেশনে অতিরিক্ত দেরি"
                    value={formData.avoid2}
                    onChange={(e) => updateField("avoid2", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    বর্জনীয় বিষয় ৩ <span className="text-slate-500 font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: অতি গম্ভীর আনুষ্ঠানিক পরিবেশ"
                    value={formData.avoid3}
                    onChange={(e) => updateField("avoid3", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: পরামর্শ ও প্রিভিউ */}
          {currentStep === 8 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  ধাপ ৮: অতিরিক্ত পরামর্শ ও সারাংশ
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  পুনর্মিলনী নিয়ে আপনার কোনো বিশেষ পরামর্শ থাকলে জানান।
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  আপনার মতামত বা বার্তা <span className="text-slate-500 font-normal">(ঐচ্ছিক)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="আয়োজক কমিটির উদ্দেশ্যে কোনো পরামর্শ থাকলে এখানে লিখতে পারেন..."
                  value={formData.additionalSuggestions}
                  onChange={(e) =>
                    updateField("additionalSuggestions", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <p className="font-semibold text-amber-600 dark:text-amber-400">
                  আপনার মতামতের সারসংক্ষেপ:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-slate-500">নাম:</span> {formData.fullName || "—"}
                  </div>
                  <div>
                    <span className="text-slate-500">মোবাইল:</span> {formData.mobileNumber || "—"}
                  </div>
                  <div>
                    <span className="text-slate-500">তারিখ:</span>{" "}
                    {formData.preferredDate === "পছন্দসই কাস্টম তারিখ"
                      ? `কাস্টম: ${formData.customDate}`
                      : formData.preferredDate || "—"}
                  </div>
                  <div>
                    <span className="text-slate-500">খাবার:</span>{" "}
                    {formData.preferredFood === "পছন্দসই অন্য খাবার"
                      ? `কাস্টম: ${formData.customFood}`
                      : formData.preferredFood || "—"}
                  </div>
                  <div>
                    <span className="text-slate-500">সময়সূচি:</span>{" "}
                    {formData.mealSchedule || "—"}
                  </div>
                  <div>
                    <span className="text-slate-500">উপহার:</span>{" "}
                    {formData.preferredGift === "পছন্দসই অন্য উপহার"
                      ? `কাস্টম: ${formData.customGift}`
                      : formData.preferredGift || "—"}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">পছন্দের আয়োজন:</span>{" "}
                    {[formData.activity1, formData.activity2, formData.activity3]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">বর্জনীয় বিষয়:</span>{" "}
                    {[formData.avoid1, formData.avoid2, formData.avoid3]
                      .filter(Boolean)
                      .join(", ") || "নির্দিষ্ট করা হয়নি"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>পূর্ববর্তী</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors"
              >
                <span>পরবর্তী ধাপ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>জমা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>মতামত জমা দিন</span>
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
