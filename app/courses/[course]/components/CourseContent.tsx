import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Entry, EntryFieldTypes } from "contentful";
import { map, size } from "lodash";
import { MDXComponents as MDXComponentsType } from "mdx/types";
import { MDXRemote } from "next-mdx-remote/rsc";
import React, { Suspense } from "react";
import { MdCheckCircle } from "react-icons/md";

import { auth } from "@/auth";
import MDXComponents from "@/components/lessons-interface/mdx-components";
import PrimaryButton from "@/components/primary-button";
import { useDatabase } from "@/lib/hooks/useDatabase";
import {
  TypeAuthorSkeleton,
  TypeCourseModuleFields,
  TypeLessonSkeleton,
  TypeSectionFields,
  TypeSectionSkeleton,
} from "@/lib/types/contentful";
import { IProgressData } from "@/lib/types/IProgress";

import { ModuleProps } from "../types";

import ProgressBar from "./ProgressBar";

function StartLessonButton({
  isOnMachineCourse,
  hasEnrolled,
  slug,
  index,
}: {
  isOnMachineCourse: boolean;
  hasEnrolled: boolean;
  slug: string;
  index: number;
}) {
  const lessonUrl = `/courses/${slug}/lesson/${index + 1}/chapter/1`;
  const setupUrl = `/courses/${slug}/setup`;
  const url = isOnMachineCourse && !hasEnrolled ? setupUrl : lessonUrl;
  return (
    <PrimaryButton as="a" href={url} mt={12}>
      Start Lesson
    </PrimaryButton>
  );
}

function ModuleItem({
  index,
  module,
  slug,
  numOfCompletedLessons,
  isOnMachineCourse,
  hasEnrolled,
}: ModuleProps) {
  const { title, description, lessons } = module;
  const numOfLessons = size(lessons);

  return (
    <AccordionItem>
      <AccordionButton py={6}>
        <VStack spacing={4} w="full" align="start">
          <HStack w="full">
            <Text flex="1" textAlign="left" fontWeight="semibold" fontSize="xl">
              {title.toString()}
            </Text>
            <AccordionIcon fontSize={48} />
          </HStack>
          <VStack w="90%" align="end">
            <ProgressBar
              numOfCompletedLessons={numOfCompletedLessons}
              numOfLessons={numOfLessons}
            />
          </VStack>
        </VStack>
      </AccordionButton>
      <AccordionPanel pb={12} w="90%" pt={0}>
        <Suspense fallback={<div>Loading...</div>}>
          <MDXRemote
            source={description}
            components={MDXComponents as unknown as Readonly<MDXComponentsType>}
          />
        </Suspense>
        <StartLessonButton
          isOnMachineCourse={isOnMachineCourse}
          hasEnrolled={hasEnrolled}
          slug={slug}
          index={index}
        />
      </AccordionPanel>
    </AccordionItem>
  );
}

function ModuleList({
  sections,
}: {
  sections: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeLessonSkeleton | TypeSectionSkeleton>
  >;
}) {
  const sectionsData = sections as unknown as Entry<TypeSectionSkeleton>[];
  return (
    <Box
      bg="gray.700"
      border="2px solid"
      borderColor="gray.600"
      shadow="2xl"
      my={12}
      p={8}
      rounded={16}
    >
      <Heading as="h2" size="lg" mb={6}>
        What you&apos;ll learn:
      </Heading>
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
        gap={4}
        mb={4}
      >
        {sectionsData.map((section, index) => (
          <GridItem key={index} colSpan={1}>
            <Flex align="center">
              <MdCheckCircle size={21} color="#68D391" />
              <Text ml={2}>{section.fields.title.toString()}</Text>
            </Flex>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}

async function CourseContent({
  slug,
  title,
  author,
  description,
  sections,
  level,
  language,
  format,
}: TypeCourseModuleFields) {
  const { findOne } = useDatabase();
  const session = await auth();
  const authorData = author as unknown as TypeAuthorSkeleton;
  const sectionsData = sections as unknown as Entry<TypeSectionSkeleton>[];

  let progressData: IProgressData = {};

  if (session) {
    try {
      const res = await findOne("users", { email: session.user?.email });
      const data = res?.progress;
      progressData = data?.[slug.toString()];
    } catch (err) {
      console.error(err);
    }
  }
  const isOnMachineCourse = format?.toString() === "onMachineCourse";
  const hasEnrolled = false;
  const startCourseUrl = isOnMachineCourse
    ? hasEnrolled
      ? `/courses/${slug}/lesson/1/chapter/1`
      : `/courses/${slug}/setup`
    : `/courses/${slug}/lesson/1/chapter/1`;

  return (
    <Box maxW="4xl" mx="auto">
      <Heading as="h1" size="xl" fontWeight="800" my={4}>
        {title.toString()}
      </Heading>
      <Text>
        Written by{" "}
        <a
          href={authorData.fields.url.toString()}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#68D391" }}
        >
          {authorData.fields.name.toString()}
        </a>
      </Text>
      <Text mt={6}>{description.toString()}</Text>
      <HStack mt={4}>
        {map([level, language], (tag, key) => (
          <Tag key={key} size="md" variant="subtle" colorScheme="green">
            {tag.toString()}
          </Tag>
        ))}
      </HStack>
      <PrimaryButton as="a" size="lg" mt={8} href={startCourseUrl} px={12}>
        Start
      </PrimaryButton>

      <ModuleList sections={sections} />
      <Heading as="h2" size="lg" fontWeight="800" my={8}>
        Course Content
      </Heading>
      <Text mt={4} mb={8} color="gray.400" fontWeight="500">
        {size(sections)} lessons
      </Text>
      <Accordion allowToggle>
        {sectionsData.map((module, index) => (
          <ModuleItem
            key={index}
            index={index}
            module={module.fields as unknown as TypeSectionFields}
            numOfCompletedLessons={size(
              progressData?.[Number(index + 1).toString()],
            )}
            isOnMachineCourse={isOnMachineCourse}
            hasEnrolled={hasEnrolled}
            slug={slug.toString()}
          />
        ))}
      </Accordion>
    </Box>
  );
}

export default CourseContent;
