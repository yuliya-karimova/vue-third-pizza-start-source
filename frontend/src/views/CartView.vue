<template>
  <form @submit.prevent="handleSubmit" class="layout-form">
    <main class="content cart">
      <div class="container">
        <div class="cart__title">
          <h1 class="title title--big">Корзина</h1>
        </div>

        <div v-if="cartStore.isEmpty" class="sheet cart__empty">
          <p>В корзине нет ни одного товара</p>
        </div>

        <TransitionGroup v-else name="fade-in-up" tag="ul" class="cart-list sheet">
          <li v-for="pizza in cartStore.pizzas" :key="pizza.id" class="cart-list__item">
            <div class="product cart-list__product">
              <img src="@/assets/img/product.svg" class="product__img" width="56" height="56" :alt="pizza.name" />
              <div class="product__text">
                <h2>{{ pizza.name }}</h2>
                <ul>
                  <li>{{ getPizzaDescription(pizza) }}</li>
                  <li>Соус: {{ pizza.sauce.name }}</li>
                  <li v-if="getIngredientsList(pizza).length > 0">
                    Начинка: {{ getIngredientsList(pizza).join(", ") }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="counter cart-list__counter">
              <button
                type="button"
                class="counter__button counter__button--minus"
                @click="cartStore.decreasePizzaQuantity(pizza.id)"
              >
                <span class="visually-hidden">Меньше</span>
              </button>
              <input
                type="text"
                name="counter"
                class="counter__input"
                :value="pizza.quantity"
                readonly
              />
              <button
                type="button"
                class="counter__button counter__button--plus counter__button--orange"
                @click="cartStore.increasePizzaQuantity(pizza.id)"
              >
                <span class="visually-hidden">Больше</span>
              </button>
            </div>

            <div class="cart-list__price">
              <b>{{ pizza.price * pizza.quantity }} ₽</b>
            </div>

            <div class="cart-list__button">
              <button
                type="button"
                class="cart-list__edit"
                @click="cartStore.removePizza(pizza.id)"
              >
                Удалить
              </button>
            </div>
          </li>
        </TransitionGroup>

        <div v-if="cartStore.hasMisc" class="cart__additional">
          <ul class="additional-list">
            <li v-for="item in cartStore.misc" :key="item.misc.id" class="additional-list__item sheet">
              <p class="additional-list__description">
                <img :src="getImageUrl(item.misc.image)" width="39" height="60" :alt="item.misc.name" />
                <span>{{ item.misc.name }}</span>
              </p>

              <div class="additional-list__wrapper">
                <div class="counter additional-list__counter">
                  <button
                    type="button"
                    class="counter__button counter__button--minus"
                    @click="cartStore.decreaseMiscQuantity(item.misc.id)"
                  >
                    <span class="visually-hidden">Меньше</span>
                  </button>
                  <input
                    type="text"
                    name="counter"
                    class="counter__input"
                    :value="item.quantity"
                    readonly
                  />
                  <button
                    type="button"
                    class="counter__button counter__button--plus counter__button--orange"
                    @click="cartStore.increaseMiscQuantity(item.misc.id)"
                  >
                    <span class="visually-hidden">Больше</span>
                  </button>
                </div>

                <div class="additional-list__price">
                  <b>× {{ item.misc.price }} ₽</b>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="cart__form">
          <div class="cart-form">
            <label class="input input--big-label">
              <span>Получение заказа:</span>

              <select v-model="deliveryType" name="delivery" class="select">
                <option value="pickup">Заберу сам</option>
                <option value="new">Новый адрес</option>
                <option v-for="address in profileStore.addresses" :key="address.id" :value="`address-${address.id}`">
                  {{ address.name }}
                </option>
              </select>
            </label>

            <label class="input input--big-label">
              <span>Контактный телефон:</span>
              <input v-model="phone" type="text" name="tel" placeholder="+7 999-999-99-99" />
            </label>

            <Transition name="slide-down">
              <div v-if="deliveryType === 'new'" class="cart-form__address">
              <div class="cart-form__label">Новый адрес:</div>

              <div class="cart-form__address-wrapper">
                <div class="cart-form__input">
                  <label class="input">
                    <span>Название адреса*</span>
                    <input v-model="newAddress.name" type="text" name="addr-name" placeholder="Введите название адреса" required />
                  </label>
                </div>
  
                <div class="cart-form__input">
                  <label class="input">
                    <span>Улица*</span>
                    <input v-model="newAddress.street" type="text" name="street" placeholder="Введите название улицы" required />
                  </label>
                </div>
  
                <div class="cart-form__input cart-form__input--small">
                  <label class="input">
                    <span>Дом*</span>
                    <input v-model="newAddress.building" type="text" name="house" placeholder="Введите номер дома" required />
                  </label>
                </div>
  
                <div class="cart-form__input cart-form__input--small">
                  <label class="input">
                    <span>Квартира</span>
                    <input v-model="newAddress.flat" type="text" name="apartment" placeholder="Введите № квартиры" />
                  </label>
                </div>
              </div>

              <div class="cart-form__input">
                <label class="input">
                  <span>Комментарий</span>
                  <input v-model="newAddress.comment" type="text" name="comment" placeholder="Введите комментарий" />
                </label>
              </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </main>
    <section class="footer">
      <div class="footer__more">
        <router-link to="/" class="button button--border button--arrow">Хочу еще одну</router-link>
      </div>
      <p class="footer__text">Перейти к конструктору<br />чтоб собрать ещё одну пиццу</p>
      <div class="footer__price">
        <b>Итого: {{ cartStore.totalPrice }} ₽</b>
      </div>

      <div class="footer__submit">
        <button type="submit" class="button" :disabled="isSubmitting || cartStore.isEmpty">
          {{ isSubmitting ? "Отправка..." : "Оформить заказ" }}
        </button>
      </div>
    </section>
    <OrderSuccessPopup v-model="showSuccessPopup" />
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { useDataStore } from "@/stores/data";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { AddressesService, OrdersService, API_BASE_URL } from "@/services";
import type { CartPizza } from "@/stores/cart";
import { getImageUrl } from "@/utils/images";
import OrderSuccessPopup from "@/common/components/order-success-popup/OrderSuccessPopup.vue";

const router = useRouter();
const cartStore = useCartStore();
const dataStore = useDataStore();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const addressesService = new AddressesService(API_BASE_URL);
const ordersService = new OrdersService(API_BASE_URL);

const deliveryType = ref<string>("pickup");
const phone = ref<string>("");
const showSuccessPopup = ref(false);
const isSubmitting = ref(false);
const newAddress = ref({
  name: "",
  street: "",
  building: "",
  flat: "",
  comment: "",
});

// Функция для предзаполнения телефона
const updatePhone = () => {
  if (authStore.isAuthenticated) {
    if (profileStore.hasProfile && profileStore.phone) {
      phone.value = profileStore.phone;
    } else if (authStore.user?.phone) {
      phone.value = authStore.user.phone;
    }
  }
};

// Реактивно отслеживаем изменения пользователя и профиля
watch(
  () => [authStore.user, profileStore.phone, authStore.isAuthenticated],
  () => {
    updatePhone();
  },
  { immediate: true }
);

onMounted(async () => {
  // Если пользователь аутентифицирован, загружаем его данные
  if (authStore.isAuthenticated) {
    // Если пользователь еще не загружен, ждем его загрузки
    if (!authStore.user && !authStore.isLoading) {
      await authStore.fetchUser();
    }
    
    // Предзаполняем телефон (на случай если watch не сработал)
    updatePhone();
    
    // Загружаем адреса пользователя
    try {
      const addresses = await addressesService.findAll();
      profileStore.addresses = addresses;
    } catch (error) {
      console.error("Ошибка загрузки адресов:", error);
    }
  }
});

const getPizzaDescription = (pizza: CartPizza) => {
  return `${pizza.size.name}, на ${pizza.dough.name.toLowerCase()} тесте`;
};

const getIngredientsList = (pizza: CartPizza) => {
  const ingredients: string[] = [];
  for (const id in pizza.ingredients) {
    const ingredient = dataStore.getIngredientById(Number(id));
    if (ingredient) {
      ingredients.push(ingredient.name.toLowerCase());
    }
  }
  return ingredients;
};

const handleSubmit = async () => {
  if (cartStore.isEmpty || isSubmitting.value) {
    return;
  }

  // Валидация телефона
  if (!phone.value || !phone.value.trim()) {
    alert("Пожалуйста, укажите контактный телефон");
    return;
  }

  // Валидация адреса, если требуется доставка
  let addressData = null;
  if (deliveryType.value === "new") {
    if (!newAddress.value.name?.trim() || !newAddress.value.street?.trim() || !newAddress.value.building?.trim()) {
      alert("Пожалуйста, заполните все обязательные поля адреса");
      return;
    }
    addressData = {
      name: newAddress.value.name.trim(),
      street: newAddress.value.street.trim(),
      building: newAddress.value.building.trim(),
      flat: newAddress.value.flat?.trim() || undefined,
      comment: newAddress.value.comment?.trim() || undefined,
    };
  } else if (deliveryType.value.startsWith("address-")) {
    const addressId = parseInt(deliveryType.value.replace("address-", ""));
    const address = profileStore.getAddressById(addressId);
    if (address) {
      addressData = {
        name: address.name,
        street: address.street,
        building: address.building,
        flat: address.flat || undefined,
        comment: address.comment || undefined,
      };
    }
  }

  // Если не самовывоз и адрес не указан
  if (deliveryType.value !== "pickup" && !addressData) {
    alert("Пожалуйста, выберите или введите адрес доставки");
    return;
  }

  isSubmitting.value = true;

  try {
    // Формируем данные для заказа
    const orderData = {
      phone: phone.value.trim(),
      pizzas: cartStore.pizzas.map((pizza) => ({
        name: pizza.name,
        sizeId: pizza.size.id!,
        doughId: pizza.dough.id!,
        sauceId: pizza.sauce.id!,
        quantity: pizza.quantity,
        ingredients: Object.entries(pizza.ingredients).map(([ingredientId, item]) => ({
          ingredientId: Number(ingredientId),
          quantity: item.count,
        })),
      })),
      misc: cartStore.misc.map((item) => ({
        miscId: item.misc.id!,
        quantity: item.quantity,
      })),
      address: addressData || {
        name: "Самовывоз",
        street: "-",
        building: "-",
      },
    };

    // Отправляем заказ
    await ordersService.create(orderData);

    // Очищаем корзину
    cartStore.clearCart();

    // Показываем попап успеха
    showSuccessPopup.value = true;
  } catch (error: any) {
    console.error("Ошибка при оформлении заказа:", error);
    const errorMessage = error.response?.data?.error?.message 
      || error.response?.data?.message
      || error.message
      || "Произошла ошибка при оформлении заказа. Попробуйте еще раз.";
    alert(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style lang="scss">
@use "@/assets/scss/blocks/title";
@use "@/assets/scss/blocks/button";
@use "@/assets/scss/blocks/input";
@use "@/assets/scss/blocks/select";
@use "@/assets/scss/blocks/product";
@use "@/assets/scss/blocks/counter";
@use "@/assets/scss/blocks/cart";
@use "@/assets/scss/blocks/cart-list";
@use "@/assets/scss/blocks/cart-form";
@use "@/assets/scss/blocks/additional-list";
@use "@/assets/scss/blocks/footer";
@use "@/assets/scss/layout/container";
@use "@/assets/scss/layout/content";
@use "@/assets/scss/layout/layout-form";
</style>

