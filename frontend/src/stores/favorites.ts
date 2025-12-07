import { defineStore } from "pinia";
import { FavoritePizzasService, type FavoritePizza, type CreateFavoritePizzaDto, API_BASE_URL } from "@/services";
import { logger } from "@/utils/logger";

export interface FavoritesState {
  favoritePizzas: FavoritePizza[];
  isLoading: boolean;
  error: string | null;
}

export const useFavoritesStore = defineStore("favorites", {
  state: (): FavoritesState => ({
    favoritePizzas: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    hasFavorites: (state) => state.favoritePizzas.length > 0,
    
    getFavoriteById: (state) => (id: number) => {
      return state.favoritePizzas.find((pizza) => pizza.id === id);
    },
  },

  actions: {
    async loadFavorites() {
      this.isLoading = true;
      this.error = null;

      try {
        const service = new FavoritePizzasService(API_BASE_URL);
        this.favoritePizzas = await service.findAll();
      } catch (error: any) {
        this.error = error.message || "Ошибка при загрузке избранных пицц";
        logger.error("Ошибка загрузки избранных:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async addFavorite(data: CreateFavoritePizzaDto) {
      this.isLoading = true;
      this.error = null;

      try {
        const service = new FavoritePizzasService(API_BASE_URL);
        const favorite = await service.create(data);
        this.favoritePizzas.push(favorite);
        return favorite;
      } catch (error: any) {
        this.error = error.message || "Ошибка при сохранении в избранное";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async removeFavorite(id: number) {
      this.isLoading = true;
      this.error = null;

      try {
        const service = new FavoritePizzasService(API_BASE_URL);
        await service.deleteById(id);
        const index = this.favoritePizzas.findIndex((pizza) => pizza.id === id);
        if (index > -1) {
          this.favoritePizzas.splice(index, 1);
        }
      } catch (error: any) {
        this.error = error.message || "Ошибка при удалении из избранного";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateFavorite(id: number, data: Partial<CreateFavoritePizzaDto>) {
      this.isLoading = true;
      this.error = null;

      try {
        const service = new FavoritePizzasService(API_BASE_URL);
        await service.update(id, data);
        const index = this.favoritePizzas.findIndex((pizza) => pizza.id === id);
        if (index > -1) {
          this.favoritePizzas[index] = {
            ...this.favoritePizzas[index],
            ...data,
          };
        }
      } catch (error: any) {
        this.error = error.message || "Ошибка при обновлении избранного";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    clearFavorites() {
      this.favoritePizzas = [];
      this.error = null;
    },
  },
});

