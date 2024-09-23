export type TypeFile = {
  fileName: string;
  code: string;
  language: string;
};

export interface IFiles {
  source: TypeFile[];
  template: TypeFile[];
  solution: TypeFile[];
}
