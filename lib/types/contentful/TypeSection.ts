import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

import type { TypeLessonSkeleton } from "./TypeLesson";

export interface TypeSectionFields {
  title: EntryFieldTypes.Symbol;
  description: EntryFieldTypes.Text;
  lessons: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeLessonSkeleton>>;
}

export type TypeSectionSkeleton = EntrySkeletonType<
  TypeSectionFields,
  "section"
>;
export type TypeSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeSectionSkeleton, Modifiers, Locales>;
