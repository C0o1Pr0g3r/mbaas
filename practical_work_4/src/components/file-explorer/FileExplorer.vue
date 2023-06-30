<template>
  <div class="file-explorer">
    <div class="path">{{ path }}</div>
    <div class="control-panel">
      <button @click="directoryCreationWindowOpened = true">
        Create directory
      </button>
      <button @click="fileInput?.click()">Upload file</button>
    </div>
    <div class="directory-content">
      <span>Name</span>
      <span>Created</span>
      <span>Updated</span>
      <span>Size</span>
      <span></span>
      <span></span>
      <span></span>
      <span
        v-if="path !== '/'"
        @click="goToParentDirectory"
        style="cursor: pointer"
        >..</span
      >
      <span v-if="path !== '/'"></span>
      <span v-if="path !== '/'"></span>
      <span v-if="path !== '/'"></span>
      <span v-if="path !== '/'"></span>
      <span v-if="path !== '/'"></span>
      <span v-if="path !== '/'"></span>
      <FileSystemItem
        v-for="file in files"
        :key="file.publicUrl"
        :file="file"
        @click="
          () => {
            if (!('size' in file)) {
              goToDirectory(file.name);
            }
          }
        "
        @delete="
          () => {
            if ('size' in file) {
              deleteFile(file.name);
            } else {
              deleteDirectory(file.name);
            }
          }
        "
        @rename="
          startRenaming(
            file.name,
            'size' in file ? FileType.FILE : FileType.DIRECTORY,
          )
        "
        @dblclick="
          () => {
            if ('size' in file) {
              emit('dblclick', `${path}${file.name}`, file.publicUrl);
            }
          }
        "
        class="file"
      />
    </div>
    <input
      @change="uploadFile"
      ref="fileInput"
      type="file"
      id="file-upload"
      hidden
    />
    <ModalWindow
      :opened="directoryCreationWindowOpened"
      @close="directoryCreationWindowOpened = false"
    >
      <template v-slot:header>
        <h3>Directory creation</h3>
      </template>
      <template v-slot:body>
        <BaseForm ref="directoryCreationForm" class="form">
          <div class="fields">
            <label for="directory-name">Name</label>
            <input
              v-model="directoryName"
              type="text"
              id="directory-name"
              required
            />
          </div>
          <button @click="createDirectory">Create</button>
          <BaseError :error="directoryCreationError" />
        </BaseForm>
      </template>
    </ModalWindow>

    <ModalWindow
      :opened="fileRanameWindowOpened"
      @close="fileRanameWindowOpened = false"
    >
      <template v-slot:header>
        <h3>
          {{
            whatIsBeingRenamed === FileType.FILE
              ? "File rename"
              : "Directory rename"
          }}
        </h3>
      </template>
      <template v-slot:body>
        <BaseForm ref="fileRenameForm" class="form">
          <div class="fields">
            <label for="new-file-name">Name</label>
            <input
              v-model="newFileName"
              type="text"
              id="new-file-name"
              required
            />
          </div>
          <button @click="rename">Rename</button>
          <BaseError :error="fileRenameError" />
        </BaseForm>
      </template>
    </ModalWindow>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { FileService } from "@/services/file-service";
import FileSystemItem from "@/components/file-explorer/FileSystemItem.vue";
import { type File, type Directory, FileType } from "@/schemas/file-system";
import ModalWindow from "@/components/ModalWindow.vue";
import BaseError from "@/components/BaseError.vue";
import BaseForm from "@/components/BaseForm.vue";
import { LoggingService } from "@/services/logging-service";
import type { BackendlessError } from "@/schemas/error";

const emit = defineEmits({
  dblclick(filePath: string, publicUrl: string) {
    return true;
  },
});

onMounted(async () => {
  await updateDirectoryContent();
});

const fileInput = ref<HTMLInputElement>();
const files = ref<(File | Directory)[]>([]);
const path = ref("/");
const directoryCreationWindowOpened = ref(false);
const directoryName = ref("");
const fileRanameWindowOpened = ref(false);
const oldFileName = ref("");
const newFileName = ref("");
const directoryCreationError = ref("");
const fileRenameError = ref("");
const whatIsBeingRenamed = ref(FileType.FILE);

async function updateDirectoryContent() {
  files.value = await FileService.getDirectoryContent(path.value);
}

async function uploadFile() {
  if (!fileInput.value?.files) {
    return;
  }
  const file = fileInput.value?.files[0];
  if (!file) {
    return;
  }
  try {
    const fileURL = await FileService.uploadFile(path.value, file);
    await updateDirectoryContent();
  } catch (err) {
    LoggingService.FileSystemLogger.error((err as BackendlessError).message);
  }
}

async function createDirectory() {
  try {
    await FileService.createDirectory(`${path.value}${directoryName.value}`);
    directoryCreationWindowOpened.value = false;
    await updateDirectoryContent();
    directoryName.value = "";
  } catch (err) {
    directoryCreationError.value = (err as Error).message;
  }
}

async function goToDirectory(name: string) {
  path.value =
    path.value[path.value.length - 1] === "/"
      ? `${path.value}${name}/`
      : `${path.value}/${name}/`;
  await updateDirectoryContent();
}

async function goToParentDirectory() {
  const index = path.value.slice(0, path.value.length - 1).lastIndexOf("/");
  if (index >= 0) {
    path.value = path.value.slice(0, index + 1);
  }
  await updateDirectoryContent();
}

async function deleteFile(name: string) {
  await FileService.deleteFile(`${path.value}${name}`);
  await updateDirectoryContent();
}

async function deleteDirectory(name: string) {
  await FileService.deleteDirectory(`${path.value}${name}`);
  await updateDirectoryContent();
}
async function rename() {
  try {
    await FileService.rename(
      `${path.value}${oldFileName.value}`,
      newFileName.value,
    );
    await updateDirectoryContent();
    fileRanameWindowOpened.value = false;
  } catch (err) {
    fileRenameError.value = (err as Error).message;
  }
}

function startRenaming(name: string, type: FileType) {
  newFileName.value = oldFileName.value = name;
  whatIsBeingRenamed.value = type;
  fileRanameWindowOpened.value = true;
  fileRenameError.value = "";
}
</script>

<style lang="scss" scoped>
@import "@/stylesheets/registration-and-login-form.scss";

.file-explorer {
  width: 100%;
  padding: $step * 5;
}

.directory-content {
  display: grid;
  grid-template-columns: repeat(7, auto);
}

.path {
  width: 100%;
  font-size: 2em;
}
</style>
