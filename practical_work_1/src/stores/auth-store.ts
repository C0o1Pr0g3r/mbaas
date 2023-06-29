import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { User, UserToLogin, UserToRegister } from "@/schemas/user";
import { UserService } from "@/services/auth-service";

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

  return { currentUser, isLoggedIn, register, login, logout, restorePassword };
});
