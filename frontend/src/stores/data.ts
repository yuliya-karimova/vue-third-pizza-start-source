import { defineStore } from "pinia";
import type { Dough, Size, Sauce, Ingredient, Misc } from "@/types";

export const useDataStore = defineStore("data", {
  state: () => ({
    dough: [] as Dough[],
    sizes: [] as Size[],
    sauces: [] as Sauce[],
    ingredients: [] as Ingredient[],
    misc: [] as Misc[],
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

