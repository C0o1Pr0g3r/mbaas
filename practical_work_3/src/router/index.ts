import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import RegistrationView from "@/views/RegistrationView.vue";
import LoginView from "@/views/LoginView.vue";
import MyProfile from "@/views/MyProfileView.vue";
import MyPlaces from "@/views/MyPlacesView.vue";
import FriendsView from "@/views/FriendsView.vue";
import FeedbackView from "@/views/FeedbackView.vue";
import FileExplorer from "@/components/file-explorer/FileExplorer.vue";
import { useAuthStore } from "@/stores/auth-store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/register",
      name: "registration",
      component: RegistrationView,
      beforeEnter: (to, from, next) =>
        !useAuthStore().isLoggedIn ? next() : next("/"),
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      beforeEnter: (to, from, next) =>
        !useAuthStore().isLoggedIn ? next() : next("/"),
    },
    {
      path: "/file-explorer",
      name: "file-explorer",
      component: FileExplorer,
      beforeEnter: (to, from, next) =>
        useAuthStore().isLoggedIn ? next() : next("/"),
    },
    {
      path: "/my-profile",
      name: "my-profile",
      component: MyProfile,
      beforeEnter: (to, from, next) =>
        useAuthStore().isLoggedIn ? next() : next("/"),
    },
    {
      path: "/my-places",
      name: "my-places",
      component: MyPlaces,
      beforeEnter: (to, from, next) =>
        useAuthStore().isLoggedIn ? next() : next("/"),
    },
    {
      path: "/friends",
      name: "friends",
      component: FriendsView,
      beforeEnter: (to, from, next) =>
        useAuthStore().isLoggedIn ? next() : next("/"),
    },
    {
      path: "/feedback",
      name: "feedback",
      component: FeedbackView,
      beforeEnter: (to, from, next) =>
        useAuthStore().isLoggedIn ? next() : next("/"),
    },
  ],
});

export default router;
