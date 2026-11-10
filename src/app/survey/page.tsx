"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Calendar,
  Utensils,
  Clock,
  Gift,
  Sparkles,
  AlertTriangle,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  CalendarDays,
  FileQuestion,
  HelpCircle,
} from "lucide-react";
import {
  DATE_OPTIONS,
  FOOD_OPTIONS,
  MEAL_SCHEDULE_OPTIONS,
  GIFT_OPTIONS,
  ACTIVITY_OPTIONS,
  AVOID_OPTIONS,
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
  preferredActivities: string[];
  customPreferredActivity: string;
  activitiesToAvoid: string[];
  customAvoidActivity: string;
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
  preferredActivities: [],
  customPreferredActivity: "",
  activitiesToAvoid: [],
  customAvoidActivity: "",
  additionalSuggestions: "",
};

const TOTAL_STEPS = 8;

const STEP_TITLES = [
  "Personal Info",
  "Reunion Date",
  "Food Menu",
  "Meal Schedule",
  "Reunion Gifts",
  "Activities",
  "Avoid Repeating",
  "Suggestions & Review",
];

export default function SurveyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SurveyFormState>(INITIAL_STATE);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field change helpers
  const updateField = (field: keyof SurveyFormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for field
    if (stepErrors[field]) {
      setStepErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const togglePreferredActivity = (activity: string) => {
    setFormData((prev) => {
      const exists = prev.preferredActivities.includes(activity);
      if (exists) {
        return {
          ...prev,
          preferredActivities: prev.preferredActivities.filter(
            (a) => a !== activity
          ),
        };
      } else {
        if (prev.preferredActivities.length >= 3) {
          setStepErrors((errs) => ({
            ...errs,
            preferredActivities: "You can select a maximum of 3 activities only.",
          }));
          return prev;
        }
        setStepErrors((errs) => {
          const next = { ...errs };
          delete next.preferredActivities;
          return next;
        });
        return {
          ...prev,
          preferredActivities: [...prev.preferredActivities, activity],
        };
      }
    });
  };

  const toggleAvoidActivity = (activity: string) => {
    setFormData((prev) => {
      const exists = prev.activitiesToAvoid.includes(activity);
      if (exists) {
        return {
          ...prev,
          activitiesToAvoid: prev.activitiesToAvoid.filter((a) => a !== activity),
        };
      } else {
        if (prev.activitiesToAvoid.length >= 3) {
          setStepErrors((errs) => ({
            ...errs,
            activitiesToAvoid:
              "You can select a maximum of 3 experiences to avoid.",
          }));
          return prev;
        }
        setStepErrors((errs) => {
          const next = { ...errs };
          delete next.activitiesToAvoid;
          return next;
        });
        return {
          ...prev,
          activitiesToAvoid: [...prev.activitiesToAvoid, activity],
        };
      }
    });
  };

  // Step Validation
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
          errors.fullName = "Please enter your full name (minimum 2 characters)";
        }
        const cleanedPhone = formData.mobileNumber.replace(/[\s\-\(\)]/g, "");
        if (!cleanedPhone) {
          errors.mobileNumber = "Mobile number is required";
        } else if (!BD_PHONE_REGEX.test(cleanedPhone)) {
          errors.mobileNumber =
            "Enter a valid Bangladesh number (e.g. 01712345678 or +8801712345678)";
        }
        break;

      case 2:
        if (!formData.preferredDate) {
          errors.preferredDate = "Please choose a reunion date preference";
        } else if (
          formData.preferredDate === "Custom Date" &&
          !formData.customDate
        ) {
          errors.customDate = "Please pick your preferred custom date";
        }
        break;

      case 3:
        if (!formData.preferredFood) {
          errors.preferredFood = "Please select a food menu preference";
        } else if (
          formData.preferredFood === "Custom Food Preference" &&
          (!formData.customFood.trim() || formData.customFood.trim().length < 2)
        ) {
          errors.customFood = "Please specify your custom food preference";
        }
        break;

      case 4:
        if (!formData.mealSchedule) {
          errors.mealSchedule = "Please select your meal schedule preference";
        }
        break;

      case 5:
        if (!formData.preferredGift) {
          errors.preferredGift = "Please select a reunion gift preference";
        } else if (
          formData.preferredGift === "Custom Gift Preference" &&
          (!formData.customGift.trim() || formData.customGift.trim().length < 2)
        ) {
          errors.customGift = "Please specify your custom gift suggestion";
        }
        break;

      case 6:
        if (formData.preferredActivities.length === 0) {
          errors.preferredActivities =
            "Please select at least 1 activity (up to 3)";
        } else if (formData.preferredActivities.length > 3) {
          errors.preferredActivities = "Maximum 3 activities allowed";
        }
        if (
          formData.preferredActivities.includes("Custom Activity") &&
          (!formData.customPreferredActivity.trim() ||
            formData.customPreferredActivity.trim().length < 2)
        ) {
          errors.customPreferredActivity = "Please describe your custom activity";
        }
        break;

      case 7:
        if (formData.activitiesToAvoid.length > 3) {
          errors.activitiesToAvoid = "Maximum 3 selections allowed";
        }
        if (
          formData.activitiesToAvoid.includes("Custom Suggestion") &&
          (!formData.customAvoidActivity.trim() ||
            formData.customAvoidActivity.trim().length < 2)
        ) {
          errors.customAvoidActivity =
            "Please describe the custom item you'd prefer to avoid";
        }
        break;

      case 8:
        // Optional suggestions, no blocking validations
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

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.fieldErrors) {
          setStepErrors(result.fieldErrors);
        }
        setServerError(
          result.error ||
            "Unable to submit survey. Please review your answers and try again."
        );
        setIsSubmitting(false);
        return;
      }

      // Success! Redirect to dedicated success screen
      router.push(
        `/survey/success?name=${encodeURIComponent(
          formData.fullName
        )}&id=${result.id || ""}`
      );
    } catch (err: any) {
      console.error("Submission failed:", err);
      setServerError(
        "A network error occurred while communicating with the server. Please check your connection."
      );
      setIsSubmitting(false);
    }
  };

  const progressPercent = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);

  return (
    <div className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header & Stepper */}
      <div className="text-center mb-8">
        <span className="inline-block text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
          Step {currentStep} of {TOTAL_STEPS} • {STEP_TITLES[currentStep - 1]}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Progoti 21 Reunion Survey
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Eid-ul-Fitr Reunion 2027 • Help us curate the perfect get-together
        </p>

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-navy-900 h-2.5 rounded-full overflow-hidden border border-slate-800 relative">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Indicator Badges (Horizontal scroll on mobile) */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-medium overflow-x-auto pb-1 gap-1">
          {STEP_TITLES.map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div
                key={title}
                className={`flex items-center gap-1 shrink-0 px-2 py-1 rounded ${
                  isCurrent
                    ? "text-amber-400 font-bold bg-amber-400/10 border border-amber-500/20"
                    : isCompleted
                    ? "text-slate-300"
                    : "text-slate-400"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isCompleted
                      ? "bg-amber-400 text-navy-950 font-bold"
                      : isCurrent
                      ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : stepNum}
                </span>
                <span className="hidden sm:inline">{title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Server Error Alert */}
      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-200">Submission Error</p>
            <p className="mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl glass-panel-glow p-6 sm:p-8 relative min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex-1"
            >
              {/* STEP 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-amber-400" />
                      Step 1: Personal Information
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Please enter your contact details. Mobile numbers are used to verify unique participants.
                    </p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Full Name <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Tanvir Ahmed"
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-navy-900/90 border text-white placeholder-slate-500 focus:outline-none transition-all ${
                          stepErrors.fullName
                            ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                            : "border-slate-700/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                        }`}
                      />
                    </div>
                    {stepErrors.fullName && (
                      <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {stepErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Mobile Number <span className="text-amber-400">*</span>
                      <span className="text-xs font-normal text-slate-400 ml-2">
                        (Bangladesh format: 01XXXXXXXXX)
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        placeholder="01712345678"
                        value={formData.mobileNumber}
                        onChange={(e) => updateField("mobileNumber", e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-navy-900/90 border text-white placeholder-slate-500 focus:outline-none transition-all ${
                          stepErrors.mobileNumber
                            ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                            : "border-slate-700/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                        }`}
                      />
                    </div>
                    {stepErrors.mobileNumber && (
                      <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {stepErrors.mobileNumber}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Reunion Date */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-amber-400" />
                      Step 2: Reunion Date
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      When would you prefer to organize the reunion?
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
                          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                            isSelected
                              ? "bg-amber-400/15 border-amber-400 text-white shadow-md shadow-amber-400/10 ring-1 ring-amber-400/50"
                              : "bg-navy-900/60 border-slate-700/70 text-slate-300 hover:border-slate-500 hover:bg-navy-900"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-semibold text-sm">{option}</span>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? "border-amber-400 bg-amber-400 text-navy-950"
                                  : "border-slate-500"
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 mt-2">
                            {option === "2nd day after Eid" && "High turnout expected"}
                            {option === "3rd day after Eid" && "More family time flexibility"}
                            {option === "Custom Date" && "Pick your own convenient date"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {stepErrors.preferredDate && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {stepErrors.preferredDate}
                    </p>
                  )}

                  {/* Conditional Custom Date Picker */}
                  {formData.preferredDate === "Custom Date" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 rounded-xl bg-navy-900/80 border border-amber-500/20 space-y-2"
                    >
                      <label className="block text-sm font-semibold text-amber-300 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-amber-400" />
                        Preferred Custom Date <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.customDate}
                        onChange={(e) => updateField("customDate", e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg bg-navy-950 border text-white focus:outline-none ${
                          stepErrors.customDate
                            ? "border-rose-500"
                            : "border-slate-700 focus:border-amber-400"
                        }`}
                      />
                      {stepErrors.customDate && (
                        <p className="text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {stepErrors.customDate}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 3: Food Preferences */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-amber-400" />
                      Step 3: Food Preferences
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Which food menu would you prefer for our reunion feast?
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
                          className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-amber-400/15 border-amber-400 text-white ring-1 ring-amber-400/50 shadow-md shadow-amber-400/10"
                              : "bg-navy-900/60 border-slate-700/70 text-slate-300 hover:border-slate-500 hover:bg-navy-900"
                          }`}
                        >
                          <span className="font-semibold text-sm">{option}</span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                              isSelected
                                ? "border-amber-400 bg-amber-400 text-navy-950"
                                : "border-slate-500"
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {stepErrors.preferredFood && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {stepErrors.preferredFood}
                    </p>
                  )}

                  {/* Conditional Custom Food Input */}
                  {formData.preferredFood === "Custom Food Preference" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 rounded-xl bg-navy-900/80 border border-amber-500/20 space-y-2"
                    >
                      <label className="block text-sm font-semibold text-amber-300">
                        Custom Food Suggestion <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kacchi Biryani with Borhani and Firni"
                        value={formData.customFood}
                        onChange={(e) => updateField("customFood", e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg bg-navy-950 border text-white placeholder-slate-500 focus:outline-none ${
                          stepErrors.customFood
                            ? "border-rose-500"
                            : "border-slate-700 focus:border-amber-400"
                        }`}
                      />
                      {stepErrors.customFood && (
                        <p className="text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {stepErrors.customFood}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 4: Meal Schedule */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-400" />
                      Step 4: Meal Schedule
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Which meal arrangement would you prefer for the event?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {MEAL_SCHEDULE_OPTIONS.map((option) => {
                      const isSelected = formData.mealSchedule === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("mealSchedule", option)}
                          className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[110px] ${
                            isSelected
                              ? "bg-amber-400/15 border-amber-400 text-white ring-1 ring-amber-400/50 shadow-md shadow-amber-400/10"
                              : "bg-navy-900/60 border-slate-700/70 text-slate-300 hover:border-slate-500 hover:bg-navy-900"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold text-base">{option}</span>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "border-amber-400 bg-amber-400 text-navy-950"
                                  : "border-slate-500"
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 mt-3">
                            {option === "Lunch Only"
                              ? "Focus entirely on afternoon grand lunch and main gathering"
                              : "Lunch followed by evening tea, snacks, and extended conversations"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {stepErrors.mealSchedule && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {stepErrors.mealSchedule}
                    </p>
                  )}
                </div>
              )}

              {/* STEP 5: Reunion Gifts */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Gift className="w-5 h-5 text-amber-400" />
                      Step 5: Reunion Gifts
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      What kind of reunion gift would you prefer as a keepsake?
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
                          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                            isSelected
                              ? "bg-amber-400/15 border-amber-400 text-white ring-1 ring-amber-400/50 shadow-md shadow-amber-400/10"
                              : "bg-navy-900/60 border-slate-700/70 text-slate-300 hover:border-slate-500 hover:bg-navy-900"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-semibold text-sm">{option}</span>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "border-amber-400 bg-amber-400 text-navy-950"
                                  : "border-slate-500"
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 mt-2">
                            {option === "Customized Gift Box" && "Premium batch branded box with goodies"}
                            {option === "Only Customized T-shirt" && "High quality signature polo or t-shirt"}
                            {option === "Custom Gift Preference" && "Suggest your preferred souvenir"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {stepErrors.preferredGift && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {stepErrors.preferredGift}
                    </p>
                  )}

                  {/* Conditional Custom Gift Input */}
                  {formData.preferredGift === "Custom Gift Preference" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 rounded-xl bg-navy-900/80 border border-amber-500/20 space-y-2"
                    >
                      <label className="block text-sm font-semibold text-amber-300">
                        Custom Gift Suggestion <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Engraved batch crest, coffee mug, or notebook"
                        value={formData.customGift}
                        onChange={(e) => updateField("customGift", e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg bg-navy-950 border text-white placeholder-slate-500 focus:outline-none ${
                          stepErrors.customGift
                            ? "border-rose-500"
                            : "border-slate-700 focus:border-amber-400"
                        }`}
                      />
                      {stepErrors.customGift && (
                        <p className="text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {stepErrors.customGift}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 6: Reunion Activities */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        Step 6: Reunion Activities
                      </h2>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                        {formData.preferredActivities.length} of 3 selected
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Which 3 activities would you like to see at this reunion? (Select up to 3)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ACTIVITY_OPTIONS.map((option) => {
                      const isSelected = formData.preferredActivities.includes(option);
                      const isMaxReached =
                        formData.preferredActivities.length >= 3 && !isSelected;

                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={isMaxReached}
                          onClick={() => togglePreferredActivity(option)}
                          className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-amber-400/15 border-amber-400 text-white ring-1 ring-amber-400/50 shadow-md"
                              : isMaxReached
                              ? "bg-navy-950/40 border-slate-800 text-slate-400 cursor-not-allowed opacity-50"
                              : "bg-navy-900/60 border-slate-700/70 text-slate-300 hover:border-slate-500 hover:bg-navy-900"
                          }`}
                        >
                          <span className="font-medium text-sm">{option}</span>
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ml-2 ${
                              isSelected
                                ? "border-amber-400 bg-amber-400 text-navy-950"
                                : "border-slate-600"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {stepErrors.preferredActivities && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {stepErrors.preferredActivities}
                    </p>
                  )}

                  {/* Conditional Custom Activity Input */}
                  {formData.preferredActivities.includes("Custom Activity") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 rounded-xl bg-navy-900/80 border border-amber-500/20 space-y-2"
                    >
                      <label className="block text-sm font-semibold text-amber-300">
                        Custom Activity Details <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Batch acoustic guitar session, sports match"
                        value={formData.customPreferredActivity}
                        onChange={(e) =>
                          updateField("customPreferredActivity", e.target.value)
                        }
                        className={`w-full px-4 py-2.5 rounded-lg bg-navy-950 border text-white placeholder-slate-500 focus:outline-none ${
                          stepErrors.customPreferredActivity
                            ? "border-rose-500"
                            : "border-slate-700 focus:border-amber-400"
                        }`}
                      />
                      {stepErrors.customPreferredActivity && (
                        <p className="text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {stepErrors.customPreferredActivity}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 7: Previous Reunion Experience */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        Step 7: Experiences to Avoid
                      </h2>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                        {formData.activitiesToAvoid.length} of 3 selected
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Which 3 experiences from previous reunions would you prefer NOT to repeat this time? (Select up to 3)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {AVOID_OPTIONS.map((option) => {
                      const isSelected = formData.activitiesToAvoid.includes(option);
                      const isMaxReached =
                        formData.activitiesToAvoid.length >= 3 && !isSelected;

                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={isMaxReached}
                          onClick={() => toggleAvoidActivity(option)}
                          className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-amber-400/15 border-amber-400 text-white ring-1 ring-amber-400/50 shadow-md"
                              : isMaxReached
                              ? "bg-navy-950/40 border-slate-800 text-slate-400 cursor-not-allowed opacity-50"
                              : "bg-navy-900/60 border-slate-700/70 text-slate-300 hover:border-slate-500 hover:bg-navy-900"
                          }`}
                        >
                          <span className="font-medium text-sm">{option}</span>
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ml-2 ${
                              isSelected
                                ? "border-amber-400 bg-amber-400 text-navy-950"
                                : "border-slate-600"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {stepErrors.activitiesToAvoid && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {stepErrors.activitiesToAvoid}
                    </p>
                  )}

                  {/* Conditional Custom Avoid Input */}
                  {formData.activitiesToAvoid.includes("Custom Suggestion") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 rounded-xl bg-navy-900/80 border border-amber-500/20 space-y-2"
                    >
                      <label className="block text-sm font-semibold text-amber-300">
                        Custom Pitfall to Avoid <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Unorganized seating or late starts"
                        value={formData.customAvoidActivity}
                        onChange={(e) =>
                          updateField("customAvoidActivity", e.target.value)
                        }
                        className={`w-full px-4 py-2.5 rounded-lg bg-navy-950 border text-white placeholder-slate-500 focus:outline-none ${
                          stepErrors.customAvoidActivity
                            ? "border-rose-500"
                            : "border-slate-700 focus:border-amber-400"
                        }`}
                      />
                      {stepErrors.customAvoidActivity && (
                        <p className="text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {stepErrors.customAvoidActivity}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 8: Additional Suggestions & Final Review */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-amber-400" />
                      Step 8: Additional Suggestions & Review
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Any additional ideas to make Progoti 21 Reunion more enjoyable and memorable?
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Your Thoughts or Special Requests{" "}
                      <span className="text-slate-400 text-xs font-normal">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Share any special ideas, venue suggestions, or requests with the Progoti 21 organizing committee..."
                      value={formData.additionalSuggestions}
                      onChange={(e) =>
                        updateField("additionalSuggestions", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl bg-navy-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>

                  {/* Summary Review Box */}
                  <div className="p-4 rounded-xl bg-navy-950/70 border border-amber-500/20 space-y-3 text-xs">
                    <p className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                      Quick Summary of Your Selections
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                      <div>
                        <span className="text-slate-400">Name:</span> {formData.fullName || "—"}
                      </div>
                      <div>
                        <span className="text-slate-400">Mobile:</span> {formData.mobileNumber || "—"}
                      </div>
                      <div>
                        <span className="text-slate-400">Date:</span>{" "}
                        {formData.preferredDate === "Custom Date"
                          ? `Custom: ${formData.customDate}`
                          : formData.preferredDate || "—"}
                      </div>
                      <div>
                        <span className="text-slate-400">Menu:</span>{" "}
                        {formData.preferredFood === "Custom Food Preference"
                          ? `Custom: ${formData.customFood}`
                          : formData.preferredFood || "—"}
                      </div>
                      <div>
                        <span className="text-slate-400">Schedule:</span>{" "}
                        {formData.mealSchedule || "—"}
                      </div>
                      <div>
                        <span className="text-slate-400">Gift:</span>{" "}
                        {formData.preferredGift === "Custom Gift Preference"
                          ? `Custom: ${formData.customGift}`
                          : formData.preferredGift || "—"}
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400">Top Activities:</span>{" "}
                        {formData.preferredActivities.length > 0
                          ? formData.preferredActivities.join(", ")
                          : "None"}
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400">Avoid:</span>{" "}
                        {formData.activitiesToAvoid.length > 0
                          ? formData.activitiesToAvoid.join(", ")
                          : "None"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-navy-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-navy-950 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-navy-950 hover:brightness-110 shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Submit My Response</span>
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
