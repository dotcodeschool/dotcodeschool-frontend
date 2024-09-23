import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

import type { TypeFilesSkeleton } from "./TypeFiles";

export interface TypeLessonFields {
  title: EntryFieldTypes.Symbol;
  content: EntryFieldTypes.Text;
  files?: EntryFieldTypes.EntryLink<TypeFilesSkeleton>;
  slug?: EntryFieldTypes.Symbol;
}

export type TypeLessonSkeleton = EntrySkeletonType<TypeLessonFields, "lesson">;
export type TypeLesson<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeLessonSkeleton, Modifiers, Locales>;
