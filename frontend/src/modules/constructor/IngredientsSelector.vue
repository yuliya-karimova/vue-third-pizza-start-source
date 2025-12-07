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
                :class="`filling filling--${ingredient.key || ''}`"
                draggable="true"
                @dragstart="onIngredientDragStart($event, ingredient)"
              >
                {{ ingredient.name }}
              </span>

              <AppCounter
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
import AppCounter from "@/common/components/counter";
import type { Ingredient, IngredientsCounter } from "@/types";

interface Props {
  modelValue: IngredientsCounter;
  ingredientList: Ingredient[];
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

const onIngredientDragStart = (event: DragEvent, ingredient: Ingredient) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData("ingredientId", String(ingredient.id));
    event.dataTransfer.effectAllowed = "copy";
  }
};
</script>

<style lang="scss">
@use "@/assets/scss/blocks/ingredients";
@use "@/assets/scss/blocks/filling";
</style>
