<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useDataStore } from "@/stores/data";
import doughJson from "@/mocks/dough.json";
import sizesJson from "@/mocks/sizes.json";
import saucesJson from "@/mocks/sauces.json";
import ingredientsJson from "@/mocks/ingredients.json";
import miscJson from "@/mocks/misc.json";
import type { Dough, Size, Sauce, Ingredient, Misc } from "@/types";

const dataStore = useDataStore();

onMounted(() => {
  dataStore.setAllData({
    dough: doughJson as Dough[],
    sizes: sizesJson as Size[],
    sauces: saucesJson as Sauce[],
    ingredients: ingredientsJson as Ingredient[],
    misc: miscJson as Misc[],
  });
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
