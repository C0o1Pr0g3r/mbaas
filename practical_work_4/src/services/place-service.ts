import type { File, Directory, UploadedFile } from "@/schemas/file-system";
import type { Place, PlaceToCreate } from "@/schemas/place";
import type { User } from "@/schemas/user";
import { useAuthStore } from "@/stores/auth-store";
import { v4 } from "uuid";
import Backendless from "backendless";

const IMAGE_DIRECTORY = "/place-images";

export class PlaceService {
  public static async getUserPlaces() {
    return (await Backendless.Data.of("Place").find()) as Place[];
  }

  public static async addPlace(
    latitude: number,
    longitude: number,
    description: string,
    hashtags: string,
    images: globalThis.File[],
  ) {
    const imageURLs = await PlaceService.uploadImages(images);
    const point = new Backendless.Data.Point();
    point.setLatitude(latitude);
    point.setLongitude(longitude);
    const place = {
      location: point,
      description,
      hashtags: hashtags,
      images: JSON.stringify(imageURLs),
    } as PlaceToCreate;

    const backendlessPlace = await Backendless.Data.of("Place").save(place);
  }

  public static async deletePlace(place: Place) {
    for (const image of place.images) {
      await PlaceService.removeImage(image.filePath);
    }
    await Backendless.Data.of("Place").remove(place);
  }

  private static async uploadImages(files: globalThis.File[]) {
    const fileURLs: UploadedFile[] = [];
    for (const file of files) {
      const newFile = new globalThis.File([await file.arrayBuffer()], v4());
      const uploadedFile = await Backendless.Files.upload(
        newFile,
        IMAGE_DIRECTORY,
        false,
      );
      fileURLs.push(uploadedFile as UploadedFile);
    }
    return fileURLs;
  }

  private static async removeImage(path: string) {
    await Backendless.Files.remove(path);
  }
}
