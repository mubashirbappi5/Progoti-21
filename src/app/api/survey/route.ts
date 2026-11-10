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
          error: "Too many submission attempts. Please wait a moment and try again.",
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
          error: "Validation failed. Please check the form errors.",
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

    // Process activities: if "Custom Activity" was selected, format appropriately
    const processedPreferredActivities = data.preferredActivities.map((act) => {
      if (act === "Custom Activity" && data.customPreferredActivity) {
        return `Custom: ${sanitizeText(data.customPreferredActivity)}`;
      }
      return sanitizeText(act);
    });

    const processedActivitiesToAvoid = data.activitiesToAvoid.map((act) => {
      if (act === "Custom Suggestion" && data.customAvoidActivity) {
        return `Custom: ${sanitizeText(data.customAvoidActivity)}`;
      }
      return sanitizeText(act);
    });

    // 5. Connect to Neon PostgreSQL via Drizzle
    const db = getDb();

    // 6. Check for duplicate mobile number
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
            "A survey response has already been submitted with this mobile number. Each member can only submit once.",
          code: "DUPLICATE_MOBILE",
        },
        { status: 409 }
      );
    }

    // 7. Insert record into Neon PostgreSQL
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
      message: "Survey response submitted successfully!",
      id: submissionId,
    });
  } catch (err: any) {
    console.error("Survey submission error:", err);

    // Check for PostgreSQL unique constraint violation error code 23505
    if (err?.code === "23505" || err?.message?.includes("reunion_submissions_mobile_number_unique")) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A survey response has already been submitted with this mobile number. Each member can only submit once.",
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
            "Database configuration error: Neon DATABASE_URL is not set. Please add DATABASE_URL in .env.local",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "An unexpected server error occurred while saving your response. Please try again.",
      },
      { status: 500 }
    );
  }
}
