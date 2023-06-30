<template>
  <BaseForm class="form">
    <div class="fields">
      <label for="message-type">Message type</label>
      <select>
        <option
          v-for="messageType in messageTypes"
          :key="messageType"
          :value="messageType"
          :label="messageType"
          id="message-type"
        ></option>
      </select>
      <label for="subject">Subject</label>
      <input v-model="mail.subject" type="text" id="subject" />
      <label for="recipient">Recipient</label>
      <input v-model="mail.recipient" type="text" id="recipient" />
      <label class="body-label" for="body">Body</label>
      <textarea
        v-model="mail.body"
        class="text-field"
        id="body"
        cols="30"
        rows="10"
      ></textarea>
    </div>
    <button @click="sendMail">Send</button>
  </BaseForm>
</template>

<script setup lang="ts">
import BaseForm from "@/components/BaseForm.vue";
import type { Mail } from "@/schemas/mail";
import { MailService } from "@/services/mail-service";
import { ref } from "vue";

enum MessageType {
  ERROR = "Error",
  ADVICE = "Advice",
}

const messageTypes = [MessageType.ADVICE, MessageType.ERROR] as const;

const mail = ref<Mail>({
  subject: "",
  recipient: "",
  body: "",
});

async function sendMail() {
  await MailService.sendMail(mail.value);
}
</script>

<style lang="scss" scoped>
@import "@/stylesheets/registration-and-login-form.scss";
.form {
  @extend %absolutely-centered;
}

.body-label {
  text-align: center;
  grid-column: 1 / 3;
}

.text-field {
  grid-column: 1 / 3;
  resize: none;
}
</style>
