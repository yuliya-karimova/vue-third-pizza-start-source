import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import SignUpView from "@/views/SignUpView.vue";
import CartView from "@/views/CartView.vue";
import ProfileView from "@/views/ProfileView.vue";
import UserView from "@/views/UserView.vue";
import OrdersView from "@/views/OrdersView.vue";
import FavoritesView from "@/views/FavoritesView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: AppLayout,
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
        },
        {
          path: "cart",
          name: "cart",
          component: CartView,
        },
        {
          path: "profile",
          name: "profile",
          component: ProfileView,
          meta: { requiresAuth: true },
        },
        {
          path: "user",
          name: "user",
          component: UserView,
          meta: { requiresAuth: true },
        },
        {
          path: "orders",
          name: "orders",
          component: OrdersView,
          meta: { requiresAuth: true },
        },
        {
          path: "favorites",
          name: "favorites",
          component: FavoritesView,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: "/login",
      component: AuthLayout,
      children: [
        {
          path: "",
          name: "login",
          component: LoginView,
          meta: { requiresGuest: true },
        },
      ],
    },
    {
      path: "/signup",
      component: AuthLayout,
      children: [
        {
          path: "",
          name: "signup",
          component: SignUpView,
          meta: { requiresGuest: true },
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  authStore.checkAuth();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login", query: { redirect: to.fullPath } });
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
