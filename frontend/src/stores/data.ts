import { defineStore } from "pinia";
import type { Dough, Size, Sauce, Ingredient, Misc } from "@/types";
import doughJson from "@/mocks/dough.json";
import sizesJson from "@/mocks/sizes.json";
import saucesJson from "@/mocks/sauces.json";
import ingredientsJson from "@/mocks/ingredients.json";
import miscJson from "@/mocks/misc.json";

export const useDataStore = defineStore("data", {
  state: () => ({
    dough: doughJson as Dough[],
    sizes: sizesJson as Size[],
    sauces: saucesJson as Sauce[],
    ingredients: ingredientsJson as Ingredient[],
    misc: miscJson as Misc[],
  }),

  getters: {
    getDoughById: (state) => (id: number) => {
      return state.dough.find((d) => d.id === id);
    },
    getSizeById: (state) => (id: number) => {
      return state.sizes.find((s) => s.id === id);
    },
    getSauceById: (state) => (id: number) => {
      return state.sauces.find((s) => s.id === id);
    },
    getIngredientById: (state) => (id: number) => {
      return state.ingredients.find((i) => i.id === id);
    },
    getMiscById: (state) => (id: number) => {
      return state.misc.find((m) => m.id === id);
    },
  },
});

