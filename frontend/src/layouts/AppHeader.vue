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
    <div class="header__user">
      <template v-if="authStore.isAuthenticated && authStore.user">
        <router-link to="/profile" class="header__user-name">
          {{ authStore.user.name }}
        </router-link>
        <button type="button" class="header__logout" @click="handleLogout">
          Выйти
        </button>
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
import logo from "@/assets/img/logo.svg";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const totalPrice = computed(() => cartStore.totalPrice);

const handleLogout = async () => {
  await authStore.logout();
  router.push("/");
};
</script>

<style lang="scss">
@use "@/assets/scss/layout/header";
@use "@/assets/scss/blocks/logo";
</style>
