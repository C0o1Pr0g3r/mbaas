<template>
  <span class="button">
    <slot></slot>
  </span>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.button {
  color: blue;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
