<template>
  <BaseForm ref="form" class="form registration-or-login-form">
    <div class="fields">
      <UserAvatar
        :avatar-url="tempAvatar ?? user.avatar"
        @click="tryToSetAvatar"
        :class="{ avatar: true, 'editable-avatar': mode === Mode.EDIT }"
      />
      <label for="login">Login</label>
      <span v-if="mode === Mode.VIEW">{{ user.login }}</span>
      <input v-else v-model="user.login" type="text" id="login" required />
      <label for="gender">Gender</label>
      <span v-if="mode === Mode.VIEW">{{ user.gender }}</span>
      <select v-else v-model="user.gender" id="gender" required>
        <option
          v-for="gender in GENDERS"
          :key="gender"
          :value="gender"
          :label="gender"
        ></option>
      </select>
      <label for="country">Country</label>
      <span v-if="mode === Mode.VIEW">{{ user.country }}</span>
      <select v-else v-model="user.country" id="country" required>
        <option
          v-for="country in COUNTRIES"
          :key="country"
          :value="country"
          :label="country"
        ></option>
      </select>
    </div>
    <div v-if="mode === Mode.VIEW" class="control-panel">
      <button @click="startEditing">Edit</button>
    </div>
    <div v-else class="control-panel">
      <button @click="updatePublicData">Save</button>
      <button @click="cancelEditing">Cancel</button>
    </div>
    <BaseError :error="error?.message" />
  </BaseForm>
  <ModalWindow
    :opened="fileExplorerWindowOpened"
    @close="fileExplorerWindowOpened = false"
  >
    <template v-slot:header>
      <h3>Avatar selection</h3>
    </template>
    <template v-slot:body>
      <FileExplorer @dblclick="setAvatar" />
    </template>
  </ModalWindow>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseForm from "@/components/BaseForm.vue";
import BaseError from "@/components/BaseError.vue";
import ModalWindow from "@/components/ModalWindow.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import FileExplorer from "@/components/file-explorer/FileExplorer.vue";
import { GENDERS } from "@/schemas/gender";
import { COUNTRIES } from "@/schemas/country";
import type { PublicUserData } from "@/schemas/user";
import { useAuthStore } from "@/stores/auth-store";
import type { BackendlessError } from "@/schemas/error";

enum Mode {
  VIEW = "VIEW",
  EDIT = "EDIT",
}

const router = useRouter();

const mode = ref(Mode.VIEW);
const form = ref<typeof BaseForm>();
const user = ref<PublicUserData>(getStoredPublicUserData());
const error = ref<BackendlessError | null>();
const fileExplorerWindowOpened = ref(false);
const tempAvatar = ref<string | null>(null);

function getStoredPublicUserData() {
  return {
    login: useAuthStore().currentUser.value?.login,
    dateOfBirth: useAuthStore().currentUser.value?.dateOfBirth,
    gender: useAuthStore().currentUser.value?.gender,
    country: useAuthStore().currentUser.value?.country,
    avatar: useAuthStore().currentUser.value?.avatar,
  } as PublicUserData;
}

function startEditing() {
  mode.value = Mode.EDIT;
}

function cancelEditing() {
  mode.value = Mode.VIEW;
  user.value = getStoredPublicUserData();
  tempAvatar.value = null;
}

function tryToSetAvatar() {
  if (mode.value === Mode.VIEW) {
    return;
  }

  fileExplorerWindowOpened.value = true;
}

function setAvatar(filePath: string, publicUrl: string) {
  console.log(filePath);
  tempAvatar.value = publicUrl;
  fileExplorerWindowOpened.value = false;
}

async function updatePublicData() {
  if (!form.value?.checkValidity()) {
    return;
  }

  if (tempAvatar.value) {
    user.value.avatar = tempAvatar.value;
  }

  try {
    await useAuthStore().updatePublicData(user.value);
    cancelEditing();
  } catch (err) {
    error.value = err as BackendlessError;
  }
}
</script>

<style lang="scss" scoped>
@import "@/stylesheets/registration-and-login-form.scss";

.avatar {
  grid-column: 1 / 3;
  width: 256px;
  height: 256px;
}

.editable-avatar {
  cursor: pointer;
}
</style>
