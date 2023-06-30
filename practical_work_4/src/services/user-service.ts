import Backendless from "backendless";
import type { User, UserToLogin, UserToRegister } from "@/schemas/user";
import { eventLog } from "@/event-log";
import { useAuthStore } from "@/stores/auth-store";

export class UserService {
  public static async register(userToRegister: UserToRegister) {
    const user2 = userToRegister as User;
    user2.friendRequests = [];
    user2.friends = [];
    user2.isOnlineNow = true;
    const user = (await Backendless.UserService.register(user2)) as User;
    eventLog.emit("user-registered", user);
    UserService.fixDateOfBirth(user);
    return user;
  }

  public static async login(userToLogin: UserToLogin) {
    const user = (await Backendless.UserService.login(
      userToLogin.email,
      userToLogin.password,
    )) as User;
    user.isOnlineNow = true;
    const newUser = await UserService.update(user);
    return newUser;
  }

  public static async logout() {
    const user = useAuthStore().currentUser.value;
    if (user) {
      user.isOnlineNow = false;
      await UserService.update(user);
    }
    await Backendless.UserService.logout();
  }

  public static async restorePassword(email: Required<User>["email"]) {
    await Backendless.UserService.restorePassword(email);
  }

  public static async update(user: User) {
    const newUser = (await Backendless.UserService.update(user)) as User;
    UserService.fixDateOfBirth(newUser);
    return newUser;
  }

  public static async getNumberOfRegisteredUsers() {
    return await Backendless.Data.of("Users").getObjectCount();
  }

  public static async getNumberOfOnlineUsers() {
    return await Backendless.Data.of("Users").getObjectCount(
      Backendless.DataQueryBuilder.create().setWhereClause(
        "isOnlineNow = true",
      ),
    );
  }

  public static async setUserOnlineStatus(user: User, status: boolean) {
    user.isOnlineNow = status;
    const newUser = await Backendless.Data.of("Users").save(user);
    UserService.fixDateOfBirth(newUser);
    return newUser;
  }

  private static fixDateOfBirth(user: User) {
    user.dateOfBirth = new Date(user.dateOfBirth);
  }
}
