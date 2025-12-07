import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { usePizzaStore } from "../pizza";
import { useDataStore } from "../data";
import type { Dough, Size, Sauce } from "@/types";

describe("Pizza Store", () => {
  const mockDough: Dough[] = [
    {
      id: 1,
      name: "Тонкое",
      image: "/img/dough-light.svg",
      description: "Описание",
      price: 300,
      key: "light",
    },
    {
      id: 2,
      name: "Толстое",
      image: "/img/dough-large.svg",
      description: "Описание",
      price: 300,
      key: "large",
    },
  ];

  const mockSizes: Size[] = [
    {
      id: 1,
      name: "23 см",
      image: "/img/diameter.svg",
      multiplier: 1,
      key: "small",
    },
    {
      id: 2,
      name: "32 см",
      image: "/img/diameter.svg",
      multiplier: 2,
      key: "normal",
    },
  ];

  const mockSauces: Sauce[] = [
    {
      id: 1,
      name: "Томатный",
      price: 50,
      key: "tomato",
    },
    {
      id: 2,
      name: "Сливочный",
      price: 50,
      key: "creamy",
    },
  ];

  beforeEach(() => {
    // Создаем новую pinia для каждого теста
    const pinia = createPinia();
    setActivePinia(pinia);

    // Заполняем dataStore моковыми данными
    const dataStore = useDataStore();
    dataStore.dough = mockDough;
    dataStore.sizes = mockSizes;
    dataStore.sauces = mockSauces;
  });

  describe("State и Getters", () => {
    it("инициализируется пустым состоянием", () => {
      const pizzaStore = usePizzaStore();

      expect(pizzaStore.selectedDough).toBeNull();
      expect(pizzaStore.selectedSize).toBeNull();
      expect(pizzaStore.selectedSauce).toBeNull();
      expect(pizzaStore.selectedIngredients).toEqual({});
      expect(pizzaStore.pizzaName).toBe("");
    });

    it("корректно вычисляет ingredientsPrice", () => {
      const pizzaStore = usePizzaStore();

      pizzaStore.selectedIngredients = {
        1: { count: 2, price: 33 },
        2: { count: 1, price: 50 },
      };

      expect(pizzaStore.ingredientsPrice).toBe(2 * 33 + 1 * 50);
    });

    it("корректно вычисляет pizzaPrice", () => {
      const pizzaStore = usePizzaStore();
      pizzaStore.setDough(mockDough[0]);
      pizzaStore.setSize(mockSizes[1]); // multiplier: 2
      pizzaStore.setSauce(mockSauces[0]);

      // Базовая цена: dough (300) + sauce (50) = 350
      // Умноженная на multiplier (2) = 700
      expect(pizzaStore.pizzaPrice).toBe(700);
    });

    it("возвращает 0 для pizzaPrice если не выбраны обязательные поля", () => {
      const pizzaStore = usePizzaStore();
      pizzaStore.setDough(mockDough[0]);
      // Не выбраны size и sauce

      expect(pizzaStore.pizzaPrice).toBe(0);
    });

    it("корректно вычисляет pizzaPrice с ингредиентами", () => {
      const pizzaStore = usePizzaStore();
      pizzaStore.setDough(mockDough[0]);
      pizzaStore.setSize(mockSizes[0]); // multiplier: 1
      pizzaStore.setSauce(mockSauces[0]);

      pizzaStore.selectedIngredients = {
        1: { count: 2, price: 33 },
      };

      // Базовая цена: dough (300) + sauce (50) + ingredients (66) = 416
      // Умноженная на multiplier (1) = 416, округлено = 416
      expect(pizzaStore.pizzaPrice).toBe(416);
    });

    it("корректно проверяет hasAllRequiredFields", () => {
      const pizzaStore = usePizzaStore();

      expect(pizzaStore.hasAllRequiredFields).toBe(false);

      pizzaStore.setDough(mockDough[0]);
      pizzaStore.setSize(mockSizes[0]);
      pizzaStore.setSauce(mockSauces[0]);

      expect(pizzaStore.hasAllRequiredFields).toBe(true);
    });

    it("корректно проверяет hasIngredients", () => {
      const pizzaStore = usePizzaStore();

      expect(pizzaStore.hasIngredients).toBe(false);

      pizzaStore.selectedIngredients = {
        1: { count: 1, price: 33 },
      };

      expect(pizzaStore.hasIngredients).toBe(true);
    });

    it("корректно вычисляет totalIngredientsCount", () => {
      const pizzaStore = usePizzaStore();

      pizzaStore.selectedIngredients = {
        1: { count: 2, price: 33 },
        2: { count: 3, price: 50 },
      };

      expect(pizzaStore.totalIngredientsCount).toBe(5);
    });

    it("корректно проверяет isPizzaReady", () => {
      const pizzaStore = usePizzaStore();

      expect(pizzaStore.isPizzaReady).toBe(false);

      pizzaStore.setDough(mockDough[0]);
      pizzaStore.setSize(mockSizes[0]);
      pizzaStore.setSauce(mockSauces[0]);
      pizzaStore.setPizzaName("Моя пицца");

      expect(pizzaStore.isPizzaReady).toBe(true);
    });

    it("возвращает false для isPizzaReady если имя пустое", () => {
      const pizzaStore = usePizzaStore();

      pizzaStore.setDough(mockDough[0]);
      pizzaStore.setSize(mockSizes[0]);
      pizzaStore.setSauce(mockSauces[0]);
      pizzaStore.setPizzaName("   "); // только пробелы

      expect(pizzaStore.isPizzaReady).toBe(false);
    });
  });

  describe("Actions", () => {
    it("устанавливает тесто", () => {
      const pizzaStore = usePizzaStore();

      pizzaStore.setDough(mockDough[0]);

      expect(pizzaStore.selectedDough).toEqual(mockDough[0]);
    });

    it("устанавливает размер", () => {
      const pizzaStore = usePizzaStore();

      pizzaStore.setSize(mockSizes[0]);

      expect(pizzaStore.selectedSize).toEqual(mockSizes[0]);
    });

    it("устанавливает соус", () => {
      const pizzaStore = usePizzaStore();

      pizzaStore.setSauce(mockSauces[0]);

      expect(pizzaStore.selectedSauce).toEqual(mockSauces[0]);
    });

    it("устанавливает имя пиццы", () => {
      const pizzaStore = usePizzaStore();

      pizzaStore.setPizzaName("Название пиццы");

      expect(pizzaStore.pizzaName).toBe("Название пиццы");
    });

    it("добавляет ингредиент", () => {
      const pizzaStore = usePizzaStore();

      pizzaStore.addIngredient(1, 33);

      expect(pizzaStore.selectedIngredients[1]).toEqual({ count: 1, price: 33 });
    });

    it("увеличивает количество существующего ингредиента", () => {
      const pizzaStore = usePizzaStore();
      pizzaStore.addIngredient(1, 33);
      pizzaStore.addIngredient(1, 33);

      expect(pizzaStore.selectedIngredients[1].count).toBe(2);
    });

    it("не добавляет ингредиент если достигнут максимум (3)", () => {
      const pizzaStore = usePizzaStore();
      pizzaStore.addIngredient(1, 33);
      pizzaStore.addIngredient(1, 33);
      pizzaStore.addIngredient(1, 33);
      pizzaStore.addIngredient(1, 33); // Попытка добавить 4-й раз

      expect(pizzaStore.selectedIngredients[1].count).toBe(3);
    });

    it("удаляет ингредиент", () => {
      const pizzaStore = usePizzaStore();
      pizzaStore.selectedIngredients = {
        1: { count: 2, price: 33 },
      };

      pizzaStore.removeIngredient(1);

      expect(pizzaStore.selectedIngredients[1].count).toBe(1);
    });

    it("удаляет ингредиент из списка если количество становится 0", () => {
      const pizzaStore = usePizzaStore();
      pizzaStore.selectedIngredients = {
        1: { count: 1, price: 33 },
      };

      pizzaStore.removeIngredient(1);

      expect(pizzaStore.selectedIngredients[1]).toBeUndefined();
    });

    it("устанавливает количество ингредиента", () => {
      const pizzaStore = usePizzaStore();

      pizzaStore.setIngredientCount(1, 3, 33);

      expect(pizzaStore.selectedIngredients[1]).toEqual({ count: 3, price: 33 });
    });

    it("удаляет ингредиент если количество <= 0", () => {
      const pizzaStore = usePizzaStore();
      pizzaStore.selectedIngredients = {
        1: { count: 1, price: 33 },
      };

      pizzaStore.setIngredientCount(1, 0, 33);

      expect(pizzaStore.selectedIngredients[1]).toBeUndefined();
    });

    it("сбрасывает состояние пиццы и устанавливает значения по умолчанию", () => {
      const pizzaStore = usePizzaStore();
      pizzaStore.setDough(mockDough[1]);
      pizzaStore.setSize(mockSizes[1]);
      pizzaStore.setSauce(mockSauces[1]);
      pizzaStore.setPizzaName("Тест");
      pizzaStore.selectedIngredients = { 1: { count: 1, price: 33 } };

      pizzaStore.resetPizza();

      // После resetPizza вызывается initDefaultValues, который устанавливает первые значения из dataStore
      expect(pizzaStore.selectedDough).toEqual(mockDough[0]);
      expect(pizzaStore.selectedSize).toEqual(mockSizes[0]);
      expect(pizzaStore.selectedSauce).toEqual(mockSauces[0]);
      expect(pizzaStore.selectedIngredients).toEqual({});
      expect(pizzaStore.pizzaName).toBe("");
    });
  });
});

