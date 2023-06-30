import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type {
  User,
  PublicUserData,
  UserToLogin,
  UserToRegister,
} from "@/schemas/user";
import { UserService } from "@/services/user-service";

export const useAuthStore = defineStore("auth", () => {
  const authorizedUser = ref<User | null>();

  const currentUser = computed(() => authorizedUser);
  const isLoggedIn = computed(() => Boolean(authorizedUser.value));

  async function register(userToRegister: UserToRegister) {
    authorizedUser.value = await UserService.register(userToRegister);
  }

  async function login(userToLogin: UserToLogin) {
    authorizedUser.value = await UserService.login(userToLogin);
  }

  async function logout() {
    await UserService.logout();
    authorizedUser.value = null;
  }

  async function restorePassword(email: Required<User>["email"]) {
    await UserService.restorePassword(email);
  }

  async function updatePublicData(userPublicData: PublicUserData) {
    const user = authorizedUser.value;
    if (user) {
      for (const key of Object.keys(userPublicData)) {
        user[key] = userPublicData[key];
      }
      authorizedUser.value = await UserService.update(user);
    }
  }

  async function update(user: User) {
    authorizedUser.value = await UserService.update(user);
  }

  return {
    currentUser,
    isLoggedIn,
    register,
    login,
    logout,
    restorePassword,
    updatePublicData,
    update,
  };
});
