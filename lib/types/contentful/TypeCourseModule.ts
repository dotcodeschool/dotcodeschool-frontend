import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

import type { TypeAuthorSkeleton } from "./TypeAuthor";
import type { TypeOnMachineCourseSkeleton } from "./TypeOnMachineCourse";
import type { TypeSectionSkeleton } from "./TypeSection";

export interface TypeCourseModuleFields {
  title: EntryFieldTypes.Symbol;
  author: EntryFieldTypes.EntryLink<TypeAuthorSkeleton>;
  description: EntryFieldTypes.Text;
  level: EntryFieldTypes.Symbol<
    "Advanced" | "Beginner" | "Expert" | "Intermediate"
  >;
  language: EntryFieldTypes.Symbol<"Javascript" | "Rust" | "Typescript">;
  sections: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeSectionSkeleton>
  >;
  slug: EntryFieldTypes.Symbol;
  githubUrl: EntryFieldTypes.Symbol;
  format: EntryFieldTypes.Symbol<"inBrowserCourse" | "onMachineCourse">;
  formatData?: EntryFieldTypes.EntryLink<TypeOnMachineCourseSkeleton>;
}

export type TypeCourseModuleSkeleton = EntrySkeletonType<
  TypeCourseModuleFields,
  "courseModule"
>;
export type TypeCourseModule<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeCourseModuleSkeleton, Modifiers, Locales>;
