<template>
  <img
    v-if="avatarUrl"
    @click="emit('click')"
    :src="avatarUrl"
    class="avatar"
  />
  <div v-else @click="emit('click')" class="placeholder"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  avatarUrl?: string;
}>();

const emit = defineEmits({
  click() {
    return true;
  },
});
</script>

<style lang="scss" scoped>
.avatar {
  border-radius: 50%;
  object-fit: cover;
}

.placeholder {
  background-color: blanchedalmond;
}
</style>
