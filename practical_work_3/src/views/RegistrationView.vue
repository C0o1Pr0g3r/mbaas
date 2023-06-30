<template>
  <BaseForm ref="form" class="form registration-or-login-form">
    <div class="fields">
      <label for="email">Email</label>
      <input v-model="user.email" type="email" id="email" required />
      <label for="password">Password</label>
      <input v-model="user.password" type="password" id="password" required />
      <label for="login">Login</label>
      <input v-model="user.login" type="text" id="login" required />
      <label for="date-of-birth">Date of birth</label>
      <input
        type="date"
        id="date-of-birth"
        required
        :value="date2ISODate(user.dateOfBirth)"
        :max="date2ISODate(getDate5YearsAgo())"
        @input="(ev) => {
          if ((ev.target as HTMLInputElement).value.length > 0) {
            user.dateOfBirth = new Date((ev.target as HTMLInputElement).value);
          }
        }"
      />
      <label for="gender">Gender</label>
      <select v-model="user.gender" id="gender" required>
        <option
          v-for="gender in GENDERS"
          :key="gender"
          :value="gender"
          :label="gender"
        ></option>
      </select>
      <label for="country">Country</label>
      <select v-model="user.country" id="country" required>
        <option
          v-for="country in COUNTRIES"
          :key="country"
          :value="country"
          :label="country"
        ></option>
      </select>
    </div>
    <button @click="register">Register</button>
    <BaseError :error="error?.message" />
  </BaseForm>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseForm from "@/components/BaseForm.vue";
import BaseError from "@/components/BaseError.vue";
import { Gender, GENDERS } from "@/schemas/gender";
import { Country, COUNTRIES } from "@/schemas/country";
import { date2ISODate } from "@/utilities";
import type { UserToRegister } from "@/schemas/user";
import { useAuthStore } from "@/stores/auth-store";
import type { BackendlessError } from "@/schemas/error";

const router = useRouter();

const getDate5YearsAgo = getDateNYearsAgo.bind(undefined, 5);

const form = ref<typeof BaseForm>();
const user = ref<UserToRegister>({
  email: "",
  password: "",
  login: "",
  dateOfBirth: getDate5YearsAgo(),
  gender: Gender.FEMALE,
  country: Country.BELGIUM,
});
const error = ref<BackendlessError | null>();

function getDateNYearsAgo(n: number) {
  const nYearsAgo = new Date(
    new Date().setFullYear(new Date().getFullYear() - n),
  );
  return nYearsAgo;
}

async function register() {
  if (!form.value?.checkValidity()) {
    return;
  }

  try {
    await useAuthStore().register(user.value);
    router.push("/");
  } catch (err) {
    error.value = err as BackendlessError;
  }
}
</script>

<style lang="scss" scoped>
@import "@/stylesheets/registration-and-login-form.scss";
</style>
