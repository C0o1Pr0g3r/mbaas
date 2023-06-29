<template>
  <span @click="emit('click')" class="name">{{ file.name }}</span>
  <span>{{ date2ISODateTime(new Date(file.createdOn)) }}</span>
  <span>{{ date2ISODateTime(new Date(file.updatedOn)) }}</span>
  <span>{{ "size" in file ? file.size : "" }}</span>
  <a v-if="'size' in file" :href="file.publicUrl">Download</a>
  <span v-else></span>
  <button @click="emit('rename')">Rename</button>
  <button @click="emit('delete')">Delete</button>
</template>

<script setup lang="ts">
import type { File, Directory } from "@/schemas/file-system";
import { date2ISODateTime } from "@/utilities";

const props = defineProps<{
  file: File | Directory;
}>();

const emit = defineEmits({
  click() {
    return true;
  },
  delete() {
    return true;
  },
  rename() {
    return true;
  },
});
</script>

<style lang="scss" scoped>
.name:hover {
  cursor: pointer;
}
</style>
