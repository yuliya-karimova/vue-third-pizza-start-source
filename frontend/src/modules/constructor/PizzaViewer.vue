<template>
  <div class="content__pizza">
    <UiInput
      :model-value="modelValue"
      label="Название пиццы"
      name="pizza_name"
      placeholder="Введите название пиццы"
      @update:model-value="onNameInput"
    />

    <div
      class="content__constructor"
      @dragover.prevent="onPizzaDragOver"
      @drop="onPizzaDrop"
    >
      <div :class="`pizza pizza--foundation--${sizeKey}-${sauceKey}`">
        <div class="pizza__wrapper">
          <div
            v-for="(key, index) in ingredientsForPizza"
            :key="`${key}-${index}`"
            :class="`pizza__filling pizza__filling--${key}`"
          />
        </div>
      </div>
    </div>

    <div class="content__result">
      <p>Итого: {{ price }} ₽</p>
      <button
        type="button"
        class="button"
        :disabled="!isReady"
        @click="onAddToCart"
      >
        Готовьте!
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiInput from "@/common/components/text-input";

interface Props {
  modelValue: string;
  sizeKey: string;
  sauceKey: string;
  ingredientsForPizza: string[];
  price: number;
  isReady?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isReady: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "addIngredient", ingredientId: number): void;
  (e: "addToCart"): void;
}>();

const onNameInput = (value: string) => {
  emit("update:modelValue", value);
};

const onPizzaDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "copy";
  }
};

const onPizzaDrop = (event: DragEvent) => {
  event.preventDefault();

  if (event.dataTransfer) {
    const ingredientId = Number(event.dataTransfer.getData("ingredientId"));

    if (!isNaN(ingredientId) && ingredientId > 0) {
      emit("addIngredient", ingredientId);
    }
  }
};

const onAddToCart = () => {
  emit("addToCart");
};
</script>

<style lang="scss">
@use "@/assets/scss/blocks/button";
@use "@/assets/scss/blocks/pizza";
</style>
