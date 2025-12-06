import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCartStore, CART_STORAGE_KEY } from "../cart";
import type { CartPizza, CartMisc } from "../cart";
import type { Dough, Size, Sauce, Misc } from "@/types";

// Мокаем localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Cart Store", () => {
  beforeEach(() => {
    // Создаем новую pinia для каждого теста
    setActivePinia(createPinia());
    // Очищаем localStorage перед каждым тестом
    localStorage.clear();
  });

  const mockDough: Dough = {
    id: 1,
    name: "Тонкое",
    image: "/img/dough-light.svg",
    description: "Описание",
    price: 300,
    key: "light",
  };

  const mockSize: Size = {
    id: 1,
    name: "23 см",
    image: "/img/diameter.svg",
    multiplier: 1,
    key: "small",
  };

  const mockSauce: Sauce = {
    id: 1,
    name: "Томатный",
    price: 50,
    key: "tomato",
  };

  const mockPizza: Omit<CartPizza, "id" | "quantity"> = {
    name: "Тестовая пицца",
    dough: mockDough,
    size: mockSize,
    sauce: mockSauce,
    ingredients: {},
    price: 350,
  };

  const mockMisc: Misc = {
    id: 1,
    name: "Кола",
    image: "/img/cola.svg",
    price: 56,
  };

  describe("State и Getters", () => {
    it("инициализируется пустой корзиной", () => {
      const cartStore = useCartStore();
      expect(cartStore.pizzas).toEqual([]);
      expect(cartStore.misc).toEqual([]);
      expect(cartStore.isEmpty).toBe(true);
      expect(cartStore.totalPrice).toBe(0);
      expect(cartStore.totalItems).toBe(0);
    });

    it("корректно вычисляет isEmpty", () => {
      const cartStore = useCartStore();
      expect(cartStore.isEmpty).toBe(true);

      cartStore.addPizza(mockPizza);
      expect(cartStore.isEmpty).toBe(false);
    });

    it("корректно вычисляет totalPizzasPrice", () => {
      const cartStore = useCartStore();
      cartStore.addPizza(mockPizza);
      cartStore.updatePizzaQuantity(cartStore.pizzas[0].id, 2);

      expect(cartStore.totalPizzasPrice).toBe(350 * 2);
    });

    it("корректно вычисляет totalMiscPrice", () => {
      const cartStore = useCartStore();
      cartStore.addMisc(mockMisc, 3);

      expect(cartStore.totalMiscPrice).toBe(56 * 3);
    });

    it("корректно вычисляет totalPrice", () => {
      const cartStore = useCartStore();
      cartStore.addPizza(mockPizza);
      cartStore.addMisc(mockMisc, 2);

      expect(cartStore.totalPrice).toBe(350 + 56 * 2);
    });

    it("корректно вычисляет totalItems", () => {
      const cartStore = useCartStore();
      cartStore.addPizza(mockPizza);
      cartStore.updatePizzaQuantity(cartStore.pizzas[0].id, 2);
      cartStore.addMisc(mockMisc, 3);

      expect(cartStore.totalItems).toBe(2 + 3);
    });
  });

  describe("Actions - Пиццы", () => {
    it("добавляет пиццу в корзину", () => {
      const cartStore = useCartStore();
      cartStore.addPizza(mockPizza);

      expect(cartStore.pizzas).toHaveLength(1);
      expect(cartStore.pizzas[0].name).toBe("Тестовая пицца");
      expect(cartStore.pizzas[0].quantity).toBe(1);
      expect(cartStore.pizzas[0].id).toBeDefined();
    });

    it("удаляет пиццу из корзины", () => {
      const cartStore = useCartStore();
      cartStore.addPizza(mockPizza);
      const pizzaId = cartStore.pizzas[0].id;

      cartStore.removePizza(pizzaId);

      expect(cartStore.pizzas).toHaveLength(0);
    });

    it("обновляет количество пиццы", () => {
      const cartStore = useCartStore();
      cartStore.addPizza(mockPizza);
      const pizzaId = cartStore.pizzas[0].id;

      cartStore.updatePizzaQuantity(pizzaId, 3);

      expect(cartStore.pizzas[0].quantity).toBe(3);
    });

    it("не позволяет установить количество меньше 1", () => {
      const cartStore = useCartStore();
      cartStore.addPizza(mockPizza);
      const pizzaId = cartStore.pizzas[0].id;

      cartStore.updatePizzaQuantity(pizzaId, 0);

      expect(cartStore.pizzas[0].quantity).toBeGreaterThanOrEqual(1);
    });

    it("увеличивает количество пиццы", () => {
      const cartStore = useCartStore();
      cartStore.addPizza(mockPizza);
      const pizzaId = cartStore.pizzas[0].id;

      cartStore.increasePizzaQuantity(pizzaId);

      expect(cartStore.pizzas[0].quantity).toBe(2);
    });

    it("уменьшает количество пиццы и удаляет при количестве 1", () => {
      const cartStore = useCartStore();
      cartStore.addPizza(mockPizza);
      const pizzaId = cartStore.pizzas[0].id;

      cartStore.decreasePizzaQuantity(pizzaId);

      expect(cartStore.pizzas).toHaveLength(0);
    });
  });

  describe("Actions - Дополнительные товары", () => {
    it("добавляет дополнительный товар в корзину", () => {
      const cartStore = useCartStore();
      cartStore.addMisc(mockMisc, 2);

      expect(cartStore.misc).toHaveLength(1);
      expect(cartStore.misc[0].quantity).toBe(2);
      expect(cartStore.misc[0].misc.id).toBe(mockMisc.id);
    });

    it("увеличивает количество существующего товара", () => {
      const cartStore = useCartStore();
      cartStore.addMisc(mockMisc, 2);
      cartStore.addMisc(mockMisc, 1);

      expect(cartStore.misc).toHaveLength(1);
      expect(cartStore.misc[0].quantity).toBe(3);
    });

    it("удаляет дополнительный товар", () => {
      const cartStore = useCartStore();
      cartStore.addMisc(mockMisc, 2);
      cartStore.removeMisc(mockMisc.id);

      expect(cartStore.misc).toHaveLength(0);
    });

    it("увеличивает количество дополнительного товара", () => {
      const cartStore = useCartStore();
      cartStore.addMisc(mockMisc, 1);
      cartStore.increaseMiscQuantity(mockMisc.id);

      expect(cartStore.misc[0].quantity).toBe(2);
    });

    it("уменьшает количество дополнительного товара и удаляет при количестве 1", () => {
      const cartStore = useCartStore();
      cartStore.addMisc(mockMisc, 1);
      cartStore.decreaseMiscQuantity(mockMisc.id);

      expect(cartStore.misc).toHaveLength(0);
    });
  });

  describe("Actions - Очистка", () => {
    it("очищает всю корзину", () => {
      const cartStore = useCartStore();
      cartStore.addPizza(mockPizza);
      cartStore.addMisc(mockMisc, 2);

      cartStore.clearCart();

      expect(cartStore.pizzas).toHaveLength(0);
      expect(cartStore.misc).toHaveLength(0);
      expect(cartStore.isEmpty).toBe(true);
    });
  });

  describe("Getters - Поиск", () => {
    it("находит пиццу по ID", () => {
      const cartStore = useCartStore();
      cartStore.addPizza(mockPizza);
      const pizzaId = cartStore.pizzas[0].id;

      const foundPizza = cartStore.getPizzaById(pizzaId);

      expect(foundPizza).toBeDefined();
      expect(foundPizza?.name).toBe("Тестовая пицца");
    });

    it("возвращает undefined для несуществующего ID", () => {
      const cartStore = useCartStore();
      const foundPizza = cartStore.getPizzaById("non-existent-id");

      expect(foundPizza).toBeUndefined();
    });
  });
});

