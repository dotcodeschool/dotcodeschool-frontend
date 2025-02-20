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
  Progress,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
} from "@chakra-ui/icons";
import { MdCode, MdNumbers } from "react-icons/md";
import { useCallback, useEffect, useMemo, useState } from "react";
import { map } from "lodash";
import axios from "axios";
import { useSession } from "next-auth/react";
import ProgressBar from "@/components/lessons-interface/progress-bar";

interface SectionProps {
  courseId: string;
  section: {
    sectionIndex: number;
    title: string;
    lessons: any[];
  };
  current: string;
  isActive: boolean;
}

const Section = ({
  courseId,
  section: { sectionIndex, title, lessons },
  current,
  isActive,
}: SectionProps) => {
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
        <Tooltip label={title} aria-label={title} openDelay={750} hasArrow>
          <Text textAlign="left" flex={1} pl={2} isTruncated>
            {title}
          </Text>
        </Tooltip>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel px={0}>
        {map(lessons, (chapter, index) => {
          const slug = `${courseId}/lesson/${Number(sectionIndex + 1)}/chapter/${Number(index + 1)}`;
          return (
            <Link
              key={chapter.id}
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
                {chapter.title}
              </Text>
            </Link>
          );
        })}
      </AccordionPanel>
    </AccordionItem>
  );
};

interface BottomNavbarProps {
  doesMatch?: boolean;
  isOpen: boolean;
  courseId: string;
  lessonId: string;
  chapterId: string;
  current: string;
  prev?: string;
  next?: string;
  sections: any[];
  toggleAnswer?: () => void;
}

const BottomNavbar = ({
  doesMatch,
  isOpen,
  courseId,
  lessonId,
  chapterId,
  current,
  prev,
  next,
  sections,
  toggleAnswer,
}: BottomNavbarProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: session } = useSession();

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const progress = useMemo(() => {
    const chapterIdNumber = Number(chapterId);
    if (isOpen) {
      return chapterIdNumber;
    }
    return chapterIdNumber - 1;
  }, [isOpen, chapterId]);

  // TODO: Refactor this to a custom hook
  const saveProgress = useCallback(
    async (courseId: string, lessonId: string, chapterId: string) => {
      // Load the progress from local storage
      const localProgress: any = localStorage.getItem("progress");

      // Load the progress from the database
      const savedProgress = session
        ? await axios
            .get("/api/get-progress", {
              params: { user: session?.user },
            })
            .then((res) => {
              return res.data.progress;
            })
            .catch((err) => {
              console.error(err);
            })
        : null;

      // Merge the progress from local storage and the database
      const progress = JSON.parse(
        savedProgress ? savedProgress : localProgress || "{}",
      );

      // Update the progress
      if (!progress[courseId]) {
        progress[courseId] = {};
      }
      if (!progress[courseId][lessonId]) {
        progress[courseId][lessonId] = {};
      }
      progress[courseId][lessonId][chapterId] = true;

      // Save the progress back to local storage
      localStorage.setItem("progress", JSON.stringify(progress));

      // Save the progress to the database
      if (session) {
        axios
          .post("/api/update-progress", {
            updates: [{ user: session?.user, progress }],
          })
          .catch((err) => {
            console.error(err);
            const pendingUpdates = JSON.parse(
              localStorage.getItem("pendingUpdates") || "[]",
            );
            pendingUpdates.push({ courseId, lessonId, chapterId });
            localStorage.setItem(
              "pendingUpdates",
              JSON.stringify(pendingUpdates),
            );
          });
      } else {
        const pendingUpdates = JSON.parse(
          localStorage.getItem("pendingUpdates") || "[]",
        );
        pendingUpdates.push({ courseId, lessonId, chapterId });
        localStorage.setItem("pendingUpdates", JSON.stringify(pendingUpdates));
      }
    },
    [session],
  );

  useEffect(() => {
    const syncProgress = () => {
      if (session) {
        const pendingUpdates = JSON.parse(
          localStorage.getItem("pendingUpdates") || "[]",
        );
        pendingUpdates.forEach((update: any) => {
          saveProgress(update.courseId, update.lessonId, update.chapterId);
        });
        localStorage.setItem("pendingUpdates", "[]");
      }
    };
    syncProgress();
  }, [session, saveProgress]);
  return (
    <>
      <Progress value={progress} max={sections.length} colorScheme="green" />;
      <Box
        position="fixed"
        w="100%"
        bottom={0}
        left={0}
        py={4}
        px={4}
        bg="gray.900"
      >
        <Flex justify="space-between" align="center">
          <IconButton
            aria-label="Open navigation drawer"
            icon={<HamburgerIcon />}
            onClick={handleDrawerOpen}
          />

          <Flex gap={2}>
            {toggleAnswer &&
              (doesMatch ? (
                <Button
                  variant="ghost"
                  colorScheme="green"
                  cursor="default"
                  _hover={{ bg: "none" }}
                >
                  <CheckIcon fontSize={16} mr={2} />
                  Correct
                </Button>
              ) : (
                <Button variant="outline" onClick={toggleAnswer}>
                  {isOpen ? "Hide" : "Show"} Answer
                </Button>
              ))}
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
                href={`/courses/${courseId}/lesson/${lessonId}/success`}
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
                  ":hover::-webkit-scrollbar-thumb": {
                    background: "white.700",
                  },
                }}
              >
                <Accordion defaultIndex={[Number(lessonId) - 1]} allowMultiple>
                  {map(sections, (section, sectionIndex) => (
                    <Section
                      key={sectionIndex}
                      courseId={courseId}
                      section={{ ...section, sectionIndex }}
                      current={current}
                      isActive={sectionIndex === Number(lessonId) - 1}
                    />
                  ))}
                </Accordion>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </Box>
    </>
  );
};

export default BottomNavbar;
