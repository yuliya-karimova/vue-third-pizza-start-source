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
          <TransitionGroup name="scale" tag="div">
            <div
              v-for="(ingredient, index) in ingredientsForPizza"
              :key="`${ingredient.key}-${index}`"
              :class="[
                'pizza__filling',
                `pizza__filling--${ingredient.key}`,
                ingredient.count === 2 ? 'pizza__filling--second' : '',
                ingredient.count === 3 ? 'pizza__filling--third' : ''
              ]"
            />
          </TransitionGroup>
        </div>
      </div>
    </div>

    <div class="content__result">
      <p>Итого: {{ price }} ₽</p>
      <button
        ref="addToCartButton"
        type="button"
        class="button"
        :class="{ pulse: isReady }"
        :disabled="!isReady"
        @click="onAddToCart"
      >
        Готовьте!
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UiInput from "@/common/components/text-input";
import { flyToCart } from "@/utils/flyToCart";
import productImage from "@/assets/img/product.svg";

interface IngredientDisplay {
  key: string;
  count: number;
}

interface Props {
  modelValue: string;
  sizeKey: string;
  sauceKey: string;
  ingredientsForPizza: IngredientDisplay[];
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

const addToCartButton = ref<HTMLButtonElement | null>(null);

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
      // Проверка на максимум будет в обработчике addIngredient в HomeView
      emit("addIngredient", ingredientId);
    }
  }
};

const onAddToCart = () => {
  if (addToCartButton.value) {
    // Запускаем анимацию полета к корзине
    // Vite обработает импорт SVG как URL-строку
    const imageUrl = typeof productImage === "string" 
      ? productImage 
      : (productImage as any)?.default || (productImage as any)?.src || productImage;
    
    flyToCart(addToCartButton.value, ".header__cart a", {
      duration: 800,
      imageUrl: String(imageUrl),
      onComplete: () => {
        // После завершения анимации добавляем в корзину
        emit("addToCart");
      },
    });
  } else {
    // Если кнопка не найдена, просто добавляем в корзину
    emit("addToCart");
  }
};
</script>

<style lang="scss">
@use "@/assets/scss/blocks/button";
@use "@/assets/scss/blocks/pizza";
</style>
