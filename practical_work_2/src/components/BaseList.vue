<template>
  <ul class="list">
    <slot></slot>
  </ul>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@/stylesheets/shared.scss";

.list {
  @include gap-between-children($step * 2);
}
</style>
