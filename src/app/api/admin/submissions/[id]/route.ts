import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/db";
import { reunionSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Submission ID is required." },
        { status: 400 }
      );
    }

    const db = getDb();
    const deleted = await db
      .delete(reunionSubmissions)
      .where(eq(reunionSubmissions.id, id))
      .returning({ id: reunionSubmissions.id });

    if (!deleted || deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: "Submission not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submission deleted successfully.",
    });
  } catch (err: any) {
    console.error("Delete submission error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete submission." },
      { status: 500 }
    );
  }
}

