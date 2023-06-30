<template>
  <BaseForm ref="form" class="form registration-or-login-form">
    <div class="fields">
      <label for="email">Email</label>
      <input v-model="user.email" type="email" id="email" required />
      <label for="password">Password</label>
      <input v-model="user.password" type="password" id="password" required />
    </div>
    <button @click="login">Login</button>
    <BaseError :error="error?.message" />
    <span
      >Have you forgotten your password?
      <ButtonAsLabel @click="passwordRecoveryWindowOpened = true"
        >Restore</ButtonAsLabel
      ></span
    >
  </BaseForm>
  <ModalWindow
    :opened="passwordRecoveryWindowOpened"
    @close="passwordRecoveryWindowOpened = false"
  >
    <template v-slot:header>
      <h3>Password recovery</h3>
    </template>
    <template v-slot:body>
      <BaseForm ref="passwordRecoveryForm" class="form">
        <div class="fields">
          <label for="password-recovery-email">Email</label>
          <input
            v-model="passwordRecoveryEmail"
            type="email"
            id="password-recovery-email"
            required
          />
        </div>
        <button @click="restorePassword">Restore</button>
      </BaseForm>
    </template>
  </ModalWindow>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseForm from "@/components/BaseForm.vue";
import BaseError from "@/components/BaseError.vue";
import ModalWindow from "@/components/ModalWindow.vue";
import ButtonAsLabel from "@/components/ButtonAsLabel.vue";
import type { UserToLogin } from "@/schemas/user";
import { useAuthStore } from "@/stores/auth-store";
import type { BackendlessError } from "@/schemas/error";
import { LoggingService } from "@/services/logging-service";

const router = useRouter();

const form = ref<typeof BaseForm>();
const passwordRecoveryForm = ref<typeof BaseForm>();
const user = ref<UserToLogin>({
  email: "",
  password: "",
});
const error = ref<BackendlessError | null>();
const passwordRecoveryWindowOpened = ref(false);
const passwordRecoveryEmail = ref("");

async function login() {
  if (!form.value?.checkValidity()) {
    return;
  }

  try {
    await useAuthStore().login(user.value);
    router.push("/");
  } catch (err) {
    error.value = err as BackendlessError;
    LoggingService.AuthLogger.error((err as BackendlessError).message);
  }
}

async function restorePassword() {
  if (!passwordRecoveryForm.value?.checkValidity()) {
    return;
  }

  await useAuthStore().restorePassword(passwordRecoveryEmail.value);
  passwordRecoveryWindowOpened.value = false;
}
</script>

<style lang="scss" scoped>
@import "@/stylesheets/registration-and-login-form.scss";
</style>
