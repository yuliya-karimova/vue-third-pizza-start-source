<template>
  <main class="content">
    <LoadingSpinner 
      v-if="dataStore.isLoading" 
      :visible="dataStore.isLoading"
      size="large"
      message="Загрузка данных..."
      overlay
    />
    <form v-else action="#" method="post">
      <div class="content__wrapper">
        <h1 class="title title--big">Конструктор пиццы</h1>
        <DoughSelector
          :model-value="pizzaStore.selectedDough"
          :dough-list="dataStore.dough"
          @update:model-value="(dough) => pizzaStore.setDough(dough)"
        />
        <SizeSelector
          :model-value="pizzaStore.selectedSize"
          :size-list="dataStore.sizes"
          @update:model-value="(size) => pizzaStore.setSize(size)"
        />

        <IngredientsSelector
          :model-value="pizzaStore.selectedIngredients"
          :ingredient-list="dataStore.ingredients"
          @update:model-value="updateIngredients"
        >
          <SaucesSelector
            :model-value="pizzaStore.selectedSauce"
            :sauce-list="dataStore.sauces"
            @update:model-value="(sauce) => pizzaStore.setSauce(sauce)"
          />
        </IngredientsSelector>

        <PizzaViewer
          :model-value="pizzaStore.pizzaName"
          :size-key="currentSizeKey"
          :sauce-key="currentSauceKey"
          :ingredients-for-pizza="ingredientsForPizza"
          :price="pizzaStore.pizzaPrice"
          :is-ready="pizzaStore.isPizzaReady"
          @update:model-value="pizzaStore.setPizzaName"
          @add-ingredient="onAddIngredient"
          @add-to-cart="onAddToCart"
        />
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { usePizzaStore } from "@/stores/pizza";
import { useDataStore } from "@/stores/data";
import { useCartStore } from "@/stores/cart";
import DoughSelector from "@/modules/constructor/DoughSelector.vue";
import SizeSelector from "@/modules/constructor/SizeSelector.vue";
import IngredientsSelector from "@/modules/constructor/IngredientsSelector.vue";
import SaucesSelector from "@/modules/constructor/SaucesSelector.vue";
import PizzaViewer from "@/modules/constructor/PizzaViewer.vue";
import { LoadingSpinner } from "@/common/components/loading-spinner";

const pizzaStore = usePizzaStore();
const dataStore = useDataStore();
const cartStore = useCartStore();

onMounted(() => {
  if (dataStore.isDataLoaded) {
    pizzaStore.initDefaultValues();
  }
});

watch(
  () => dataStore.isDataLoaded,
  (isLoaded) => {
    if (isLoaded && !pizzaStore.selectedDough && !pizzaStore.selectedSize && !pizzaStore.selectedSauce) {
      pizzaStore.initDefaultValues();
    }
  }
);

// Формируем массив объектов ингредиентов для отображения с правильными классами
const ingredientsForPizza = computed(() => {
  const ingredients: Array<{ key: string; count: number }> = [];
  for (const id in pizzaStore.selectedIngredients) {
    const item = pizzaStore.selectedIngredients[id];
    const ingredient = dataStore.getIngredientById(Number(id));
    const key = ingredient?.key;
    if (key && item.count > 0) {
      ingredients.push({ key, count: item.count });
    }
  }
  return ingredients;
});

const currentSizeKey = computed(() => {
  if (!pizzaStore.selectedSize) return "";
  return pizzaStore.selectedSize.key || "";
});

const currentSauceKey = computed(() => {
  if (!pizzaStore.selectedSauce) return "";
  return pizzaStore.selectedSauce.key || "";
});

const updateIngredients = (ingredients: Record<number, { count: number; price: number }>) => {
  for (const id in ingredients) {
    const { count, price } = ingredients[id];
    pizzaStore.setIngredientCount(Number(id), count, price);
  }
  for (const id in pizzaStore.selectedIngredients) {
    if (!ingredients[Number(id)]) {
      pizzaStore.setIngredientCount(Number(id), 0, 0);
    }
  }
};

const onAddIngredient = (ingredientId: number) => {
  // Проверяем, не достиг ли ингредиент максимума (3)
  const currentCount = pizzaStore.selectedIngredients[ingredientId]?.count || 0;
  if (currentCount >= 3) {
    return; // Блокируем добавление если достигнут максимум
  }
  
  const ingredient = dataStore.getIngredientById(ingredientId);
  if (ingredient) {
    pizzaStore.addIngredient(ingredientId, ingredient.price);
  }
};

const onAddToCart = () => {
  if (!pizzaStore.selectedDough || !pizzaStore.selectedSize || !pizzaStore.selectedSauce) {
    return;
  }

  cartStore.addPizza({
    name: pizzaStore.pizzaName || "Пицца",
    dough: pizzaStore.selectedDough,
    size: pizzaStore.selectedSize,
    sauce: pizzaStore.selectedSauce,
    ingredients: pizzaStore.selectedIngredients,
    price: pizzaStore.pizzaPrice,
  });

  pizzaStore.resetPizza();
};
</script>

<style lang="scss">
@use "@/assets/scss/blocks/title";
</style>
