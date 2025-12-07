<template>
  <main class="layout">
    <div class="layout__sidebar sidebar">
      <router-link to="/orders" :class="['layout__link', { 'layout__link--active': $route.path === '/orders' }]">История заказов</router-link>
      <router-link to="/profile" :class="['layout__link', { 'layout__link--active': $route.path === '/profile' }]">Мои данные</router-link>
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
            <button type="button" class="button button--border" @click="deleteOrder(order)">Удалить</button>
          </div>
          <div class="order__button">
            <button type="button" class="button" @click="repeatOrder(order)">Повторить</button>
          </div>
        </div>

        <ul v-if="order.orderPizzas && order.orderPizzas.length > 0" class="order__list">
          <li v-for="pizza in order.orderPizzas" :key="pizza.id" class="order__item">
            <div class="product">
              <div class="product__img product__img--pizza">
                <div :class="`pizza pizza--foundation--${getOrderPizzaSizeKey(pizza)}-${getOrderPizzaSauceKey(pizza)}`">
                  <div class="pizza__wrapper">
                    <div
                      v-for="(ingredient, index) in getOrderPizzaIngredientsKeys(pizza)"
                      :key="`${ingredient.key}-${index}`"
                      :class="[
                        'pizza__filling',
                        `pizza__filling--${ingredient.key}`,
                        ingredient.count === 2 ? 'pizza__filling--second' : '',
                        ingredient.count === 3 ? 'pizza__filling--third' : ''
                      ]"
                    />
                  </div>
                </div>
              </div>
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
              <b>
                <span v-if="misc.quantity > 1">{{ misc.quantity }}×{{ dataStore.getMiscById(misc.miscId)?.price || 0 }}=</span>{{ (dataStore.getMiscById(misc.miscId)?.price || 0) * misc.quantity }} ₽
              </b>
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
import { useRouter } from "vue-router";
import { OrdersService, API_BASE_URL } from "@/services";
import type { Order, OrderPizza, OrderMisc } from "@/services/orders.service";
import { useAuthStore } from "@/stores/auth";
import { useDataStore } from "@/stores/data";
import { useCartStore } from "@/stores/cart";
import { getImageUrl } from "@/utils/images";

const router = useRouter();
const authStore = useAuthStore();
const dataStore = useDataStore();
const cartStore = useCartStore();
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

// Получаем ключ размера для визуализации пиццы из заказа
const getOrderPizzaSizeKey = (pizza: OrderPizza): string => {
  const size = dataStore.getSizeById(pizza.sizeId);
  return size?.key || "";
};

// Получаем ключ соуса для визуализации пиццы из заказа
const getOrderPizzaSauceKey = (pizza: OrderPizza): string => {
  const sauce = dataStore.getSauceById(pizza.sauceId);
  return sauce?.key || "";
};

// Получаем массив объектов ингредиентов для визуализации пиццы из заказа (с правильными классами --second и --third)
const getOrderPizzaIngredientsKeys = (pizza: OrderPizza): Array<{ key: string; count: number }> => {
  const ingredients: Array<{ key: string; count: number }> = [];
  if (pizza.ingredients && pizza.ingredients.length > 0) {
    pizza.ingredients.forEach((ing: { ingredientId: number; quantity: number }) => {
      const ingredient = dataStore.getIngredientById(ing.ingredientId);
      const key = ingredient?.key;
      if (key && ing.quantity > 0) {
        ingredients.push({ key, count: ing.quantity });
      }
    });
  }
  return ingredients;
};

const formatAddress = (order: Order): string => {
  if (!order.orderAddress) {
    // Проверяем, есть ли адрес в заказе, но с именем "Самовывоз" или пустыми полями
    // Если addressId не указан, значит самовывоз
    if (!order.addressId) {
      return "Самовывоз";
    }
    return "Адрес не указан";
  }
  
  const addr = order.orderAddress;
  
  // Если адрес называется "Самовывоз" или имеет пустые поля street/building
  if (addr.name === "Самовывоз" || (addr.street === "-" && addr.building === "-")) {
    return "Самовывоз";
  }
  
  let address = addr.name;
  
  if (addr.street && addr.building && addr.street !== "-" && addr.building !== "-") {
    address += ` (${addr.street}, д. ${addr.building}`;
    if (addr.flat) {
      address += `, кв. ${addr.flat}`;
    }
    address += ")";
  }
  
  return address;
};

const repeatOrder = (order: Order) => {
  if (!order.orderPizzas && (!order.orderMisc || order.orderMisc.length === 0)) {
    alert("Заказ пустой, нечего повторять");
    return;
  }

  // Добавляем пиццы из заказа в корзину
  if (order.orderPizzas && order.orderPizzas.length > 0) {
    order.orderPizzas.forEach((pizza: OrderPizza) => {
      const dough = dataStore.getDoughById(pizza.doughId);
      const size = dataStore.getSizeById(pizza.sizeId);
      const sauce = dataStore.getSauceById(pizza.sauceId);

      if (!dough || !size || !sauce) {
        console.warn(`Не найдены данные для пиццы: dough=${pizza.doughId}, size=${pizza.sizeId}, sauce=${pizza.sauceId}`);
        return;
      }

      // Формируем объект ингредиентов
      const ingredients: Record<number, { count: number; price: number }> = {};
      if (pizza.ingredients && pizza.ingredients.length > 0) {
        pizza.ingredients.forEach((ing: { ingredientId: number; quantity: number }) => {
          const ingredient = dataStore.getIngredientById(ing.ingredientId);
          if (ingredient) {
            ingredients[ing.ingredientId] = {
              count: ing.quantity,
              price: ingredient.price,
            };
          }
        });
      }

      // Рассчитываем цену пиццы
      let price = sauce.price + dough.price;
      Object.values(ingredients).forEach((ing) => {
        price += ing.price * ing.count;
      });
      price = Math.round(size.multiplier * price);

      // Добавляем пиццу в корзину
      cartStore.addPizza({
        name: pizza.name,
        dough,
        size,
        sauce,
        ingredients,
        price,
      });
      
      // Устанавливаем правильное количество для только что добавленной пиццы
      // Находим последнюю добавленную пиццу с таким же содержимым
      const addedPizza = cartStore.pizzas[cartStore.pizzas.length - 1];
      if (addedPizza && pizza.quantity > 1) {
        cartStore.updatePizzaQuantity(addedPizza.id, pizza.quantity);
      }
    });
  }

  // Добавляем дополнительные товары (misc) из заказа в корзину
  if (order.orderMisc && order.orderMisc.length > 0) {
    order.orderMisc.forEach((miscOrder: OrderMisc) => {
      const misc = dataStore.getMiscById(miscOrder.miscId);
      if (misc) {
        cartStore.addMisc(misc, miscOrder.quantity);
      }
    });
  }

  // Переходим на страницу корзины
  router.push("/cart");
};

const deleteOrder = async (order: Order) => {
  if (!order.id) {
    return;
  }

  if (!confirm(`Вы уверены, что хотите удалить заказ #${order.id}?`)) {
    return;
  }

  try {
    await ordersService.deleteById(order.id);
    // Удаляем заказ из списка
    const index = orders.value.findIndex((o) => o.id === order.id);
    if (index !== -1) {
      orders.value.splice(index, 1);
    }
  } catch (error: any) {
    console.error("Ошибка при удалении заказа:", error);
    const errorMessage = error.response?.data?.error?.message 
      || error.response?.data?.message
      || error.message
      || "Произошла ошибка при удалении заказа";
    alert(errorMessage);
  }
};
</script>

<style lang="scss">
@use "@/assets/scss/blocks/title";
@use "@/assets/scss/blocks/button";
@use "@/assets/scss/blocks/product";
@use "@/assets/scss/blocks/pizza";
@use "@/assets/scss/blocks/order";
@use "@/assets/scss/blocks/logo";
@use "@/assets/scss/layout/layout";
@use "@/assets/scss/layout/sidebar";
</style>

