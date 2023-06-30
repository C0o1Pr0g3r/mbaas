<template>
  <li class="item">
    <div class="fields">
      <span>Latitude: {{ place.location.getLatitude() }}</span>
      <span>Longitude: {{ place.location.getLongitude() }}</span>
      <span>Description: {{ place.description }}</span>
      <span>Hashtags: {{ place.hashtags }}</span>
      <button @click="emit('delete')">Delete</button>
    </div>
    <div v-if="place.images" class="gallery">
      <img
        v-for="image in place.images"
        :key="image.fileURL"
        :src="image.fileURL"
        @click="viewImage(image.fileURL)"
        class="image"
      />
    </div>
    <ImageViewer
      :opened="imageViewerOpened"
      :imageSrc="imageToView"
      @close="imageViewerOpened = false"
    >
    </ImageViewer>
  </li>
</template>

<script setup lang="ts">
import type { Place } from "@/schemas/place";
import ImageViewer from "@/components/ImageViewer.vue";
import { ref } from "vue";

const props = defineProps<{
  place: Place;
}>();

const emit = defineEmits({
  delete() {
    return true;
  },
});

const imageViewerOpened = ref(false);
const imageToView = ref("");

function viewImage(image: string) {
  imageToView.value = image;
  imageViewerOpened.value = true;
}
</script>

<style lang="scss" scoped>
@import "@/stylesheets/shared.scss";

.item {
  display: flex;
}

.fields {
  display: flex;
  flex-direction: column;
}

.gallery {
  display: flex;
  padding: 0 $step * 6;
  @include gap-between-children($step * 4, $horizontal-direction);
}

.image {
  cursor: pointer;
  border: 2px solid black;
}
</style>
