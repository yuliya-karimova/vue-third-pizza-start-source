<template>
  <main class="layout">
    <div class="layout__sidebar sidebar">
      <router-link to="/" class="logo layout__logo">
        <img src="@/assets/img/logo.svg" alt="V!U!E! Pizza logo" width="90" height="40" />
      </router-link>

      <router-link to="/orders" class="layout__link layout__link--active">История заказов</router-link>
      <router-link to="/profile" class="layout__link">Мои данные</router-link>
    </div>

    <div class="layout__content">
      <div class="layout__title">
        <h1 class="title title--big">История заказов</h1>
      </div>

      <div v-if="error" class="layout__error">
        {{ error }}
      </div>

      <div v-if="isLoading" class="layout__loading">
        Загрузка заказов...
      </div>

      <div v-if="!isLoading && orders.length === 0" class="layout__empty">
        У вас пока нет заказов
      </div>

      <TransitionGroup name="fade-in-up" tag="div">
        <section v-for="order in orders" :key="order.id" class="sheet order">
        <div class="order__wrapper">
          <div class="order__number">
            <b>Заказ #{{ order.id }}</b>
          </div>

          <div class="order__sum">
            <span>Сумма заказа: {{ getOrderTotal(order).toLocaleString("ru-RU") }} ₽</span>
          </div>

          <div class="order__button">
            <button type="button" class="button button--border">Удалить</button>
          </div>
          <div class="order__button">
            <button type="button" class="button">Повторить</button>
          </div>
        </div>

        <ul v-if="order.orderPizzas && order.orderPizzas.length > 0" class="order__list">
          <li v-for="pizza in order.orderPizzas" :key="pizza.id" class="order__item">
            <div class="product">
              <img src="@/assets/img/product.svg" class="product__img" width="56" height="56" :alt="pizza.name" />
              <div class="product__text">
                <h2>{{ pizza.name }}</h2>
                <ul>
                  <li v-for="(part, index) in formatPizzaDescription(pizza)" :key="index">
                    {{ part }}
                  </li>
                </ul>
              </div>
            </div>

            <p class="order__price">
              <span v-if="pizza.quantity > 1">{{ pizza.quantity }}×</span>{{ getPizzaPrice(pizza) / pizza.quantity }} ₽
            </p>
          </li>
        </ul>

        <ul v-if="order.orderMisc && order.orderMisc.length > 0" class="order__additional">
          <li v-for="misc in order.orderMisc" :key="misc.id">
            <img :src="getMiscImageUrl(misc.miscId)" width="20" height="30" :alt="dataStore.getMiscById(misc.miscId)?.name || ''" />
            <p>
              <span>{{ dataStore.getMiscById(misc.miscId)?.name || "Неизвестно" }}</span>
              <b>{{ (dataStore.getMiscById(misc.miscId)?.price || 0) * misc.quantity }} ₽</b>
            </p>
          </li>
        </ul>

        <p class="order__address">Адрес доставки: {{ formatAddress(order) }}</p>
      </section>
      </TransitionGroup>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { OrdersService, API_BASE_URL } from "@/services";
import type { Order, OrderPizza, OrderMisc } from "@/services/orders.service";
import { useAuthStore } from "@/stores/auth";
import { useDataStore } from "@/stores/data";
import { getImageUrl } from "@/utils/images";

const authStore = useAuthStore();
const dataStore = useDataStore();
const ordersService = new OrdersService(API_BASE_URL);

const orders = ref<Order[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await loadOrders();
  }
});

const loadOrders = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    orders.value = await ordersService.findAll();
    // Сортируем заказы по ID в обратном порядке (новые сначала)
    orders.value.sort((a: Order, b: Order) => (b.id || 0) - (a.id || 0));
  } catch (err: any) {
    error.value = err.message || "Ошибка при загрузке заказов";
    console.error("Ошибка загрузки заказов:", err);
  } finally {
    isLoading.value = false;
  }
};

const getPizzaPrice = (pizza: OrderPizza): number => {
  let price = 0;
  
  // Базовая цена: соус + тесто
  const sauce = dataStore.getSauceById(pizza.sauceId);
  const dough = dataStore.getDoughById(pizza.doughId);
  const size = dataStore.getSizeById(pizza.sizeId);
  
  if (sauce && dough && size) {
    const basePrice = sauce.price + dough.price;
    
    // Добавляем цену ингредиентов
    if (pizza.ingredients) {
      pizza.ingredients.forEach((ing: { ingredientId: number; quantity: number }) => {
        const ingredient = dataStore.getIngredientById(ing.ingredientId);
        if (ingredient) {
          price += ingredient.price * ing.quantity;
        }
      });
    }
    
    price += basePrice;
    price = Math.round(size.multiplier * price);
  }
  
  return price * pizza.quantity;
};

const getOrderTotal = (order: Order): number => {
  let total = 0;
  
  if (order.orderPizzas) {
    order.orderPizzas.forEach((pizza: OrderPizza) => {
      total += getPizzaPrice(pizza);
    });
  }
  
  if (order.orderMisc) {
    order.orderMisc.forEach((misc: OrderMisc) => {
      const miscItem = dataStore.getMiscById(misc.miscId);
      if (miscItem) {
        total += miscItem.price * misc.quantity;
      }
    });
  }
  
  return total;
};

const formatPizzaDescription = (pizza: OrderPizza): string[] => {
  const parts: string[] = [];
  
  const size = dataStore.getSizeById(pizza.sizeId);
  const dough = dataStore.getDoughById(pizza.doughId);
  const sauce = dataStore.getSauceById(pizza.sauceId);
  
  if (size && dough) {
    parts.push(`${size.name}, на ${dough.name.toLowerCase()}м тесте`);
  }
  
  if (sauce) {
    parts.push(`Соус: ${sauce.name.toLowerCase()}`);
  }
  
  if (pizza.ingredients && pizza.ingredients.length > 0) {
    const ingredientNames = pizza.ingredients
      .map((ing: { ingredientId: number; quantity: number }) => {
        const ingredient = dataStore.getIngredientById(ing.ingredientId);
        return ingredient ? ingredient.name.toLowerCase() : "";
      })
      .filter(Boolean);
    
    if (ingredientNames.length > 0) {
      parts.push(`Начинка: ${ingredientNames.join(", ")}`);
    }
  }
  
  return parts;
};

const getIngredientImageUrl = (ingredientId: number): string => {
  const ingredient = dataStore.getIngredientById(ingredientId);
  if (!ingredient) return "";
  return getImageUrl(ingredient.image);
};

const getMiscImageUrl = (miscId: number): string => {
  const misc = dataStore.getMiscById(miscId);
  if (!misc) return "";
  return getImageUrl(misc.image);
};

const formatAddress = (order: Order): string => {
  if (!order.orderAddress) return "Адрес не указан";
  
  const addr = order.orderAddress;
  let address = addr.name;
  
  if (addr.street && addr.building) {
    address += ` (${addr.street}, д. ${addr.building}`;
    if (addr.flat) {
      address += `, кв. ${addr.flat}`;
    }
    address += ")";
  }
  
  return address;
};
</script>

<style lang="scss">
@use "@/assets/scss/blocks/title";
@use "@/assets/scss/blocks/button";
@use "@/assets/scss/blocks/product";
@use "@/assets/scss/blocks/order";
@use "@/assets/scss/blocks/logo";
@use "@/assets/scss/layout/layout";
@use "@/assets/scss/layout/sidebar";
</style>

