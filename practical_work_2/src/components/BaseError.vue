<template>
  <span v-if="error" class="error">{{ error }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: string | undefined;
}>();
</script>

<style lang="scss" scoped>
.error {
  color: red;
  text-align: center;
}
</style>
