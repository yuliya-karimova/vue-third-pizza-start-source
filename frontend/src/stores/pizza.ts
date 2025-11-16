import { defineStore } from "pinia";
import type { Dough, Size, Sauce, IngredientsCounter } from "@/types";
import { useDataStore } from "./data";

export interface PizzaState {
  selectedDough: Dough | null;
  selectedSize: Size | null;
  selectedSauce: Sauce | null;
  selectedIngredients: IngredientsCounter;
  pizzaName: string;
}

export const usePizzaStore = defineStore("pizza", {
  state: (): PizzaState => ({
    selectedDough: null,
    selectedSize: null,
    selectedSauce: null,
    selectedIngredients: {},
    pizzaName: "",
  }),

  getters: {
    ingredientsPrice: (state) => {
      return Object.values(state.selectedIngredients).reduce(
        (acc, { count, price }) => acc + count * price,
        0,
      );
    },

    pizzaPrice(): number {
      if (!this.selectedSize || !this.selectedSauce || !this.selectedDough) {
        return 0;
      }

      const basePrice =
        this.selectedSauce.price +
        this.selectedDough.price +
        this.ingredientsPrice;

      return Math.round(this.selectedSize.multiplier * basePrice);
    },

    hasAllRequiredFields: (state) => {
      return !!(
        state.selectedDough &&
        state.selectedSize &&
        state.selectedSauce
      );
    },

    hasIngredients: (state) => {
      return Object.keys(state.selectedIngredients).length > 0;
    },

    totalIngredientsCount: (state) => {
      return Object.values(state.selectedIngredients).reduce(
        (total, { count }) => total + count,
        0,
      );
    },

    isPizzaReady: (state) => {
      return !!(
        state.selectedDough &&
        state.selectedSize &&
        state.selectedSauce &&
        state.pizzaName.trim().length > 0
      );
    },
  },

  actions: {
    initDefaultValues() {
      const dataStore = useDataStore();
      if (dataStore.dough.length > 0 && !this.selectedDough) {
        this.selectedDough = dataStore.dough[0];
      }
      if (dataStore.sizes.length > 0 && !this.selectedSize) {
        this.selectedSize = dataStore.sizes[0];
      }
      if (dataStore.sauces.length > 0 && !this.selectedSauce) {
        this.selectedSauce = dataStore.sauces[0];
      }
    },

    setDough(dough: Dough) {
      this.selectedDough = dough;
    },

    setSize(size: Size) {
      this.selectedSize = size;
    },

    setSauce(sauce: Sauce) {
      this.selectedSauce = sauce;
    },

    setPizzaName(name: string) {
      this.pizzaName = name;
    },

    addIngredient(ingredientId: number, price: number) {
      if (this.selectedIngredients[ingredientId]) {
        this.selectedIngredients[ingredientId].count++;
      } else {
        this.selectedIngredients[ingredientId] = {
          count: 1,
          price,
        };
      }
    },

    removeIngredient(ingredientId: number) {
      if (this.selectedIngredients[ingredientId]) {
        this.selectedIngredients[ingredientId].count--;
        if (this.selectedIngredients[ingredientId].count <= 0) {
          delete this.selectedIngredients[ingredientId];
        }
      }
    },

    setIngredientCount(ingredientId: number, count: number, price: number) {
      if (count <= 0) {
        delete this.selectedIngredients[ingredientId];
      } else {
        this.selectedIngredients[ingredientId] = { count, price };
      }
    },

    increaseIngredientCount(ingredientId: number, price: number) {
      if (this.selectedIngredients[ingredientId]) {
        this.selectedIngredients[ingredientId].count++;
      } else {
        this.selectedIngredients[ingredientId] = {
          count: 1,
          price,
        };
      }
    },

    decreaseIngredientCount(ingredientId: number) {
      if (this.selectedIngredients[ingredientId]) {
        this.selectedIngredients[ingredientId].count--;
        if (this.selectedIngredients[ingredientId].count <= 0) {
          delete this.selectedIngredients[ingredientId];
        }
      }
    },

    resetPizza() {
      this.selectedDough = null;
      this.selectedSize = null;
      this.selectedSauce = null;
      this.selectedIngredients = {};
      this.pizzaName = "";
      this.initDefaultValues();
    },
  },
});

