<template>
  <div class="combobox">
    <input
      ref="input"
      :value="searchText"
      @input="(ev) => {
      emit('input', (ev.target as HTMLInputElement).value)
    }"
      type="text"
      class="search-field"
    />
    <ul v-if="searchResults.length > 0" class="combobox__list">
      <li
        v-for="(searchResult, index) in searchResults"
        :key="index"
        @click="emit('click', index)"
        class="combobox__item"
      >
        {{ searchResult }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  searchText: string;
  searchResults: string[];
}>();

const emit = defineEmits({
  click(index: number) {
    return true;
  },
  input(value: string) {
    return true;
  },
});

defineExpose({ focusInput });

const input = ref<HTMLInputElement>();

function focusInput() {
  input.value?.focus();
}
</script>

<style lang="scss" scoped>
.combobox {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.combobox__list {
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
}

.combobox__item {
  &:hover {
    background-color: aqua;
  }
}
</style>
