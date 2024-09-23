import { Entry } from "contentful";
import { isNil } from "lodash";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

import { Repository } from "@/lib/db/models";
import { useDatabase } from "@/lib/hooks/useDatabase";
import { IParsedDiff } from "@/lib/types/IParsedDiff";
import { getContentByType } from "@/lib/utils";

import {
  TypeCourseModuleFields,
  TypeCourseModuleSkeleton,
} from "../types/contentful";

export { getContentById, getContentByType } from "./get-content";

export function parseDiff(diff: string): IParsedDiff {
  let currentFile = "";
  const files: { [key: string]: string } = {};
  let content = "";

  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git")) {
      if (currentFile) {
        files[currentFile] = content;
      }
      [, currentFile] = line.split(" ");
      content = `${line}\n`;
    } else if (line.startsWith("index")) {
      content += `${line}\n`;
    } else if (line.startsWith("--- ")) {
      content += `${line}\n`;
    } else if (line.startsWith("+++ ")) {
      content += `${line}\n`;
    } else if (line.startsWith("@@")) {
      content += `${line}\n`;
    } else if (line.startsWith("-")) {
      content += `${line}\n`;
    } else if (line.startsWith("+")) {
      content += `${line}\n`;
    } else {
      content += `${line}\n`;
    }
  }

  if (currentFile) {
    files[currentFile] = content;
  }

  return files;
}

export async function getCourseData(
  courseSlug: string,
): Promise<TypeCourseModuleFields> {
  const res = await getContentByType<TypeCourseModuleSkeleton>("courseModule");
  const entry = res.items.find(
    (item: Entry<TypeCourseModuleSkeleton>) => item.fields.slug === courseSlug,
  );

  if (isNil(entry)) {
    notFound();
  } else {
    const typedEntry = entry as Entry<TypeCourseModuleSkeleton>;

    return typedEntry.fields as unknown as TypeCourseModuleFields;
  }
}

export function slugToTitleCase(slug: string): string {
  // Split the slug into words
  const words = slug.split("-");

  // Capitalize the first letter of each word and join them
  const titleCase = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return titleCase;
}

export async function findRepo(
  courseSlug: string,
  userId: string,
): Promise<Repository | undefined> {
  const { findOne } = useDatabase();
  try {
    const courseId = await getCourseIdFromSlug(courseSlug);
    const result = await findOne("repositories", {
      "relationships.course.id": courseId?.toString(),
      "relationships.user.id": userId,
    });
    console.log(result);
    return result as Repository;
  } catch (error) {
    console.error("MongoDB error:", error);
  }
}

export async function getCourseIdFromSlug(
  courseSlug: string,
): Promise<ObjectId | undefined> {
  const { findOne } = useDatabase();
  try {
    const result = await findOne("courses", { slug: courseSlug });
    return result?._id;
  } catch (error) {
    console.error("MongoDB error:", error);
  }
}
