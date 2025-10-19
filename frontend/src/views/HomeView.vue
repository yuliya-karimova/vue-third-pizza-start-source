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

        <div class="content__ingredients">
          <div class="sheet">
            <h2 class="title title--small sheet__title">
              Выберите ингредиенты
            </h2>

            <div class="sheet__content ingredients">
              <SaucesSelector v-model="selectedSauce" :sauce-list="sauceList" />

              <IngredientsSelector
                v-model="selectedIngredients"
                :ingredient-list="ingredientList"
                :ingredients-keys="ingredientsKeys"
              />
            </div>
          </div>
        </div>

        <div class="content__pizza">
          <UiInput
            v-model="pizzaName"
            label="Название пиццы"
            name="pizza_name"
            placeholder="Введите название пиццы"
          />

          <div class="content__constructor">
            <div
              :class="`pizza pizza--foundation--${sizesKeys[selectedSize.id]}-${saucesKeys[selectedSauce.id]}`"
            >
              <div class="pizza__wrapper">
                <div
                  v-for="ingredientId in selectedIngredientsIds"
                  :key="ingredientId"
                  :class="`pizza__filling pizza__filling--${ingredientsKeys[ingredientId]}`"
                />
              </div>
            </div>
          </div>

          <div class="content__result">
            <p>Итого: {{ price }} ₽</p>
            <button type="button" class="button" disabled>Готовьте!</button>
          </div>
        </div>
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
import UiInput from "@/common/components/input";
import DoughSelector from "@/modules/constructor/DoughSelector.vue";
import SizeSelector from "@/modules/constructor/SizeSelector.vue";
import IngredientsSelector from "@/modules/constructor/IngredientsSelector.vue";
import SaucesSelector from "@/modules/constructor/SaucesSelector.vue";

const sauceList = saucesJson as Sauce[];
const ingredientList = ingredientsJson as Ingredient[];
const sizeList = sizesJson as Size[];
const doughList = doughJson as Dough[];

const selectedDough = ref(doughList[0]);
const selectedSauce = ref(sauceList[0]);
const selectedSize = ref(sizeList[0]);
const selectedIngredients: Ref<IngredientsCounter> = ref({});
const pizzaName = ref("");

const selectedIngredientsIds = computed(() =>
  Object.keys(selectedIngredients.value).map((item) => Number(item)),
);

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
@import "@/assets/scss/blocks/button.scss";
@import "@/assets/scss/blocks/pizza.scss";
</style>
