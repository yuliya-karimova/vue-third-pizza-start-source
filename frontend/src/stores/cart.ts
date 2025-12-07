import { defineStore } from "pinia";
import type { Dough, Size, Sauce, IngredientsCounter, Misc } from "@/types";
import { logger } from "@/utils/logger";

export interface CartPizza {
  id: string; // уникальный ID для пиццы в корзине
  name: string;
  dough: Dough;
  size: Size;
  sauce: Sauce;
  ingredients: IngredientsCounter;
  quantity: number;
  price: number;
}

export interface CartMisc {
  misc: Misc;
  quantity: number;
}

export interface CartState {
  pizzas: CartPizza[];
  misc: CartMisc[];
}

export const CART_STORAGE_KEY = "cart";

const loadCartFromStorage = (): CartState => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        pizzas: parsed.pizzas || [],
        misc: parsed.misc || [],
      };
    }
  } catch (error) {
    logger.error("Ошибка при загрузке корзины из localStorage:", error);
  }
  return {
    pizzas: [],
    misc: [],
  };
};

const saveCartToStorage = (state: CartState) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    logger.error("Ошибка при сохранении корзины в localStorage:", error);
  }
};

export const useCartStore = defineStore("cart", {
  state: (): CartState => {
    return loadCartFromStorage();
  },

  getters: {
    totalPizzasPrice: (state) => {
      return state.pizzas.reduce(
        (total, pizza) => total + pizza.price * pizza.quantity,
        0,
      );
    },

    totalMiscPrice: (state) => {
      return state.misc.reduce(
        (total, item) => total + item.misc.price * item.quantity,
        0,
      );
    },

    totalPrice(): number {
      return this.totalPizzasPrice + this.totalMiscPrice;
    },

    totalItems: (state) => {
      const pizzasCount = state.pizzas.reduce(
        (total, pizza) => total + pizza.quantity,
        0,
      );
      const miscCount = state.misc.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      return pizzasCount + miscCount;
    },

    totalPizzasCount: (state) => {
      return state.pizzas.reduce(
        (total, pizza) => total + pizza.quantity,
        0,
      );
    },

    totalMiscCount: (state) => {
      return state.misc.reduce(
        (total, item) => total + item.quantity,
        0,
      );
    },

    isEmpty: (state) => {
      return state.pizzas.length === 0 && state.misc.length === 0;
    },

    hasPizzas: (state) => state.pizzas.length > 0,

    hasMisc: (state) => state.misc.length > 0,

    getPizzaById: (state) => (id: string) => {
      return state.pizzas.find((p) => p.id === id);
    },
  },

  actions: {
    addPizza(pizza: Omit<CartPizza, "id" | "quantity">) {
      const id = `pizza-${Date.now()}-${Math.random()}`;
      this.pizzas.push({
        ...pizza,
        id,
        quantity: 1,
      });
    },

    removePizza(pizzaId: string) {
      const index = this.pizzas.findIndex((p) => p.id === pizzaId);
      if (index !== -1) {
        this.pizzas.splice(index, 1);
      }
    },

    updatePizzaQuantity(pizzaId: string, quantity: number) {
      const pizza = this.pizzas.find((p) => p.id === pizzaId);
      if (pizza) {
        pizza.quantity = Math.max(1, quantity);
      }
    },

    increasePizzaQuantity(pizzaId: string) {
      const pizza = this.pizzas.find((p) => p.id === pizzaId);
      if (pizza) {
        pizza.quantity++;
      }
    },

    decreasePizzaQuantity(pizzaId: string) {
      const pizza = this.pizzas.find((p) => p.id === pizzaId);
      if (pizza) {
        if (pizza.quantity > 1) {
          pizza.quantity--;
        } else {
          this.removePizza(pizzaId);
        }
      }
    },

    addMisc(misc: Misc, quantity: number = 1) {
      const existingItem = this.misc.find((item) => item.misc.id === misc.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.misc.push({ misc, quantity });
      }
    },

    removeMisc(miscId: number) {
      const index = this.misc.findIndex((item) => item.misc.id === miscId);
      if (index !== -1) {
        this.misc.splice(index, 1);
      }
    },

    updateMiscQuantity(miscId: number, quantity: number) {
      const item = this.misc.find((item) => item.misc.id === miscId);
      if (item) {
        if (quantity <= 0) {
          this.removeMisc(miscId);
        } else {
          item.quantity = quantity;
        }
      }
    },

    increaseMiscQuantity(miscId: number) {
      const item = this.misc.find((item) => item.misc.id === miscId);
      if (item) {
        item.quantity++;
      }
    },

    decreaseMiscQuantity(miscId: number) {
      const item = this.misc.find((item) => item.misc.id === miscId);
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          this.removeMisc(miscId);
        }
      }
    },

    clearCart() {
      this.pizzas = [];
      this.misc = [];
    },
  },
});

