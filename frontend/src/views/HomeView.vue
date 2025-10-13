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
                  type="radio"
                  name="dought"
                  v-model="selectedDoughId"
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
                  type="radio"
                  name="diameter"
                  :value="size.id"
                  class="visually-hidden"
                  v-model="selectedSizeId"
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
                    type="radio"
                    name="sauce"
                    :value="sauce.id"
                    v-model="selectedSauceId"
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

                    <div class="counter counter--orange ingredients__counter">
                      <button
                        type="button"
                        class="counter__button counter__button--minus"
                        :disabled="ingredientsCountMap[ingredient.id] <= 0"
                        @click="onDecreaseIngredient(ingredient.id)"
                      >
                        <span class="visually-hidden">Меньше</span>
                      </button>
                      <input
                        type="text"
                        name="counter"
                        class="counter__input"
                        :value="ingredientsCountMap[ingredient.id]"
                      />
                      <button
                        type="button"
                        class="counter__button counter__button--plus"
                        @click="onIncreaseIngredient(ingredient.id)"
                      >
                        <span class="visually-hidden">Больше</span>
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="content__pizza">
          <label class="input">
            <span class="visually-hidden">Название пиццы</span>
            <input
              type="text"
              name="pizza_name"
              placeholder="Введите название пиццы"
              :value="pizzaName"
            />
          </label>

          <div class="content__constructor">
            <div class="pizza pizza--foundation--big-tomato">
              <div class="pizza__wrapper">
                <div class="pizza__filling pizza__filling--ananas"></div>
                <div class="pizza__filling pizza__filling--bacon"></div>
                <div class="pizza__filling pizza__filling--cheddar"></div>
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
// sauces
import sauces from "@/mocks/sauces.json";
import saucesKeys from "@/common/data/sauces.js";
// ingredients
import ingredients from "@/mocks/ingredients.json";
import ingredientsKeys from "@/common/data/ingredients.js";
// sizes
import sizes from "@/mocks/sizes.json";
import sizesKeys from "@/common/data/sizes.js";
// dough
import doughList from "@/mocks/dough.json";
import doughKeys from "@/common/data/dough.js";

const saucesMap = ref(
  sauces.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {})
);

const ingredientsMap = ref(
  ingredients.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {})
);

const sizesMap = ref(
  sizes.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {})
);

const doughMap = ref(
  doughList.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {})
);

const selectedDoughId = ref(doughList[0].id);
const selectedSauceId = ref(sauces[0].id);
const selectedSizeId = ref(sizes[0].id);
const pizzaName = ref("");

const ingredientsCountMap = ref(
  ingredients.reduce((acc: Record<number, number>, item) => {
    acc[item.id] = 0;
    return acc;
  }, {})
);

const onIncreaseIngredient = (id: number) => {
  ingredientsCountMap.value[id] += 1;
};

const onDecreaseIngredient = (id: number) => {
  ingredientsCountMap.value[id] -= 1;
};

const price = computed(() => {
  const ingredientsPrice = ingredients.reduce((acc, item) => {
    if (ingredientsCountMap.value[item.id] >= 0) {
      acc +=
        ingredientsMap.value[item.id].price *
        ingredientsCountMap.value[item.id];
    }

    return acc;
  }, 0);

  const fullPrice =
    sizesMap.value[selectedSizeId.value].multiplier *
    (saucesMap.value[selectedDoughId.value].price +
      doughMap.value[selectedDoughId.value].price +
      ingredientsPrice);

  return Math.round(fullPrice);
});
</script>
