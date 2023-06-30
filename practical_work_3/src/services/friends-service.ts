import type { File, Directory } from "@/schemas/file-system";
import type { User } from "@/schemas/user";
import { useAuthStore } from "@/stores/auth-store";
import Backendless from "backendless";

const USER_DIRECTORIES = "/user-directories";
const ERROR_MESSAGE =
  "To use the service of friends, you need to be an authorized user";

export class FriendsService {
  public static async findUsersByLoginPart(loginPart: string) {
    const users = (await Backendless.Data.of("Users").find(
      Backendless.DataQueryBuilder.create().setWhereClause(
        `login LIKE '%${loginPart}%'`,
      ),
    )) as User[];
    console.log("users:", users);
    return users;
  }

  public static async sendFriendRequest(user: User) {
    const currentUser = useAuthStore().currentUser.value;
    if (!currentUser) {
      throw Error(ERROR_MESSAGE);
    }
    user.friendRequests.push(currentUser.login);
    return await Backendless.Data.of("Users").save(user);
  }

  public static async acceptFriendRequest(user: User) {
    const currentUser = useAuthStore().currentUser.value;
    if (!currentUser) {
      throw Error(ERROR_MESSAGE);
    }
    currentUser.friends.push(user.login);
    user.friends.push(currentUser.login);
    currentUser.friendRequests.splice(
      currentUser.friendRequests.indexOf(user.login),
      1,
    );
    await useAuthStore().update(currentUser);
    return await Backendless.Data.of("Users").save(user);
  }

  public static async declineFriendRequest(user: User) {
    const currentUser = useAuthStore().currentUser.value;
    if (!currentUser) {
      throw Error(ERROR_MESSAGE);
    }
    currentUser.friendRequests.splice(
      currentUser.friendRequests.indexOf(user.login),
      1,
    );
    await useAuthStore().update(currentUser);
  }

  public static async removeFromFriends(user: User) {
    const currentUser = useAuthStore().currentUser.value;
    if (!currentUser) {
      throw Error(ERROR_MESSAGE);
    }
    currentUser.friends.splice(currentUser.friends.indexOf(user.login), 1);
    user.friends.splice(user.friends.indexOf(currentUser.login), 1);
    await useAuthStore().update(currentUser);
    return await Backendless.Data.of("Users").save(user);
  }
}
