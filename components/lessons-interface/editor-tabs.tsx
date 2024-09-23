import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Flex,
  Tooltip,
  CloseButton,
  Text,
  Button,
  Icon,
  useToast,
  HStack,
} from "@chakra-ui/react";
import { DiffEditor, Editor } from "@monaco-editor/react";
import { map, find, matches, endsWith, isEmpty } from "lodash";
import React, { useCallback, useEffect, useRef } from "react";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import {
  IoCheckmarkDone,
  IoEyeOffOutline,
  IoGitCompareOutline,
} from "react-icons/io5";
import { MdCompareArrows } from "react-icons/md";
import stripComments from "strip-comments";

import { useEditor } from "./EditorComponents";

export interface EditorTabsProps {
  showHints: boolean;
  readOnly?: boolean;
  isOpen: boolean;
  handleFullscreenToggle: (e: React.MouseEvent) => void;
}

function EditorTabs({
  showHints,
  readOnly,
  isOpen,
  handleFullscreenToggle,
}: EditorTabsProps) {
  const {
    compareAnswerAndUpdateState,
    doesAnswerMatch,
    incorrectFiles,
    isAnswerOpen,
    tabIndex,
    setTabIndex,
    solution,
    editorContent,
    setEditorContent,
    showDiff,
    toggleAnswer,
    toggleDiff,
  } = useEditor();
  const isUserInteraction = useRef(false);

  const toast = useToast();

  const handleTabsChange = useCallback(
    (index: number) => {
      if (isUserInteraction.current) {
        setTabIndex(index);
      }
      isUserInteraction.current = false;
    },
    [setTabIndex],
  );

  const handleTabClick = useCallback(() => {
    isUserInteraction.current = true;
  }, []);

  useEffect(() => {
    if (isAnswerOpen) {
      toast.closeAll();
      if (doesAnswerMatch) {
        toast({
          title: "Your solution matches ours",
          description:
            "Great job! Your solution matches ours. You can now move on to the next step.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Your solution doesn't match ours",
          description:
            "This doesn't mean you're wrong! We just might have different ways of solving the problem.",
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }, [doesAnswerMatch, isAnswerOpen, toast]);

  return (
    <Tabs
      index={tabIndex}
      onChange={(e) => {
        return handleTabsChange(e);
      }}
      variant="unstyled"
      h={
        readOnly
          ? "100vh"
          : isOpen
            ? "calc(100vh - 96px)"
            : "calc(100vh - 225px)"
      }
      bg="#2e2e2e"
      w="full"
    >
      <TabList>
        <Flex
          position="relative"
          w="full"
          sx={{
            overflowX: "auto",
            height: "100%",
            "::-webkit-scrollbar": {
              height: "2px",
            },
            ":hover::-webkit-scrollbar-thumb": {
              background: "whiteAlpha.300",
            },
          }}
        >
          {isEmpty(editorContent) ? (
            <Text m={4}>No files edited in this step.</Text>
          ) : (
            map(editorContent, (file, i) => {
              const incorrectColor = find(
                incorrectFiles,
                matches({ fileName: file.fileName }),
              )
                ? "red.300"
                : null;
              return (
                <Tab
                  key={i}
                  as={
                    showDiff && endsWith(file.fileName, ".diff")
                      ? "i"
                      : undefined
                  }
                  display={
                    !showDiff && endsWith(file.fileName, ".diff")
                      ? "none"
                      : "block"
                  }
                  borderRight="1px solid"
                  borderRightColor="#111111"
                  color={incorrectColor ? incorrectColor : "whiteAlpha.600"}
                  onClick={() => {
                    handleTabClick();
                  }}
                  _hover={{ bg: "whiteAlpha.300" }}
                  _selected={{
                    bg: "whiteAlpha.100",
                    color: incorrectColor ? incorrectColor : "orange.200",
                    borderBottom: "1px solid",
                    borderColor: incorrectColor ? incorrectColor : "orange.200",
                    borderRightColor: "#111111",
                  }}
                >
                  {file.fileName}
                  {showDiff && endsWith(file.fileName, ".diff") && (
                    <>
                      &nbsp;(Prev. Changes)
                      <CloseButton
                        display={"inline"}
                        size="sm"
                        p={0}
                        verticalAlign="middle"
                        h="fit-content"
                        bg="transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          isUserInteraction.current = true;
                          toggleDiff();
                        }}
                      />
                    </>
                  )}
                </Tab>
              );
            })
          )}
        </Flex>
        <Flex
          alignItems="center"
          px={2}
          display={isEmpty(editorContent) ? "none" : "flex"}
        >
          <Tooltip
            hasArrow
            maxW={32}
            label={showDiff ? "Hide Changes" : "Open Changes"}
            textAlign="center"
          >
            <IconButton
              size="sm"
              bg="none"
              p={0}
              aria-label={showDiff ? "Hide Changes" : "Open Changes"}
              icon={<IoGitCompareOutline size={18} />}
              onClick={() => {
                isUserInteraction.current = showDiff;
                toggleDiff();
              }}
            />
          </Tooltip>
          <Tooltip
            hasArrow
            maxW={32}
            label={
              isOpen
                ? "Exit Fullscreen Code Editor"
                : "Enter Fullscreen Code Editor"
            }
            textAlign="center"
          >
            <IconButton
              size="sm"
              bg="none"
              p={0}
              aria-label={
                isOpen
                  ? "Exit Fullscreen Code Editor"
                  : "Enter Fullscreen Code Editor"
              }
              icon={
                isOpen ? <FiMinimize2 size={18} /> : <FiMaximize2 size={18} />
              }
              onClick={handleFullscreenToggle}
            />
          </Tooltip>
        </Flex>
      </TabList>
      <TabPanels h="full">
        {map(editorContent, (file, i) => {
          const userCodeWithoutComments = showHints
            ? stripComments(editorContent[i]?.code)
            : "";
          const solutionWithoutComments = showHints
            ? stripComments(
                find(
                  solution,
                  ({ fileName }) => fileName === editorContent[i].fileName,
                )?.code ??
                  editorContent[i]?.code ??
                  "",
              )
            : "";
          return (
            <TabPanel key={i} h="full" p={0} pb={0}>
              <Editor
                key={i + file.fileName}
                height={isAnswerOpen ? "0%" : "100%"}
                theme="vs-dark"
                defaultLanguage={file.language || "rust"}
                defaultValue={file.code || "// placeholder"}
                options={{ readOnly: readOnly || file.language === "diff" }}
                value={file.code}
                onChange={(value) => {
                  const newEditorContent = [...editorContent];
                  newEditorContent[i].code = value?.toString() || "";
                  setEditorContent(newEditorContent);
                }}
              />
              {isAnswerOpen && (
                <DiffEditor
                  height="100%"
                  theme="vs-dark"
                  original={userCodeWithoutComments}
                  modified={solutionWithoutComments}
                  options={{ readOnly: true }}
                />
              )}
              {showHints && (
                <HStack p={2} w="full" bg="#2e2e2e" alignItems="center">
                  <Button
                    variant="outline"
                    leftIcon={
                      <Icon
                        as={isAnswerOpen ? IoEyeOffOutline : MdCompareArrows}
                      />
                    }
                    onClick={() => {
                      isUserInteraction.current = true;
                      compareAnswerAndUpdateState();
                      toggleAnswer();
                    }}
                  >
                    {isAnswerOpen ? "Hide" : "Compare"} Answer
                  </Button>
                  {doesAnswerMatch && isAnswerOpen && (
                    <HStack>
                      <Icon as={IoCheckmarkDone} color="green.300" />
                      <Text color="green.300">Your solution matches ours</Text>
                    </HStack>
                  )}
                </HStack>
              )}
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
}

export default React.memo(EditorTabs);
