import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/db/mongodb";
import { IProgressUpdate } from "@/lib/types/IProgress";

export async function POST(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db("dcs-test");

  try {
    const data = await req.json();
    const updates: IProgressUpdate[] = data.updates;

    const operations = updates.map((update) => {
      const { user, progress } = update;
      const updateObject: Record<string, boolean> = {};
      for (const courseId in progress) {
        for (const lessonId in progress[courseId]) {
          for (const chapterId in progress[courseId][lessonId]) {
            const path = `progress.${courseId}.${lessonId}.${chapterId}`;
            updateObject[path] = progress[courseId][lessonId][chapterId];
          }
        }
      }
      return {
        updateOne: {
          filter: { email: user.email },
          update: { $set: updateObject },
        },
      };
    });

    const result = await db.collection("users").bulkWrite(operations);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
