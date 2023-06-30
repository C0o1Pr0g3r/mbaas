<template>
  <div class="wrapper">
    <div>
      <button @click="placeAdditionWindowOpened = true">Add place</button>
    </div>
    <ul class="places">
      <PlaceItem
        v-for="(place, index) in places"
        :key="index"
        :place="place"
        @delete="deletePlace(place)"
        class="place-item"
      />
    </ul>
    <ModalWindow
      :opened="placeAdditionWindowOpened"
      @close="closePlaceAdditionWindow"
    >
      <template v-slot:header>
        <h3>Place addition</h3>
      </template>
      <template v-slot:body>
        <BaseForm ref="placeAdditionForm" class="form">
          <div class="fields">
            <label for="latitude">Latitude</label>
            <input v-model="latitude" type="number" id="latitude" required />
            <label for="longitude">Longitude</label>
            <input v-model="longitude" type="number" id="longitude" required />
            <label for="description">Description</label>
            <input
              v-model="description"
              type="text"
              id="description"
              required
            />
            <label for="hashtags">Hashtags</label>
            <input v-model="hashtags" type="text" id="hashtags" required />
            <input type="file" class="file" ref="images" multiple />
          </div>
          <button @click="addPlace">Add</button>
        </BaseForm>
      </template>
    </ModalWindow>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { PlaceService } from "@/services/place-service";
import BaseForm from "@/components/BaseForm.vue";
import BaseError from "@/components/BaseError.vue";
import ModalWindow from "@/components/ModalWindow.vue";
import PlaceItem from "@/components/PlaceItem.vue";
import type { Place } from "@/schemas/place";
import { LoggingService } from "@/services/logging-service";
import type { BackendlessError } from "@/schemas/error";

onMounted(async () => {
  await loadPlaces();
});

const places = ref<Place[]>([]);
const latitude = ref(0);
const longitude = ref(0);
const description = ref("");
const hashtags = ref("");
const placeAdditionWindowOpened = ref(false);
const images = ref<HTMLInputElement>();

async function loadPlaces() {
  places.value = await PlaceService.getUserPlaces();
}

function resetData() {
  latitude.value = 0;
  longitude.value = 0;
  description.value = "";
  hashtags.value = "";
}

function closePlaceAdditionWindow() {
  placeAdditionWindowOpened.value = false;
  resetData();
}

async function addPlace() {
  const files: globalThis.File[] = [];
  const fileList = images.value?.files;
  if (fileList) {
    for (const file of fileList) {
      files.push(file);
    }
  }
  try {
    await PlaceService.addPlace(
      latitude.value,
      longitude.value,
      description.value,
      hashtags.value,
      files,
    );
    placeAdditionWindowOpened.value = false;
    resetData();
    await loadPlaces();
  } catch (err) {
    LoggingService.GeolocationLogger.error((err as BackendlessError).message);
  }
}

async function deletePlace(place: Place) {
  await PlaceService.deletePlace(place);
  await loadPlaces();
}
</script>

<style lang="scss" scoped>
@import "@/stylesheets/registration-and-login-form.scss";

.wrapper {
  @include gap-between-children($step * 8);
  padding: $step * 5;
}

.file {
  grid-column: 1 / 3;
}

.places {
  @include gap-between-children($step * 8);
}

.place-item {
  padding: $step * 3;
  margin: $step * 2;
  border: 2px solid black;
}
</style>
