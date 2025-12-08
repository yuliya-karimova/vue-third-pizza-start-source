<template>
  <header class="header">
    <div class="header__logo">
      <router-link to="/" class="logo">
        <img :src="logo" alt="V!U!E! Pizza logo" width="90" height="40" />
      </router-link>
    </div>
    <div class="header__cart">
      <router-link to="/cart">{{ totalPrice }} ₽</router-link>
    </div>
    <div v-if="authStore.isAuthenticated" class="header__favorites">
      <router-link to="/favorites" title="Избранные пиццы">⭐</router-link>
    </div>
    <div class="header__user">
      <template v-if="authStore.isAuthenticated && authStore.user">
        <router-link to="/profile" class="header__user-name">
          <img
            v-if="authStore.user.avatar"
            :src="getAvatarUrl(authStore.user.avatar)"
            :alt="authStore.user.name"
          />
          <span>{{ authStore.user.name }}</span>
        </router-link>
        <a href="#" class="header__logout" @click.prevent="handleLogout">
          <span>Выйти</span>
        </a>
      </template>
      <router-link v-else to="/login" class="header__login">
        <span>Войти</span>
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import logoImage from "@/assets/img/logo.svg";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
import { getImageUrl } from "@/utils/images";

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

// Явная типизация для SVG импорта
const logo: string = logoImage as string;
const totalPrice = computed(() => cartStore.totalPrice);

const getAvatarUrl = (avatar: string | undefined): string => {
  if (!avatar) return "";
  return getImageUrl(avatar);
};

const handleLogout = async () => {
  await authStore.logout();
  router.push("/");
};
</script>

<style lang="scss">
@use "@/assets/scss/layout/header";
@use "@/assets/scss/blocks/logo";
</style>
