import { z } from "zod";

export const BD_PHONE_REGEX = /^(?:\+?88|88)?01[3-9]\d{8}$/;

export function normalizeBdPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  if (cleaned.startsWith("+88")) {
    return cleaned.slice(3);
  }
  if (cleaned.startsWith("88") && cleaned.length === 13) {
    return cleaned.slice(2);
  }
  return cleaned;
}

export const DATE_OPTIONS = [
  "ঈদের ২য় দিন",
  "ঈদের ৩য় দিন",
  "পছন্দসই কাস্টম তারিখ",
] as const;

export const FOOD_OPTIONS = [
  "বিরিয়ানি",
  "মোরগ পোলাও",
  "ফ্রাইড রাইস + চিকেন / অন্যান্য আইটেম",
  "পছন্দসই অন্য খাবার",
] as const;

export const MEAL_SCHEDULE_OPTIONS = [
  "শুধুমাত্র দুপুরের খাবার",
  "দুপুরের খাবার + সন্ধ্যার নাস্তা",
] as const;

export const GIFT_OPTIONS = [
  "কাস্টমাইজড গিফট বক্স",
  "শুধুমাত্র কাস্টমাইজড টি-শার্ট",
  "পছন্দসই অন্য উপহার",
] as const;

export const surveyFormSchema = z
  .object({
    fullName: z
      .string({ required_error: "অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন" })
      .trim()
      .min(2, "পূর্ণ নাম কমপক্ষে ২ অক্ষরের হতে হবে")
      .max(100, "নাম ১০০ অক্ষরের বেশি হতে পারবে না"),
    mobileNumber: z
      .string({ required_error: "মোবাইল নম্বর দেওয়া আবশ্যক" })
      .trim()
      .refine(
        (val) => {
          const cleaned = val.replace(/[\s\-\(\)]/g, "");
          return BD_PHONE_REGEX.test(cleaned);
        },
        {
          message:
            "সঠিক বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX বা +88017XXXXXXXX)",
        }
      ),
    preferredDate: z.string({
      required_error: "অনুগ্রহ করে পুনর্মিলনীর তারিখ পছন্দ করুন",
    }),
    customDate: z.string().optional().nullable(),
    preferredFood: z.string({
      required_error: "অনুগ্রহ করে খাবারের পছন্দ নির্বাচন করুন",
    }),
    customFood: z.string().optional().nullable(),
    mealSchedule: z.string({
      required_error: "অনুগ্রহ করে খাবারের সময়সূচি নির্বাচন করুন",
    }),
    preferredGift: z.string({
      required_error: "অনুগ্রহ করে পুনর্মিলনী উপহারের পছন্দ নির্বাচন করুন",
    }),
    customGift: z.string().optional().nullable(),

    // Step 6: 3 text input fields for preferred activities
    activity1: z
      .string({ required_error: "কমপক্ষে ১টি পছন্দের আয়োজন লিখুন" })
      .trim()
      .min(2, "অনুষ্ঠানে আপনি দেখতে চান এমন কমপক্ষে ১টি আয়োজন লিখুন")
      .optional()
      .or(z.literal("")),
    activity2: z.string().optional().nullable(),
    activity3: z.string().optional().nullable(),
    preferredActivities: z.array(z.string()).optional(),

    // Step 7: 3 text input fields for activities to avoid
    avoid1: z.string().optional().nullable(),
    avoid2: z.string().optional().nullable(),
    avoid3: z.string().optional().nullable(),
    activitiesToAvoid: z.array(z.string()).optional(),

    // Step 8: Additional suggestions
    additionalSuggestions: z
      .string()
      .max(2000, "পরামর্শ ২০০০ অক্ষরের বেশি হতে পারবে না")
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    // Custom Date validation
    if (
      data.preferredDate === "পছন্দসই কাস্টম তারিখ" ||
      data.preferredDate === "Custom Date"
    ) {
      if (!data.customDate || data.customDate.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "অনুগ্রহ করে আপনার পছন্দসই তারিখটি ক্যালেন্ডার থেকে নির্বাচন করুন",
          path: ["customDate"],
        });
      }
    }

    // Custom Food validation
    if (
      data.preferredFood === "পছন্দসই অন্য খাবার" ||
      data.preferredFood === "Custom Food Preference"
    ) {
      if (!data.customFood || data.customFood.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "অনুগ্রহ করে আপনার পছন্দের খাবারের বিবরণ লিখুন",
          path: ["customFood"],
        });
      }
    }

    // Custom Gift validation
    if (
      data.preferredGift === "পছন্দসই অন্য উপহার" ||
      data.preferredGift === "Custom Gift Preference"
    ) {
      if (!data.customGift || data.customGift.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "অনুগ্রহ করে আপনার পছন্দের উপহারের পরামর্শ লিখুন",
          path: ["customGift"],
        });
      }
    }

    // Step 6 Activity validation: require at least one activity either via activity1 or preferredActivities
    const hasActivity1 = data.activity1 && data.activity1.trim().length >= 2;
    const hasActivitiesArray =
      Array.isArray(data.preferredActivities) &&
      data.preferredActivities.length > 0;

    if (!hasActivity1 && !hasActivitiesArray) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "কমপক্ষে ১টি পছন্দের আয়োজন বা অনুষ্ঠানের নাম লিখুন (আয়োজন ১)",
        path: ["activity1"],
      });
    }
  });

export type SurveyFormData = z.infer<typeof surveyFormSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email("সঠিক ইমেইল ঠিকানা লিখুন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;
