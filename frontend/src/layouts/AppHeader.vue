<template>
  <header class="header">
    <div class="header__logo">
      <a href="/" class="logo">
        <img :src="logo" alt="V!U!E! Pizza logo" width="90" height="40" />
      </a>
    </div>
    <div class="header__cart">
      <a href="/cart">0 ₽</a>
    </div>
    <div class="header__user">
      <a href="#" class="header__login"><span>Войти</span></a>
    </div>
  </header>
</template>

<script setup lang="ts">
import logo from "@/assets/img/logo.svg";
</script>
