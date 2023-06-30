<template>
  <div v-if="user" class="user-profile">
    <UserAvatar
      :avatar-url="user.avatar"
      @click="imageViewerOpened = true"
      class="user-profile__avatar"
    />
    <span>Email: {{ user?.email }}</span>
    <span>Login: {{ user?.login }}</span>
    <span>Date ob birth: {{ date2ISODate(user?.dateOfBirth) }}</span>
    <span>Gender: {{ user?.gender }}</span>
    <span>Country: {{ user?.country }}</span>
    <button v-if="isFriend" @click="emit('remove-from-friends')">
      Remove from friends
    </button>
    <div v-else-if="isThereFriendRequestFrom">
      <button @click="emit('accept-friend-request')">
        Accept friend request
      </button>
      <button @click="emit('decline-friend-request')">
        Decline friend request
      </button>
    </div>
    <button
      v-else-if="
        !isThereFriendRequestTo &&
        !isFriend &&
        !(useAuthStore().currentUser.value?.login === user.login)
      "
      @click="emit('send-friend-request')"
    >
      Send a friend request
    </button>
    <ImageViewer
      :opened="imageViewerOpened"
      :image-src="imageToView"
      @close="imageViewerOpened = false"
    />
  </div>
</template>

<script setup lang="ts">
import UserAvatar from "@/components/UserAvatar.vue";
import ImageViewer from "@/components/ImageViewer.vue";
import type { User } from "@/schemas/user";
import { date2ISODate } from "@/utilities";
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth-store";

const props = defineProps<{
  user?: User | null;
}>();

const imageViewerOpened = ref(false);
const imageToView = ref(props.user?.avatar ?? "");

const emit = defineEmits({
  "remove-from-friends"() {
    return true;
  },
  "accept-friend-request"() {
    return true;
  },
  "decline-friend-request"() {
    return true;
  },
  "send-friend-request"() {
    return true;
  },
});

const isFriend = computed(() => {
  const currentUser = useAuthStore().currentUser.value;
  if (!currentUser) {
    return false;
  }
  return Boolean(
    currentUser.friends.find((login) => login === props.user?.login),
  );
});

const isThereFriendRequestFrom = computed(() => {
  const currentUser = useAuthStore().currentUser.value;
  if (!currentUser) {
    return false;
  }
  return Boolean(
    currentUser.friendRequests.find((login) => login === props.user?.login),
  );
});
const isThereFriendRequestTo = computed(() => {
  const currentUser = useAuthStore().currentUser.value;
  if (!currentUser || !props.user) {
    return false;
  }
  return Boolean(
    props.user.friendRequests.find((login) => login === currentUser.login),
  );
});
</script>

<style lang="scss" scoped>
.user-profile {
  display: flex;
  flex-direction: column;
}

.user-profile__avatar {
  cursor: pointer;
}
</style>
