<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useDataStore } from "@/stores/data";
import { useAuthStore } from "@/stores/auth";

const dataStore = useDataStore();
const authStore = useAuthStore();

onMounted(async () => {
  await dataStore.loadAllData();

  authStore.checkAuth();
  if (authStore.isAuthenticated) {
    authStore.fetchUser();
  }
});
</script>

<style lang="scss">
@use "@/assets/scss/app";
@use "@/assets/scss/ds-system/ds" as *;

body {
  justify-content: center;
  align-items: center;
}

// Стили для .main__wrapper вынесены в common.scss
// Оставляем только специфичные стили для .main__header
.main__header {
  margin-bottom: 30px;
  padding: 20px 0;

  background-color: $green-600;

  img {
    display: block;

    margin: 0 auto;
  }
}
</style>
