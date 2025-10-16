<template>
  <main class="content">
    <form action="#" method="post">
      <div class="content__wrapper">
        <h1 class="title title--big">Конструктор пиццы</h1>

        <div class="content__dough">
          <div class="sheet">
            <h2 class="title title--small sheet__title">Выберите тесто</h2>

            <div class="sheet__content dough">
              <label
                v-for="dough in doughList"
                :key="dough.id"
                :class="`dough__input dough__input--${doughKeys[dough.id]}`"
              >
                <input
                  v-model="selectedDoughId"
                  type="radio"
                  name="dought"
                  :value="dough.id"
                  class="visually-hidden"
                />
                <b>{{ dough.name }}</b>
                <span>{{ dough.description }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="content__diameter">
          <div class="sheet">
            <h2 class="title title--small sheet__title">Выберите размер</h2>

            <div class="sheet__content diameter">
              <label
                v-for="size in sizes"
                :key="size.id"
                :class="`diameter__input diameter__input--${sizesKeys[size.id]}`"
              >
                <input
                  v-model="selectedSizeId"
                  type="radio"
                  name="diameter"
                  :value="size.id"
                  class="visually-hidden"
                />
                <span>{{ size.name }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="content__ingredients">
          <div class="sheet">
            <h2 class="title title--small sheet__title">
              Выберите ингредиенты
            </h2>

            <div class="sheet__content ingredients">
              <div class="ingredients__sauce">
                <p>Основной соус:</p>

                <label
                  v-for="sauce in sauces"
                  :key="sauce.id"
                  class="radio ingredients__input"
                >
                  <input
                    v-model="selectedSauceId"
                    type="radio"
                    name="sauce"
                    :value="sauce.id"
                  />
                  <span>{{ sauce.name }}</span>
                </label>
              </div>

              <div class="ingredients__filling">
                <p>Начинка:</p>

                <ul class="ingredients__list">
                  <li
                    v-for="ingredient in ingredients"
                    :key="ingredient.id"
                    class="ingredients__item"
                  >
                    <span
                      :class="`filling filling--${ingredientsKeys[ingredient.id]}`"
                    >
                      {{ ingredient.name }}
                    </span>

                    <UiCounter
                      v-model="ingredientsCountMap[ingredient.id]"
                      :min-value="0"
                    />
                  </li>
                </ul>
              </div>
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
              :class="`pizza pizza--foundation--${sizesKeys[selectedSizeId]}-${saucesKeys[selectedSauceId]}`"
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
import { ref, computed } from "vue";
import UiCounter from "@/common/components/counter";
import UiInput from "@/common/components/input";
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
import doughJson from "@/mocks/dough.json";
import doughKeys from "@/common/data/dough";
// types
import type { Sauce, Ingredient, Dough, Size } from "@/types";

const sauces = saucesJson as Sauce[];
const ingredients = ingredientsJson as Ingredient[];
const sizes = sizesJson as Size[];
const doughList = doughJson as Dough[];

const saucesMap = ref(
  sauces.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<number, Sauce>,
  ),
);

const ingredientsMap = ref(
  ingredients.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<number, Ingredient>,
  ),
);

const sizesMap = ref(
  sizes.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<number, Size>,
  ),
);

const doughMap = ref(
  doughList.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<number, Dough>,
  ),
);

const selectedDoughId = ref(doughList[0].id);
const selectedSauceId = ref(sauces[0].id);
const selectedSizeId = ref(sizes[0].id);
const pizzaName = ref("");

const ingredientsCountMap = ref(
  ingredients.reduce((acc: Record<number, number>, item) => {
    acc[item.id] = 0;
    return acc;
  }, {}),
);

const selectedIngredientsIds = computed(() => {
  return ingredients.reduce((acc, item) => {
    if (ingredientsCountMap.value[item.id] > 0) {
      acc.push(item.id);
    }
    return acc;
  }, [] as number[]);
});

const price = computed(() => {
  const ingredientsPrice = selectedIngredientsIds.value.reduce(
    (acc, itemId) => {
      acc +=
        ingredientsMap.value[itemId].price * ingredientsCountMap.value[itemId];

      return acc;
    },
    0,
  );

  const fullPrice =
    sizesMap.value[selectedSizeId.value].multiplier *
    (saucesMap.value[selectedDoughId.value].price +
      doughMap.value[selectedDoughId.value].price +
      ingredientsPrice);

  return Math.round(fullPrice);
});
</script>

<style lang="scss">
@import "@/assets/scss/blocks/dough.scss";
@import "@/assets/scss/blocks/diameter.scss";
@import "@/assets/scss/blocks/ingredients.scss";
@import "@/assets/scss/blocks/radio.scss";
@import "@/assets/scss/blocks/title.scss";
@import "@/assets/scss/blocks/button.scss";
@import "@/assets/scss/blocks/pizza.scss";
@import "@/assets/scss/blocks/filling.scss";
</style>
