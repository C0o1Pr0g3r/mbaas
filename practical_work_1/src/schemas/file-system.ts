export type File = {
  createdOn: number;
  name: string;
  publicUrl: string;
  size: number;
  updatedOn: number;
  url: string;
};

export type Directory = Omit<File, "size">;

export enum FileType {
  FILE = "FILE",
  DIRECTORY = "DIRECTORY",
}
