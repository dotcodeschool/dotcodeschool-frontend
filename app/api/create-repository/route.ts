import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/v0/create-repository`,
      body,
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("An error occurred while creating the repository", error);
    return NextResponse.json(
      { error: "An error occurred while creating the repository" },
      { status: 500 },
    );
  }
}
