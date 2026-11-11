import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/db";
import { reunionSubmissions } from "@/db/schema";
import { desc } from "drizzle-orm";

function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

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
    const rows = await db
      .select()
      .from(reunionSubmissions)
      .orderBy(desc(reunionSubmissions.createdAt));

    const headers = [
      "ID",
      "Full Name",
      "Mobile Number",
      "Preferred Date",
      "Custom Date",
      "Preferred Food",
      "Custom Food",
      "Meal Schedule",
      "Preferred Gift",
      "Custom Gift",
      "Preferred Activities",
      "Activities to Avoid",
      "Additional Suggestions",
      "Submitted At",
    ];

    const csvLines = [headers.map(escapeCsvCell).join(",")];

    for (const r of rows) {
      const preferredActivities = Array.isArray(r.preferredActivities)
        ? r.preferredActivities.join("; ")
        : "";
      const activitiesToAvoid = Array.isArray(r.activitiesToAvoid)
        ? r.activitiesToAvoid.join("; ")
        : "";

      const rowValues = [
        r.id,
        r.fullName,
        r.mobileNumber,
        r.preferredDate,
        r.customDate || "",
        r.preferredFood,
        r.customFood || "",
        r.mealSchedule,
        r.preferredGift,
        r.customGift || "",
        preferredActivities,
        activitiesToAvoid,
        r.additionalSuggestions || "",
        r.createdAt ? new Date(r.createdAt).toISOString() : "",
      ];

      csvLines.push(rowValues.map(escapeCsvCell).join(","));
    }

    // Include UTF-8 BOM so Microsoft Excel and Google Sheets render correctly
    const csvContent = "\uFEFF" + csvLines.join("\r\n");
    const dateStr = new Date().toISOString().split("T")[0];

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="progoti-21-reunion-responses-${dateStr}.csv"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    console.error("CSV Export error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to export CSV." },
      { status: 500 }
    );
  }
}

