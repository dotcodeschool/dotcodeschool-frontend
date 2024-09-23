"use client";

import { Box, Flex } from "@chakra-ui/react";
import { find, reduce } from "lodash";
import dynamic from "next/dynamic";
import { createContext, useContext, useState } from "react";
import stripComments from "strip-comments";

import { TypeFile } from "@/lib/types/TypeFile";

import EditorTabs from "./editor-tabs";
import FullscreenEditorModal from "./fullscreen-editor-modal";

const SplitPane = dynamic(() => import("react-split-pane"), { ssr: false });

const EditorContext = createContext<EditorContextType | null>(null);

interface EditorProviderProps {
  children: React.ReactNode;
  initialContent: TypeFile[];
  initialTabIndex?: number;
  initialShowDiff?: boolean;
  initialDoesAnswerMatch?: boolean;
  initialIsAnswerOpen?: boolean;
  solution: TypeFile[];
}

interface EditorContextType {
  compareAnswerAndUpdateState: () => void;
  doesAnswerMatch: boolean;
  incorrectFiles: TypeFile[];
  isAnswerOpen: boolean;
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  solution: TypeFile[];
  showDiff: boolean;
  setShowDiff: React.Dispatch<React.SetStateAction<boolean>>;
  editorContent: TypeFile[];
  setEditorContent: React.Dispatch<React.SetStateAction<TypeFile[]>>;
  toggleAnswer: () => void;
  toggleDiff: () => void;
}

export function EditorProvider({
  children,
  initialContent,
  initialTabIndex = 0,
  initialShowDiff = false,
  initialDoesAnswerMatch = false,
  initialIsAnswerOpen = false,
  solution,
}: EditorProviderProps) {
  const [tabIndex, setTabIndex] = useState(initialTabIndex);
  const [showDiff, setShowDiff] = useState(initialShowDiff);
  const [doesAnswerMatch, setDoesAnswerMatch] = useState(
    initialDoesAnswerMatch,
  );
  const [isAnswerOpen, setIsAnswerOpen] = useState(initialIsAnswerOpen);
  const [incorrectFiles, setIncorrectFiles] = useState<TypeFile[]>([]);
  const [editorContent, setEditorContent] =
    useState<TypeFile[]>(initialContent);

  const toggleAnswer = () => {
    setIsAnswerOpen((prevIsAnswerOpen) => !prevIsAnswerOpen);
  };

  const toggleDiff = () => {
    setShowDiff((prevShowDiff) => {
      const newShowDiff = !prevShowDiff;

      if (newShowDiff) {
        const diffIndex = editorContent.length - 1;
        if (diffIndex !== -1) {
          setTabIndex(diffIndex);
        }
      } else if (tabIndex === editorContent.length - 1) {
        const lastNonDiffIndex = editorContent.length - 2;
        if (lastNonDiffIndex !== -1) {
          setTabIndex(lastNonDiffIndex);
        }
      }

      return newShowDiff;
    });
  };

  const compareAnswerAndUpdateState = () => {
    const doesAnswerMatch = reduce(
      editorContent,
      (acc, file) => {
        const solutionFile = find(
          solution,
          (solutionFile: TypeFile) => solutionFile.fileName === file.fileName,
        );

        if (!solutionFile) {
          return true && acc;
        }
        const solutionCodeWithoutComments = stripComments(solutionFile.code);
        const solutionCodeWithoutCommentsAndWhitespace =
          solutionCodeWithoutComments.replace(/\s/g, "");
        const fileCodeWithoutComments = stripComments(file.code);
        const fileCodeWithoutCommentsAndWhitespace =
          fileCodeWithoutComments.replace(/\s/g, "");
        const doFilesMatch =
          solutionCodeWithoutCommentsAndWhitespace ===
          fileCodeWithoutCommentsAndWhitespace;
        if (!doFilesMatch) {
          setIncorrectFiles((prevIncorrectFiles) => [
            ...prevIncorrectFiles,
            file,
          ]);
        } else {
          setIncorrectFiles((prevIncorrectFiles) =>
            prevIncorrectFiles.filter(
              (incorrectFile) => incorrectFile.fileName !== file.fileName,
            ),
          );
        }
        return doFilesMatch && acc;
      },
      true,
    );
    setDoesAnswerMatch(doesAnswerMatch);
  };

  const value: EditorContextType = {
    compareAnswerAndUpdateState,
    doesAnswerMatch,
    incorrectFiles,
    isAnswerOpen,
    tabIndex,
    setTabIndex,
    solution,
    showDiff,
    setShowDiff,
    editorContent,
    setEditorContent,
    toggleAnswer,
    toggleDiff,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (context === null) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};

export function EditorComponents({
  showHints,
  readOnly,
  solution,
  editorContent,
  mdxContent,
}: {
  showHints: boolean;
  readOnly?: boolean;
  solution: TypeFile[];
  editorContent: TypeFile[];
  mdxContent?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);

  const onClose = () => setIsOpen(false);

  const handleFullscreenToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  const editorProps = {
    showHints,
    readOnly,
    editorContent,
    isOpen,
    handleFullscreenToggle,
  };

  return (
    <Box
      as={SplitPane}
      split="vertical"
      defaultSize={mdxContent ? "50%" : "100%"}
      minSize={200}
      maxSize={-200}
    >
      {mdxContent && (
        <Box
          key={1}
          h={["fit-content", "calc(100vh - 140px)"]}
          overflowY="auto"
          pt={6}
          px={[6, 12]}
          mr={1}
          sx={{
            overflowX: "auto",
            height: "100%",
            "::-webkit-scrollbar": {
              width: "2px",
            },
            ":hover::-webkit-scrollbar-thumb": { background: "whiteAlpha.300" },
          }}
        >
          {mdxContent}
        </Box>
      )}
      <Flex
        height="calc(100vh - 129px)"
        w="full"
        key={2}
        px={{ base: 4, md: 0 }}
      >
        <EditorProvider initialContent={editorContent} solution={solution}>
          <EditorTabs {...editorProps} />
          <FullscreenEditorModal
            isOpen={isOpen}
            onClose={onClose}
            editorProps={editorProps}
          />
        </EditorProvider>
      </Flex>
    </Box>
  );
}
