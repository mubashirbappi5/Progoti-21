import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { reunionSubmissions } from "@/db/schema";
import { surveyFormSchema, normalizeBdPhone } from "@/lib/validations";
import { sanitizeText } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting by IP
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous-client";

    const rateLimit = checkRateLimit(clientIp, 6, 60 * 1000); // 6 attempts per minute
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "অতিরিক্ত অনুরোধ পাঠানো হয়েছে। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করে আবার চেষ্টা করুন।",
        },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await req.json();

    // 3. Zod schema validation
    const validationResult = surveyFormSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        const path = err.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = err.message;
        }
      });
      return NextResponse.json(
        {
          success: false,
          error: "ফরমে কিছু ত্রুটি রয়েছে। অনুগ্রহ করে লাল চিহ্নিত ফিল্ডগুলো যাচাই করুন।",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const normalizedMobile = normalizeBdPhone(data.mobileNumber);

    // 4. Sanitize inputs
    const fullName = sanitizeText(data.fullName);
    const preferredDate = sanitizeText(data.preferredDate);
    const customDate = data.customDate ? sanitizeText(data.customDate) : null;
    const preferredFood = sanitizeText(data.preferredFood);
    const customFood = data.customFood ? sanitizeText(data.customFood) : null;
    const mealSchedule = sanitizeText(data.mealSchedule);
    const preferredGift = sanitizeText(data.preferredGift);
    const customGift = data.customGift ? sanitizeText(data.customGift) : null;
    const additionalSuggestions = data.additionalSuggestions
      ? sanitizeText(data.additionalSuggestions)
      : null;

    // 5. Process Step 6: 3 activity inputs
    let processedPreferredActivities: string[] = [];
    if (
      Array.isArray(data.preferredActivities) &&
      data.preferredActivities.length > 0
    ) {
      processedPreferredActivities = data.preferredActivities
        .map(sanitizeText)
        .filter(Boolean);
    } else {
      const rawActivities = [data.activity1, data.activity2, data.activity3];
      processedPreferredActivities = rawActivities
        .map((a) => (a ? sanitizeText(a) : ""))
        .filter((a) => a.length > 0);
    }

    // 6. Process Step 7: 3 avoid inputs
    let processedActivitiesToAvoid: string[] = [];
    if (
      Array.isArray(data.activitiesToAvoid) &&
      data.activitiesToAvoid.length > 0
    ) {
      processedActivitiesToAvoid = data.activitiesToAvoid
        .map(sanitizeText)
        .filter(Boolean);
    } else {
      const rawAvoids = [data.avoid1, data.avoid2, data.avoid3];
      processedActivitiesToAvoid = rawAvoids
        .map((a) => (a ? sanitizeText(a) : ""))
        .filter((a) => a.length > 0);
    }

    // 7. Connect to Neon PostgreSQL via Drizzle
    const db = getDb();

    // 8. Check for duplicate mobile number
    const existing = await db
      .select({ id: reunionSubmissions.id, fullName: reunionSubmissions.fullName })
      .from(reunionSubmissions)
      .where(eq(reunionSubmissions.mobileNumber, normalizedMobile))
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি মতামত সাবমিট করা হয়েছে। প্রতিটি সদস্য শুধুমাত্র একবারই সাবমিট করতে পারবেন।",
          code: "DUPLICATE_MOBILE",
        },
        { status: 409 }
      );
    }

    // 9. Insert record into Neon PostgreSQL
    const inserted = await db
      .insert(reunionSubmissions)
      .values({
        fullName,
        mobileNumber: normalizedMobile,
        preferredDate,
        customDate: customDate ? customDate : null,
        preferredFood,
        customFood: customFood || null,
        mealSchedule,
        preferredGift,
        customGift: customGift || null,
        preferredActivities: processedPreferredActivities,
        activitiesToAvoid: processedActivitiesToAvoid,
        additionalSuggestions: additionalSuggestions || null,
      })
      .returning({ id: reunionSubmissions.id });

    const submissionId = inserted[0]?.id;

    return NextResponse.json({
      success: true,
      message: "আপনার মতামত সফলভাবে সংরক্ষণ করা হয়েছে!",
      id: submissionId,
    });
  } catch (err: any) {
    console.error("Survey submission error:", err);

    // Check for PostgreSQL unique constraint violation error code 23505
    if (
      err?.code === "23505" ||
      err?.message?.includes("reunion_submissions_mobile_number_unique")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি মতামত সাবমিট করা হয়েছে। প্রতিটি সদস্য শুধুমাত্র একবারই সাবমিট করতে পারবেন।",
          code: "DUPLICATE_MOBILE",
        },
        { status: 409 }
      );
    }

    // Check for database connection issue
    if (err?.message?.includes("DATABASE_URL")) {
      return NextResponse.json(
        {
          success: false,
          error:
            "ডাটাবেজ সংযোগ ত্রুটি: Neon DATABASE_URL পাওয়া যায়নি। অনুগ্রহ করে .env.local যাচাই করুন।",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "সার্ভার থেকে আপনার মতামত সেভ করার সময় একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}
