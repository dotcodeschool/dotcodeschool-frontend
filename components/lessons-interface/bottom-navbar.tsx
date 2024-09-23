"use client";

import {
  HamburgerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Text,
  Link,
  Icon,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
  Tooltip,
} from "@chakra-ui/react";
import { map } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { MdCode, MdNumbers } from "react-icons/md";

import { useProgress } from "@/lib/hooks/useProgress";
import {
  TypeLessonFields,
  TypeLessonSkeleton,
  TypeSectionFields,
} from "@/lib/types/contentful";

interface SectionProps {
  courseId: string;
  sectionIndex: number;
  section: TypeSectionFields;
  current: string;
  isActive: boolean;
}

function Section({
  courseId,
  sectionIndex,
  section: { title, lessons },
  current,
  isActive,
}: SectionProps) {
  const lessonsArray: TypeLessonFields[] = (
    lessons as unknown as TypeLessonSkeleton[]
  ).map(({ fields }: { fields: TypeLessonFields }) => fields);

  return (
    <AccordionItem border="none">
      <AccordionButton
        py={4}
        fontWeight={isActive ? "bold" : "500"}
        _hover={{
          bg: !isActive && "whiteAlpha.100",
          color: !isActive && "white",
        }}
      >
        <Icon
          as={isActive ? MdCode : MdNumbers}
          color={isActive ? "green.300" : "gray.300"}
          fontSize="xl"
        />
        <Tooltip
          label={title.toString()}
          aria-label={title.toString()}
          openDelay={750}
          hasArrow
        >
          <Text textAlign="left" flex={1} pl={2} isTruncated>
            {title.toString()}
          </Text>
        </Tooltip>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel px={0}>
        {map(lessonsArray, (lesson, index) => {
          const slug = `${courseId}/lesson/${Number(sectionIndex + 1)}/chapter/${Number(index + 1)}`;
          return (
            <Link
              key={index}
              href={`/courses/${slug}`}
              _hover={{ textDecor: "none" }}
            >
              <Text
                bg={slug === current ? "whiteAlpha.200" : ""}
                color={slug === current ? "white" : "gray.300"}
                fontWeight={slug === current ? "semibold" : ""}
                px={8}
                py={2}
                _hover={{
                  bg: slug !== current && "whiteAlpha.100",
                  color: slug !== current && "white",
                }}
                isTruncated
              >
                {lesson.title.toString()}
              </Text>
            </Link>
          );
        })}
      </AccordionPanel>
    </AccordionItem>
  );
}

interface BottomNavbarProps {
  courseId: string;
  lessonId: string;
  chapterId: string;
  current: string;
  prev?: string;
  next?: string;
  sections: TypeSectionFields[];
}

function BottomNavbar({
  courseId,
  lessonId,
  chapterId,
  current,
  prev,
  next,
  sections,
}: BottomNavbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: session } = useSession();

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const progressData = useProgress();
  const saveProgress = useCallback(progressData.saveProgress, []);

  useEffect(() => {
    // TODO: Refactor this to a custom hook
    const syncProgress = async () => {
      if (session) {
        const pendingUpdates = JSON.parse(
          localStorage.getItem("pendingUpdates") || "[]",
        );
        pendingUpdates.forEach(
          (update: {
            courseId: string;
            lessonId: string;
            chapterId: string;
          }) => {
            saveProgress(update.courseId, update.lessonId, update.chapterId);
          },
        );
        localStorage.setItem("pendingUpdates", "[]");
      }
    };
    syncProgress();
  }, [session, saveProgress]);

  return (
    <Box
      position="fixed"
      w="100%"
      bottom={0}
      left={0}
      py={4}
      px={4}
      bg="gray.900"
      zIndex={1000}
    >
      <Flex justify="space-between" align="center">
        <IconButton
          aria-label="Open navigation drawer"
          icon={<HamburgerIcon />}
          onClick={handleDrawerOpen}
        />

        <Flex gap={2}>
          {prev ? (
            <Button
              as={Link}
              href={`/courses/${prev}`}
              variant="ghost"
              gap={2}
              _hover={{ textDecor: "none", color: "green.300" }}
            >
              <ChevronLeftIcon fontSize={24} />
              <Text display={["none", "block"]}>Back</Text>
            </Button>
          ) : (
            ""
          )}
          {next ? (
            <Button
              as={Link}
              onClick={() => {
                saveProgress(courseId, lessonId, chapterId);
              }}
              href={`/courses/${next}`}
              variant="ghost"
              gap={2}
              _hover={{ textDecor: "none", color: "green.300" }}
            >
              <Text display={["none", "block"]}>Next</Text>
              <ChevronRightIcon fontSize={24} />
            </Button>
          ) : (
            <Button
              as={Link}
              variant="solid"
              colorScheme="green"
              px={[4, 8]}
              mr={4}
              gap={2}
              href={`/courses/${courseId}/success`}
              onClick={() => {
                saveProgress(courseId, lessonId, chapterId);
              }}
              _hover={{ textDecor: "none" }}
            >
              <Text display={["none", "block"]}>Finish</Text>
              <CheckIcon fontSize={16} />
            </Button>
          )}
        </Flex>
      </Flex>

      <Drawer
        isOpen={isDrawerOpen}
        placement="left"
        onClose={handleDrawerClose}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Lessons</DrawerHeader>
            <DrawerBody
              px={0}
              sx={{
                "::-webkit-scrollbar": {
                  width: "1px",
                  borderRadius: "8px",
                },
                "::-webkit-scrollbar-thumb": {
                  width: "6px",
                  borderRadius: "8px",
                },
                ":hover::-webkit-scrollbar-thumb": { background: "white.700" },
              }}
            >
              <Accordion defaultIndex={[Number(lessonId) - 1]} allowMultiple>
                {map(sections, (section, index) => (
                  <Section
                    key={index}
                    courseId={courseId}
                    sectionIndex={index}
                    section={{ ...section }}
                    current={current}
                    isActive={index === Number(lessonId) - 1}
                  />
                ))}
              </Accordion>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
}

export default BottomNavbar;
