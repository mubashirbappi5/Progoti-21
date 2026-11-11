import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/db";
import { reunionSubmissions } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const db = getDb();
    const allRows = await db
      .select()
      .from(reunionSubmissions)
      .orderBy(desc(reunionSubmissions.createdAt));

    // Calculate analytics and aggregations
    const dateCounts: Record<string, number> = {};
    const foodCounts: Record<string, number> = {};
    const mealCounts: Record<string, number> = {};
    const giftCounts: Record<string, number> = {};
    const activityCounts: Record<string, number> = {};
    const avoidCounts: Record<string, number> = {};

    for (const row of allRows) {
      // Date
      dateCounts[row.preferredDate] = (dateCounts[row.preferredDate] || 0) + 1;

      // Food
      const foodLabel =
        row.preferredFood === "Custom Food Preference" && row.customFood
          ? `Custom: ${row.customFood}`
          : row.preferredFood;
      foodCounts[foodLabel] = (foodCounts[foodLabel] || 0) + 1;

      // Meal
      mealCounts[row.mealSchedule] = (mealCounts[row.mealSchedule] || 0) + 1;

      // Gift
      const giftLabel =
        row.preferredGift === "Custom Gift Preference" && row.customGift
          ? `Custom: ${row.customGift}`
          : row.preferredGift;
      giftCounts[giftLabel] = (giftCounts[giftLabel] || 0) + 1;

      // Preferred Activities
      if (Array.isArray(row.preferredActivities)) {
        for (const act of row.preferredActivities) {
          activityCounts[act] = (activityCounts[act] || 0) + 1;
        }
      }

      // Avoid Activities
      if (Array.isArray(row.activitiesToAvoid)) {
        for (const av of row.activitiesToAvoid) {
          avoidCounts[av] = (avoidCounts[av] || 0) + 1;
        }
      }
    }

    // Helper to get top item
    const getTopItem = (counts: Record<string, number>): string => {
      const entries = Object.entries(counts);
      if (entries.length === 0) return "N/A";
      entries.sort((a, b) => b[1] - a[1]);
      return entries[0][0];
    };

    const overview = {
      totalSubmissions: allRows.length,
      totalUniqueParticipants: new Set(allRows.map((r) => r.mobileNumber)).size,
      topPreferredDate: getTopItem(dateCounts),
      topPreferredFood: getTopItem(foodCounts),
      topPreferredGift: getTopItem(giftCounts),
      topPreferredActivity: getTopItem(activityCounts),
    };

    const charts = {
      datePreferences: Object.entries(dateCounts).map(([name, value]) => ({
        name,
        value,
      })),
      foodPreferences: Object.entries(foodCounts).map(([name, value]) => ({
        name,
        value,
      })),
      mealSchedulePreferences: Object.entries(mealCounts).map(([name, value]) => ({
        name,
        value,
      })),
      giftPreferences: Object.entries(giftCounts).map(([name, value]) => ({
        name,
        value,
      })),
      activityPopularity: Object.entries(activityCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      activitiesToAvoid: Object.entries(avoidCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    };

    return NextResponse.json({
      success: true,
      submissions: allRows,
      overview,
      charts,
    });
  } catch (err: any) {
    console.error("Admin fetch submissions error:", err);
    if (err?.message?.includes("DATABASE_URL")) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL is not configured in .env.local",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load submissions from Neon database.",
      },
      { status: 500 }
    );
  }
}

