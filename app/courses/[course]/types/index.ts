import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { TypeSectionFields } from "@/lib/types/contentful";
import { TypeFile } from "@/lib/types/TypeFile";

export type Author = {
  name: string;
  url: string;
};

export type Module = {
  id: string;
  index: number;
  title: string;
  description: MDXRemoteSerializeResult;
  numOfLessons: number;
};

export interface ModuleProps {
  index: number;
  module: TypeSectionFields;
  slug: string;
  numOfCompletedLessons: number;
  isOnMachineCourse: boolean;
  hasEnrolled: boolean;
}

export interface CourseContentProps {
  slug: string;
  title: string;
  author: Author;
  description: string;
  modules: Module[];
  tags: { language: string; level: string };
}

export interface EditorContextType {
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  showDiff: boolean;
  setShowDiff: React.Dispatch<React.SetStateAction<boolean>>;
  editorContent: TypeFile[];
  setEditorContent: React.Dispatch<React.SetStateAction<TypeFile[]>>;
  toggleDiff: () => void;
}
