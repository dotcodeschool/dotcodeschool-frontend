import { Box, Grid, GridItem, IconButton, Link, Text } from "@chakra-ui/react";
import { Asset, AssetFields, EntryCollection } from "contentful";
import { isEmpty, isNil, size } from "lodash";
import { MDXComponents as MDXComponentsType } from "mdx/types";
import { notFound, redirect } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import BottomNavbar from "@/components/lessons-interface/bottom-navbar";
import { EditorComponents } from "@/components/lessons-interface/EditorComponents";
import MDXComponents from "@/components/lessons-interface/mdx-components";
import Navbar from "@/components/navbar";
import {
  TypeCourseModuleSkeleton,
  TypeFilesSkeleton,
  TypeLesson,
  TypeLessonFields,
  TypeLessonSkeleton,
  TypeSectionFields,
  TypeSectionSkeleton,
} from "@/lib/types/contentful";
import { TypeFile } from "@/lib/types/TypeFile";
import { getContentById, getContentByType } from "@/lib/utils";

import "@/styles/resizer.css";

export { generateMetadata } from "./metadata";

async function fetchFile(fileFields: AssetFields): Promise<TypeFile> {
  if (!fileFields.file) {
    throw new Error("File field is missing");
  }

  const { url, fileName } = fileFields.file;
  const response = await fetch(`https:${url}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  return {
    fileName,
    code: await response.text(),
    language: fileName.endsWith(".diff") ? "diff" : "rust",
  };
}

export default async function CourseModule({
  params,
}: {
  params: {
    course: string;
    lesson: string;
    chapter: string;
  };
}) {
  const { course, lesson, chapter } = params;
  const courses: EntryCollection<TypeCourseModuleSkeleton> =
    await getContentByType("courseModule");

  const courseData = courses.items.find(
    (course) => course.fields.slug === params.course,
  );
  if (!courseData) {
    notFound();
  }

  // const session = await auth();

  // const repo = await findRepo(course, userId)
  const hasEnrolled = true; // TODO: check
  if (!hasEnrolled && courseData.fields.format === "onMachineCourse") {
    redirect(`/courses/${params.course}/setup`);
  }

  const sections: TypeSectionFields[] = await Promise.all(
    (courseData.fields.sections as unknown as TypeSectionSkeleton[]).map(
      async (section) => {
        const lessons = await Promise.all(
          (
            section.fields
              .lessons as unknown as TypeLesson<"WITH_ALL_LOCALES">[]
          ).map(async (lesson: TypeLesson<"WITH_ALL_LOCALES">) => {
            return await getContentById(lesson.sys.id);
          }),
        );
        return {
          ...section.fields,
          lessons,
        } as unknown as TypeSectionFields;
      },
    ),
  );

  const sectionData = sections[Number(lesson) - 1];
  if (!sectionData) {
    notFound();
  }

  const lessons = (sectionData.lessons as unknown as TypeLessonSkeleton[]).map(
    (lesson) => lesson.fields,
  );

  if (!lessons) {
    notFound();
  }

  const lessonData: TypeLessonFields = lessons[
    Number(chapter) - 1
  ] as TypeLessonFields;
  if (!lessonData) {
    notFound();
  }

  const { source, template, solution } = (
    lessonData.files as unknown as TypeFilesSkeleton
  )?.fields || {
    source: [],
    template: [],
    solution: [],
  };

  const readOnly = isEmpty(solution) || isNil(solution);
  const parsedSolution = !readOnly
    ? await Promise.all(
        (solution as unknown as Asset<"WITHOUT_LINK_RESOLUTION">[]).map(
          (asset) => fetchFile(asset.fields),
        ),
      )
    : solution;
  const startingFiles = !isEmpty(source) ? source : template;
  const startingFilesWithCodeAndLanguage = startingFiles
    ? await Promise.all(
        (startingFiles as unknown as Asset<"WITHOUT_LINK_RESOLUTION">[]).map(
          (asset) => fetchFile(asset.fields),
        ),
      )
    : [];

  const prev: string | undefined =
    chapter === "1" && lesson === "1"
      ? undefined
      : chapter === "1"
        ? `${course}/lesson/${Number(lesson) - 1}/chapter/${size(sections[Number(lesson) - 2].lessons)}`
        : `${course}/lesson/${lesson}/chapter/${Number(chapter) - 1}`;

  const next: string | undefined =
    chapter === size(sections[Number(lesson) - 1].lessons).toString() &&
    lesson === sections.length.toString()
      ? undefined
      : chapter === size(sections[Number(lesson) - 1].lessons).toString()
        ? `${course}/lesson/${Number(lesson) + 1}/chapter/1`
        : `${course}/lesson/${lesson}/chapter/${Number(chapter) + 1}`;

  return (
    <Box
      h="100vh"
      position="relative"
      overflow={{ base: "auto", md: "hidden" }}
    >
      <Navbar
        cta={false}
        isLessonInterface
        lessonDetails={{
          courseId: course,
          lessonId: lesson,
          chapterId: chapter,
          chapters: lessons,
          githubUrl: courseData.fields.githubUrl.toString(),
        }}
      />
      <Box>
        <IconButton
          as={Link}
          display={{ base: "block", md: "none" }}
          aria-label="Submit Feedback"
          variant="solid"
          colorScheme="blue"
          icon={
            <Text fontSize="xl" w="full" textAlign="center" pt="2">
              ✍️
            </Text>
          }
          position="fixed"
          bottom={20}
          right={4}
          zIndex={100}
          href={`${courseData.fields.githubUrl.toString()}/issues/new?assignees=&labels=feedback&template=feedback.md&title=Dot+Code+School+Suggestion:+Feedback+for+Section+${lesson}+-+Chapter+${chapter}:+${lessonData.title}`}
          isExternal
          _hover={{ textDecor: "none" }}
        />
        <Box display={{ base: "none", md: "block" }}>
          <EditorComponents
            showHints={!!solution}
            readOnly={readOnly}
            solution={parsedSolution || []}
            editorContent={startingFilesWithCodeAndLanguage}
            mdxContent={
              <MDXRemote
                source={lessonData.content.toString()}
                components={
                  MDXComponents as unknown as Readonly<MDXComponentsType>
                }
              />
            }
          />
        </Box>
        <Grid
          templateColumns="repeat(12, 1fr)"
          gap={1}
          pb={24}
          display={{ base: "block", md: "none" }}
        >
          <GridItem colSpan={[12, 5]} overflowY="auto" px={6} pt={4}>
            <MDXRemote
              source={lessonData.content.toString()}
              components={
                MDXComponents as unknown as Readonly<MDXComponentsType>
              }
            />
          </GridItem>
          <GridItem colSpan={[12, 7]} overflow="clip">
            <EditorComponents
              showHints={!!solution}
              readOnly={readOnly}
              solution={parsedSolution || []}
              editorContent={startingFilesWithCodeAndLanguage}
            />
          </GridItem>
        </Grid>
      </Box>
      <BottomNavbar
        prev={prev}
        next={next}
        courseId={course}
        lessonId={lesson}
        chapterId={chapter}
        current={`${course}/lesson/${lesson}/chapter/${chapter}`}
        sections={sections}
      />
    </Box>
  );
}
