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
      <router-link to="/login" class="header__login"><span>Войти</span></router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import logo from "@/assets/img/logo.svg";
import { useCartStore } from "@/stores/cart";

const cartStore = useCartStore();

const totalPrice = computed(() => cartStore.totalPrice);
</script>

<style lang="scss">
@use "@/assets/scss/layout/header";
@use "@/assets/scss/blocks/logo";
</style>
