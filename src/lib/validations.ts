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
  "2nd day after Eid",
  "3rd day after Eid",
  "Custom Date",
] as const;

export const FOOD_OPTIONS = [
  "Biryani",
  "Morog Pulao",
  "Fried Rice + Chicken / Other Items",
  "Custom Food Preference",
] as const;

export const MEAL_SCHEDULE_OPTIONS = [
  "Lunch Only",
  "Lunch + Evening Snacks",
] as const;

export const GIFT_OPTIONS = [
  "Customized Gift Box",
  "Only Customized T-shirt",
  "Custom Gift Preference",
] as const;

export const ACTIVITY_OPTIONS = [
  "Cultural Program and Music",
  "Fun Games and Competitions",
  "Memories and Storytelling",
  "Photography and Photo Booth",
  "Batch Networking and Hangout",
  "Award Ceremony",
  "Surprise Performances",
  "Custom Activity",
] as const;

export const AVOID_OPTIONS = [
  "Long Speeches and Formalities",
  "Excessive Photo Sessions",
  "Repetitive Games and Competitions",
  "Lengthy Cultural Programs",
  "Delayed Food Serving",
  "Overly Formal Environment",
  "Custom Suggestion",
] as const;

export const surveyFormSchema = z
  .object({
    fullName: z
      .string({ required_error: "Full name is required" })
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name cannot exceed 100 characters"),
    mobileNumber: z
      .string({ required_error: "Mobile number is required" })
      .trim()
      .refine(
        (val) => {
          const cleaned = val.replace(/[\s\-\(\)]/g, "");
          return BD_PHONE_REGEX.test(cleaned);
        },
        {
          message:
            "Please provide a valid Bangladeshi mobile number (e.g., 017XXXXXXXX or +8801XXXXXXXX)",
        }
      ),
    preferredDate: z.string({
      required_error: "Please select your preferred reunion date",
    }),
    customDate: z.string().optional().nullable(),
    preferredFood: z.string({
      required_error: "Please select your preferred food menu",
    }),
    customFood: z.string().optional().nullable(),
    mealSchedule: z.string({
      required_error: "Please select your meal schedule preference",
    }),
    preferredGift: z.string({
      required_error: "Please select your reunion gift preference",
    }),
    customGift: z.string().optional().nullable(),
    preferredActivities: z
      .array(z.string())
      .min(1, "Please select at least 1 activity")
      .max(3, "You can select up to 3 activities only"),
    customPreferredActivity: z.string().optional().nullable(),
    activitiesToAvoid: z
      .array(z.string())
      .max(3, "You can select up to 3 experiences to avoid"),
    customAvoidActivity: z.string().optional().nullable(),
    additionalSuggestions: z
      .string()
      .max(2000, "Suggestions cannot exceed 2000 characters")
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    // Custom Date validation
    if (data.preferredDate === "Custom Date") {
      if (!data.customDate || data.customDate.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please choose your preferred custom date",
          path: ["customDate"],
        });
      }
    }

    // Custom Food validation
    if (data.preferredFood === "Custom Food Preference") {
      if (!data.customFood || data.customFood.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter your custom food preference",
          path: ["customFood"],
        });
      }
    }

    // Custom Gift validation
    if (data.preferredGift === "Custom Gift Preference") {
      if (!data.customGift || data.customGift.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter your custom gift suggestion",
          path: ["customGift"],
        });
      }
    }

    // Custom Activity validation
    if (data.preferredActivities.includes("Custom Activity")) {
      if (
        !data.customPreferredActivity ||
        data.customPreferredActivity.trim().length < 2
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please specify your custom activity",
          path: ["customPreferredActivity"],
        });
      }
    }

    // Custom Avoid validation
    if (data.activitiesToAvoid.includes("Custom Suggestion")) {
      if (
        !data.customAvoidActivity ||
        data.customAvoidActivity.trim().length < 2
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please specify your custom experience to avoid",
          path: ["customAvoidActivity"],
        });
      }
    }
  });

export type SurveyFormData = z.infer<typeof surveyFormSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;
