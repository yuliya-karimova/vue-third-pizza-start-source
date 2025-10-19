<template>
  <main class="content">
    <form action="#" method="post">
      <div class="content__wrapper">
        <h1 class="title title--big">Конструктор пиццы</h1>
        <DoughSelector
          :model-value="selectedDough"
          :dough-list="doughList"
          :dough-keys="doughKeys"
        />
        <SizeSelector
          v-model="selectedSize"
          :size-list="sizeList"
          :sizes-keys="sizesKeys"
        />

        <IngredientsSelector
          v-model="selectedIngredients"
          :ingredient-list="ingredientList"
          :ingredients-keys="ingredientsKeys"
        >
          <SaucesSelector v-model="selectedSauce" :sauce-list="sauceList" />
        </IngredientsSelector>

        <PizzaViewer
          v-model="pizzaName"
          :size-key="currentSizeKey"
          :sauce-key="currentSauceKey"
          :ingredients-for-pizza="ingredientsForPizza"
          :price="price"
        />
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, Ref } from "vue";
// sauces
import saucesJson from "@/mocks/sauces.json";
import saucesKeys from "@/common/data/sauces";
// ingredients
import ingredientsJson from "@/mocks/ingredients.json";
import ingredientsKeys from "@/common/data/ingredients";
// sizes
import sizesJson from "@/mocks/sizes.json";
import sizesKeys from "@/common/data/sizes";
// dough
import doughKeys from "@/common/data/dough";
import doughJson from "@/mocks/dough.json";
// types
import type {
  Sauce,
  Ingredient,
  Dough,
  Size,
  IngredientsCounter,
} from "@/types";
// components
import DoughSelector from "@/modules/constructor/DoughSelector.vue";
import SizeSelector from "@/modules/constructor/SizeSelector.vue";
import IngredientsSelector from "@/modules/constructor/IngredientsSelector.vue";
import SaucesSelector from "@/modules/constructor/SaucesSelector.vue";
import PizzaViewer from "@/modules/constructor/PizzaViewer.vue";

const sauceList = saucesJson as Sauce[];
const ingredientList = ingredientsJson as Ingredient[];
const sizeList = sizesJson as Size[];
const doughList = doughJson as Dough[];

const selectedDough = ref(doughList[0]);
const selectedSauce = ref(sauceList[0]);
const selectedSize = ref(sizeList[0]);
const selectedIngredients: Ref<IngredientsCounter> = ref({});
const pizzaName = ref("");

const ingredientsForPizza = computed(() => {
  const keys: string[] = [];
  for (const id in selectedIngredients.value) {
    const item = selectedIngredients.value[id]; // { count, price }
    const key = ingredientsKeys[id]; // 'bacon'
    for (let i = 0; i < item.count; i++) {
      keys.push(key);
    }
  }
  return keys;
});

const currentSizeKey = computed(() => sizesKeys[selectedSize.value.id]);
const currentSauceKey = computed(() => saucesKeys[selectedSauce.value.id]);

const price = computed(() => {
  const ingredientsPrice = Object.values(selectedIngredients.value).reduce(
    (acc, { count, price }) => (acc += count * price),
    0,
  );

  const fullPrice =
    selectedSize.value.multiplier *
    (selectedSauce.value.price + selectedDough.value.price + ingredientsPrice);

  return Math.round(fullPrice);
});
</script>

<style lang="scss">
@import "@/assets/scss/blocks/title.scss";
</style>
