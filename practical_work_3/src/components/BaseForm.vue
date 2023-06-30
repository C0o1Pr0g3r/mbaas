<template>
  <form ref="form" @submit.prevent>
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineExpose({ checkValidity });

const form = ref<HTMLFormElement>();

function checkValidity() {
  return form.value?.checkValidity();
}
</script>

<style lang="scss" scoped></style>
