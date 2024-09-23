import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeFilesFields {
  title: EntryFieldTypes.Symbol;
  source?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
  template?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
  solution?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
}

export type TypeFilesSkeleton = EntrySkeletonType<TypeFilesFields, "files">;
export type TypeFiles<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeFilesSkeleton, Modifiers, Locales>;
