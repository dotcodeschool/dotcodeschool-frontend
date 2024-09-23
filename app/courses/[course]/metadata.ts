import { getCourseData } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { course: string };
}) {
  const course = await getCourseData(params.course);

  return {
    title: `${course.title} | Dot Code School`,
    description: course.description.toString(),
    openGraph: {
      title: course.title.toString(),
      description: course.description.toString(),
      type: "website",
      url: `https://dotcodeschool.com/courses/${params.course}`,
    },
    twitter: {
      card: "summary_large_image",
      title: course.title.toString(),
      description: course.description.toString(),
    },
  };
}
