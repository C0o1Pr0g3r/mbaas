<template>
  <ModalWindow :opened="opened" @close="emit('close')">
    <template v-slot:body>
      <img :src="imageSrc" />
    </template>
  </ModalWindow>
</template>

<script setup lang="ts">
import ModalWindow from "@/components/ModalWindow.vue";

const props = defineProps<{
  opened: boolean;
  imageSrc: string;
}>();

const emit = defineEmits({
  close() {
    return true;
  },
});
</script>

<style lang="scss" scoped></style>
