<template>
  <div class="layout">
    <MainMenu v-if="route.path != '/register' && route.path != '/login'" />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import MainMenu from "@/components/MainMenu.vue";
import { eventLog } from "@/event-log";
import { FileService } from "./services/file-service";
import { useAuthStore } from "./stores/auth-store";

const route = useRoute();

eventLog.on("user-registered", FileService.createUserDirectoryIfItDoesntExist);

window.onunload = () => {
  useAuthStore().logout();
};
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  align-items: stretch;
  height: 100%;
}
</style>
