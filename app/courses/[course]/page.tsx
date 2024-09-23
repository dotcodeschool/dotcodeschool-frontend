import { Box, Link } from "@chakra-ui/react";
import React, { Suspense } from "react";
import { IoArrowBack } from "react-icons/io5";

import Navbar from "@/components/navbar";
import { TypeCourseModuleFields } from "@/lib/types/contentful";
import { getCourseData } from "@/lib/utils";

import CourseContent from "./components/CourseContent";
import CourseContentSkeleton from "./components/CourseContentSkeleton";

export { generateMetadata } from "./metadata";

async function CoursePage({ params }: { params: { course: string } }) {
  const courseData: TypeCourseModuleFields = await getCourseData(params.course);

  return (
    <Box maxW="8xl" mx="auto" px={[4, 12]}>
      <Navbar cta={false} />
      <Box maxW="4xl" mx="auto">
        <Link href="/courses" color="green.500" fontSize="5xl">
          <IoArrowBack />
        </Link>
        <Suspense fallback={<CourseContentSkeleton />}>
          <CourseContent {...courseData} />
        </Suspense>
      </Box>
    </Box>
  );
}

export default CoursePage;
