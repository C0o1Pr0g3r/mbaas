import Backendless from "backendless";
import type { UploadedFile } from "./file-system";

export type PlaceToCreate = {
  location: Backendless.Data.Point;
  description: string;
  hashtags: string;
  images: string;
};

export type Place = {
  location: Backendless.Data.Point;
  description: string;
  hashtags: string[];
  images: UploadedFile[];
};
