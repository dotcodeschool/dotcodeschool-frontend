import { NextRequest, NextResponse } from "next/server";

import { useDatabase } from "@/lib/hooks/useDatabase";

export async function GET(req: NextRequest) {
  const { findOne } = useDatabase();

  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get("user[email]");

  if (!email) {
    return NextResponse.json(
      { error: "User parameter is required" },
      { status: 400 },
    );
  }

  try {
    const result = await findOne("users", { email });
    return NextResponse.json(result);
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
