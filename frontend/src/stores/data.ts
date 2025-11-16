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
    isDataLoaded: (state) => {
      return (
        state.dough.length > 0 &&
        state.sizes.length > 0 &&
        state.sauces.length > 0 &&
        state.ingredients.length > 0 &&
        state.misc.length > 0
      );
    },
    hasData: (state) => {
      return (
        state.dough.length > 0 ||
        state.sizes.length > 0 ||
        state.sauces.length > 0 ||
        state.ingredients.length > 0 ||
        state.misc.length > 0
      );
    },
  },

  actions: {
    setDough(dough: Dough[]) {
      this.dough = dough;
    },

    setSizes(sizes: Size[]) {
      this.sizes = sizes;
    },

    setSauces(sauces: Sauce[]) {
      this.sauces = sauces;
    },

    setIngredients(ingredients: Ingredient[]) {
      this.ingredients = ingredients;
    },

    setMisc(misc: Misc[]) {
      this.misc = misc;
    },

    setAllData(data: {
      dough: Dough[];
      sizes: Size[];
      sauces: Sauce[];
      ingredients: Ingredient[];
      misc: Misc[];
    }) {
      this.dough = data.dough;
      this.sizes = data.sizes;
      this.sauces = data.sauces;
      this.ingredients = data.ingredients;
      this.misc = data.misc;
    },
  },
});

