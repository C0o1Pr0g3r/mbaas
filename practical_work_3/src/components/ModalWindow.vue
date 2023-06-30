<template>
  <Teleport to="body">
    <div v-if="opened" @click="emit('close')" class="modal-window-wrapper">
      <div @click="(ev) => ev.stopPropagation()" class="modal-window">
        <div v-if="slots.header" class="modal-window__header">
          <slot name="header"></slot>
        </div>
        <hr v-if="slots.body" />
        <div v-if="slots.body" class="modal-window__body">
          <slot name="body"></slot>
        </div>
        <hr v-if="slots.footer" />
        <div v-if="slots.footer" class="modal-window__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  opened: boolean;
}>();

const emit = defineEmits({
  close() {
    return true;
  },
});

const slots = defineSlots();
</script>

<style lang="scss" scoped>
@import "@/stylesheets/shared.scss";

.modal-window-wrapper {
  background-color: #00000077;
  position: fixed;
  top: 0%;
  right: 0%;
  bottom: 0%;
  left: 0%;
}

.modal-window {
  background-color: white;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  padding: $step * 5;
}

.modal-window__header {
  margin-bottom: $step * 2;
}

.modal-window__footer {
  margin-top: $step * 2;
}

.modal-window__body {
  flex-grow: 1;
  margin: $step * 2 0;
}
</style>
