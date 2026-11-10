import { NextRequest, NextResponse } from "next/server";
import {
  adminLoginSchema,
} from "@/lib/validations";
import {
  verifyAdminCredentials,
  createSessionToken,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  getAdminSession,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = adminLoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email and password." },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const isValid = await verifyAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid admin email or password." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(email);
    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Admin authenticated successfully.",
    });
  } catch (err: any) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { success: false, error: "Server authentication error." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      email: session.email,
    });
  } catch (err) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  try {
    await clearAdminSessionCookie();
    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to log out." },
      { status: 500 }
    );
  }
}
