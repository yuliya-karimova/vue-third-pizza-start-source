<template>
  <div class="content__ingredients">
    <div class="sheet">
      <h2 class="title title--small sheet__title">Выберите ингредиенты</h2>

      <div class="sheet__content ingredients">
        <slot />

        <div class="ingredients__filling">
          <p>Начинка:</p>

          <ul class="ingredients__list">
            <li
              v-for="ingredient in ingredientList"
              :key="ingredient.id"
              class="ingredients__item"
            >
              <span
                :class="`filling filling--${ingredientsKeys[ingredient.id]}`"
              >
                {{ ingredient.name }}
              </span>

              <UiCounter
                :model-value="countMap[ingredient.id] || 0"
                :min-value="0"
                @update:model-value="updateIngredientCount(ingredient, $event)"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UiCounter from "@/common/components/counter";
import type { Ingredient, IngredientsCounter } from "@/types";

interface Props {
  modelValue: IngredientsCounter;
  ingredientList: Ingredient[];
  ingredientsKeys: Record<number, string>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: IngredientsCounter): void;
}>();

const countMap = computed(() => {
  const map: Record<number, number> = {};
  for (const id in props.modelValue) {
    map[id] = props.modelValue[id].count;
  }
  return map;
});

const updateIngredientCount = (ingredient: Ingredient, newCount: number) => {
  const newMap = { ...props.modelValue };

  if (newCount > 0) {
    newMap[ingredient.id] = {
      count: newCount,
      price: ingredient.price,
    };
  } else {
    delete newMap[ingredient.id];
  }

  emit("update:modelValue", newMap);
};
</script>

<style lang="scss">
@import "@/assets/scss/blocks/ingredients.scss";
@import "@/assets/scss/blocks/filling.scss";
</style>
