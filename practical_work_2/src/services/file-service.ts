import type { File, Directory } from "@/schemas/file-system";
import type { User } from "@/schemas/user";
import { useAuthStore } from "@/stores/auth-store";
import Backendless from "backendless";

const USER_DIRECTORIES = "/user-directories";
const TO_WORK_WITH_THE_FILE_SYSTEM_YOU_NEED_TO_LOG_IN =
  "To work with the file system you need to log in";

export class FileService {
  public static async createUserDirectoryIfItDoesntExist() {
    const userDirectory = FileService.getUserDirectory();
    if (!(await Backendless.Files.exists(userDirectory))) {
      await Backendless.Files.createDirectory(userDirectory);
    }
  }

  public static async getDirectoryContent(path: string) {
    const files = (await Backendless.Files.listing(
      `${FileService.getUserDirectory()}${[path]}`,
    )) as (File | Directory)[];
    return files;
  }
  public static async createDirectory(name: string) {
    const userDirectory = FileService.getUserDirectory();
    const directoryPath = `${userDirectory}/${name}`;
    if (!(await Backendless.Files.exists(directoryPath))) {
      await Backendless.Files.createDirectory(directoryPath);
    } else {
      throw new Error(`Directory named '${name}' already exists`);
    }
  }

  public static async uploadFile(path: string, file: globalThis.File) {
    const actualPath = `${FileService.getUserDirectory()}${path}/${file.name}`;
    const fileURL = await Backendless.Files.upload(file, actualPath, false);
  }

  public static async deleteFile(path: string) {
    const actualPath = `${FileService.getUserDirectory()}${path}`;
    await Backendless.Files.remove(actualPath);
  }

  public static async deleteDirectory(path: string) {
    const actualPath = `${FileService.getUserDirectory()}${path}`;
    await Backendless.Files.removeDirectory(actualPath);
  }

  public static async rename(oldPath: string, newName: string) {
    const actualOldPath = `${FileService.getUserDirectory()}${oldPath}`;
    await Backendless.Files.renameFile(actualOldPath, newName);
  }

  private static getUserDirectory() {
    const user = useAuthStore().currentUser.value;
    if (user) {
      return `${USER_DIRECTORIES}/${user.login}`;
    }
    throw new Error(TO_WORK_WITH_THE_FILE_SYSTEM_YOU_NEED_TO_LOG_IN);
  }
}
