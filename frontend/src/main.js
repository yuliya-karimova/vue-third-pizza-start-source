import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useCartStore, CART_STORAGE_KEY } from "./stores/cart";
import { logger } from "./utils/logger";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Подписка на изменения корзины для автоматического сохранения в localStorage
const cartStore = useCartStore();
cartStore.$subscribe((mutation, state) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
      pizzas: state.pizzas,
      misc: state.misc,
    }));
  } catch (error) {
    logger.error("Ошибка при сохранении корзины в localStorage:", error);
  }
});

app.mount("#app");
