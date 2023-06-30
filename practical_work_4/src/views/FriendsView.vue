<template>
  <div class="friends-view">
    <div class="header">
      <div class="user-search-component">
        <label @click="combobox?.focusInput()">Find user</label>
        <ComboBox
          ref="combobox"
          :search-text="loginForSearch"
          :search-results="foundUsers.map((user) => user.login)"
          @click="(index) => showUserProfile(foundUsers[index])"
          @input="findUserByLoginPart"
          id="combobox"
        />
      </div>
      <div class="friend-requests-block">
        <label>Friend requests: {{ potentialFriends.length }}</label>
        <BaseList v-if="potentialFriends.length > 0" class="friend-requests">
          <li
            v-for="potentialFriend in potentialFriends"
            :key="potentialFriend.login"
            @click="showUserProfile(potentialFriend)"
            class="potential-friend"
          >
            {{ potentialFriend.login }}
          </li>
        </BaseList>
      </div>
    </div>
    <div class="friend-block">
      <label>Friends: {{ friends.length }}</label>
      <BaseList v-if="friends.length > 0" class="friends">
        <li
          v-for="friend in friends"
          :key="friend.login"
          @click="showUserProfile(friend)"
          class="potential-friend"
        >
          {{ friend.login }}
        </li>
      </BaseList>
    </div>
    <ModalWindow :opened="userProfileWindowOpened" @close="hideUserProfile">
      <template v-slot:header>
        <h3>User profile</h3>
      </template>
      <template v-slot:body>
        <UserProfile
          :user="selectedUser"
          @send-friend-request="sendFriendRequest"
          @accept-friend-request="acceptFriendRequest"
          @decline-friend-request="declineFriendRequest"
          @remove-from-friends="removeFromFriends"
        />
      </template>
    </ModalWindow>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import ComboBox from "@/components/ComboBox.vue";
import ModalWindow from "@/components/ModalWindow.vue";
import UserProfile from "@/components/UserProfile.vue";
import BaseList from "@/components/BaseList.vue";
import type { User } from "@/schemas/user";
import { FriendsService } from "@/services/friends-service";
import { useAuthStore } from "@/stores/auth-store";

onMounted(async () => {
  const currentUser = useAuthStore().currentUser.value;
  if (!currentUser) {
    return;
  }
  for (const login of currentUser.friendRequests) {
    const potentialFriend = (
      await FriendsService.findUsersByLoginPart(login)
    )[0];
    potentialFriend.dateOfBirth = new Date(potentialFriend.dateOfBirth);
    potentialFriends.value.push(potentialFriend);
  }

  for (const login of currentUser.friends) {
    const friend = (await FriendsService.findUsersByLoginPart(login))[0];
    friend.dateOfBirth = new Date(friend.dateOfBirth);
    friends.value.push(friend);
  }
});

const loginForSearch = ref("");
const foundUsers = ref<User[]>([]);
const potentialFriends = ref<User[]>([]);
const friends = ref<User[]>([]);
const selectedUser = ref<User | null>();
const userProfileWindowOpened = ref(false);
const combobox = ref<typeof ComboBox>();

async function findUserByLoginPart(loginPart: string) {
  loginForSearch.value = loginPart;
  if (loginForSearch.value.length < 3) {
    foundUsers.value = [];
  } else {
    foundUsers.value = await FriendsService.findUsersByLoginPart(loginPart);
    foundUsers.value.forEach((user) => {
      user.dateOfBirth = new Date(user.dateOfBirth);
    });
  }
}

function showUserProfile(user: User) {
  userProfileWindowOpened.value = true;
  selectedUser.value = user;
}

function hideUserProfile() {
  userProfileWindowOpened.value = false;
  selectedUser.value = null;
}

async function sendFriendRequest() {
  if (selectedUser.value) {
    selectedUser.value = await FriendsService.sendFriendRequest(
      selectedUser.value,
    );
  }
}

async function acceptFriendRequest() {
  if (selectedUser.value) {
    selectedUser.value = await FriendsService.acceptFriendRequest(
      selectedUser.value,
    );
  }
  potentialFriends.value.splice(
    potentialFriends.value.findIndex(
      (user) => user.login === selectedUser.value?.login,
    ),
    1,
  );
}

async function declineFriendRequest() {
  if (selectedUser.value) {
    await FriendsService.declineFriendRequest(selectedUser.value);
  }
  potentialFriends.value.splice(
    potentialFriends.value.findIndex(
      (user) => user.login === selectedUser.value?.login,
    ),
    1,
  );
}

async function removeFromFriends() {
  if (selectedUser.value) {
    selectedUser.value = await FriendsService.removeFromFriends(
      selectedUser.value,
    );
  }
  friends.value.splice(
    friends.value.findIndex((user) => user.login === selectedUser.value?.login),
    1,
  );
}
</script>

<style lang="scss" scoped>
@import "@/stylesheets/shared.scss";

.friends-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  padding: $step * 5;
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.friend-requests {
  display: inline;
}

.user-search-component {
  display: flex;
}

.friend-requests-block {
  display: flex;
  flex-direction: column;
}

.friend-requests {
  border: 1px solid black;
}

.potential-friend {
  &:hover {
    background-color: aqua;
    cursor: pointer;
  }
}
</style>
