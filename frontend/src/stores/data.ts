import { defineStore } from "pinia";
import type { Dough, Size, Sauce, Ingredient, Misc } from "@/types";
import {
  DoughService,
  SizesService,
  SaucesService,
  IngredientsService,
  MiscService,
  API_BASE_URL,
} from "@/services";
import { logger } from "@/utils/logger";

export const useDataStore = defineStore("data", {
  state: () => ({
    dough: [] as Dough[],
    sizes: [] as Size[],
    sauces: [] as Sauce[],
    ingredients: [] as Ingredient[],
    misc: [] as Misc[],
    isLoading: false,
    error: null as string | null,
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
    async loadAllData() {
      this.isLoading = true;
      this.error = null;

      try {
        const [dough, sizes, sauces, ingredients, misc] = await Promise.all([
          new DoughService(API_BASE_URL).findAll(),
          new SizesService(API_BASE_URL).findAll(),
          new SaucesService(API_BASE_URL).findAll(),
          new IngredientsService(API_BASE_URL).findAll(),
          new MiscService(API_BASE_URL).findAll(),
        ]);

        this.dough = dough;
        this.sizes = sizes;
        this.sauces = sauces;
        this.ingredients = ingredients;
        this.misc = misc;
      } catch (error: any) {
        this.error = error.message || "Ошибка при загрузке данных";
        logger.error("Ошибка загрузки данных:", error);
      } finally {
        this.isLoading = false;
      }
    },

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

