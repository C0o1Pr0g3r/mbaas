import Backendless from "backendless";
import type { User, UserToLogin, UserToRegister } from "@/schemas/user";
import { eventLog } from "@/event-log";

export class UserService {
  public static async register(userToRegister: UserToRegister) {
    const user = (await Backendless.UserService.register(
      userToRegister,
    )) as User;
    eventLog.emit("user-registered", user);
    return user;
  }

  public static async login(userToLogin: UserToLogin) {
    return (await Backendless.UserService.login(
      userToLogin.email,
      userToLogin.password,
    )) as User;
  }

  public static async logout() {
    await Backendless.UserService.logout();
  }

  public static async restorePassword(email: Required<User>["email"]) {
    await Backendless.UserService.restorePassword(email);
  }

  public static async update(user: User) {
    return (await Backendless.UserService.update(user)) as User;
  }
}
