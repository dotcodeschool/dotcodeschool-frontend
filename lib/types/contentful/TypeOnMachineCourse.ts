import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeOnMachineCourseFields {
  gitRepoTemplate: EntryFieldTypes.Symbol;
}

export type TypeOnMachineCourseSkeleton = EntrySkeletonType<
  TypeOnMachineCourseFields,
  "onMachineCourse"
>;
export type TypeOnMachineCourse<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeOnMachineCourseSkeleton, Modifiers, Locales>;
