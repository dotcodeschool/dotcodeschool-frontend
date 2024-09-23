import { TypeLesson, TypeSectionSkeleton } from "@/lib/types/contentful";
import { getContentById, getCourseData, slugToTitleCase } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { course: string; lesson: string; chapter: string };
}) {
  const { course: courseSlug, lesson, chapter } = params;
  const courseTitle = slugToTitleCase(courseSlug);
  const course = await getCourseData(courseSlug);
  const sectionFields = (course.sections as unknown as TypeSectionSkeleton[])[
    Number(lesson) - 1
  ].fields;
  const sectionTitle = sectionFields.title;
  const lessonId = (
    sectionFields.lessons as unknown as TypeLesson<"WITH_ALL_LOCALES">[]
  )[Number(chapter) - 1].sys.id;
  const lessonData = await getContentById(lessonId);
  const lessonTitle = lessonData.fields.title;
  const title = `${lessonTitle} - ${sectionTitle} - ${courseTitle} | Dot Code School`;
  const description = sectionFields.description.toString();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://dotcodeschool.com/courses`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
