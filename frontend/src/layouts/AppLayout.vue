<template>
  <AppHeader />
  <router-view v-slot="{ Component, route }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </router-view>
</template>

<script setup lang="ts">
import AppHeader from "@/layouts/AppHeader.vue";
</script>
