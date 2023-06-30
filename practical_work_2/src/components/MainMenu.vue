<template>
  <nav class="main-menu">
    <div class="main-menu__part">
      <RouterLink to="/" class="main-menu__item">Home</RouterLink>
      <RouterLink to="/file-explorer" class="main-menu__item"
        >File Explorer</RouterLink
      >
      <RouterLink to="/my-profile" class="main-menu__item"
        >My Profile</RouterLink
      >
      <RouterLink to="/my-places" class="main-menu__item">My Places</RouterLink>
    </div>
    <div class="main-menu__part">
      <RouterLink
        v-if="!useAuthStore().isLoggedIn"
        to="/register"
        class="main-menu__item"
        >Register</RouterLink
      >
      <RouterLink
        v-if="!useAuthStore().isLoggedIn"
        to="/login"
        class="main-menu__item"
        >Login</RouterLink
      >
      <span
        v-if="useAuthStore().isLoggedIn"
        @click="logout"
        class="main-menu__item"
        >Logout</span
      >
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";

const router = useRouter();

async function logout() {
  await useAuthStore().logout();
  await router.push("/");
}
</script>

<style lang="scss" scoped>
@import "@/stylesheets/shared.scss";

.main-menu {
  background-color: #369bb4;
  font-size: 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: $step * 3;
}

.main-menu__part {
  display: flex;
  flex-direction: column;
}

.main-menu__item {
  text-decoration: none;
  color: white;
  cursor: pointer;
}
</style>
