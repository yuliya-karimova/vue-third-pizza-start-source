<template>
  <main class="content">
    <form action="#" method="post">
      <div class="content__wrapper">
        <h1 class="title title--big">Конструктор пиццы</h1>
        <DoughSelector
          :model-value="pizzaStore.selectedDough"
          :dough-list="dataStore.dough"
          :dough-keys="doughKeys"
          @update:model-value="(dough) => pizzaStore.setDough(dough)"
        />
        <SizeSelector
          :model-value="pizzaStore.selectedSize"
          :size-list="dataStore.sizes"
          :sizes-keys="sizesKeys"
          @update:model-value="(size) => pizzaStore.setSize(size)"
        />

        <IngredientsSelector
          :model-value="pizzaStore.selectedIngredients"
          :ingredient-list="dataStore.ingredients"
          :ingredients-keys="ingredientsKeys"
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
import { computed, onMounted } from "vue";
import saucesKeys from "@/common/data/sauces";
import ingredientsKeys from "@/common/data/ingredients";
import sizesKeys from "@/common/data/sizes";
import doughKeys from "@/common/data/dough";
import { usePizzaStore } from "@/stores/pizza";
import { useDataStore } from "@/stores/data";
import { useCartStore } from "@/stores/cart";
import DoughSelector from "@/modules/constructor/DoughSelector.vue";
import SizeSelector from "@/modules/constructor/SizeSelector.vue";
import IngredientsSelector from "@/modules/constructor/IngredientsSelector.vue";
import SaucesSelector from "@/modules/constructor/SaucesSelector.vue";
import PizzaViewer from "@/modules/constructor/PizzaViewer.vue";

const pizzaStore = usePizzaStore();
const dataStore = useDataStore();
const cartStore = useCartStore();

onMounted(() => {
  pizzaStore.initDefaultValues();
});

const ingredientsForPizza = computed(() => {
  const keys: string[] = [];
  for (const id in pizzaStore.selectedIngredients) {
    const item = pizzaStore.selectedIngredients[id];
    const key = ingredientsKeys[id];
    for (let i = 0; i < item.count; i++) {
      keys.push(key);
    }
  }
  return keys;
});

const currentSizeKey = computed(() => {
  if (!pizzaStore.selectedSize) return "";
  return sizesKeys[pizzaStore.selectedSize.id];
});

const currentSauceKey = computed(() => {
  if (!pizzaStore.selectedSauce) return "";
  return saucesKeys[pizzaStore.selectedSauce.id];
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
