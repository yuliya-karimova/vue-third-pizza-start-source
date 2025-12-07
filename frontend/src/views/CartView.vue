<template>
  <form action="test.html" method="post" class="layout-form">
    <main class="content cart">
      <div class="container">
        <div class="cart__title">
          <h1 class="title title--big">Корзина</h1>
        </div>

        <div v-if="cartStore.isEmpty" class="sheet cart__empty">
          <p>В корзине нет ни одного товара</p>
        </div>

        <ul v-else class="cart-list sheet">
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
        </ul>

        <div v-if="cartStore.hasMisc" class="cart__additional">
          <ul class="additional-list">
            <li v-for="item in cartStore.misc" :key="item.misc.id" class="additional-list__item sheet">
              <p class="additional-list__description">
                <img :src="`@/assets/img/${item.misc.image}`" width="39" height="60" :alt="item.misc.name" />
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
            <label class="cart-form__select">
              <span class="cart-form__label">Получение заказа:</span>

              <select name="test" class="select">
                <option value="1">Заберу сам</option>
                <option value="2">Новый адрес</option>
                <option value="3">Дом</option>
              </select>
            </label>

            <label class="input input--big-label">
              <span>Контактный телефон:</span>
              <input type="text" name="tel" placeholder="+7 999-999-99-99" />
            </label>

            <div class="cart-form__address">
              <span class="cart-form__label">Новый адрес:</span>

              <div class="cart-form__input">
                <label class="input">
                  <span>Улица*</span>
                  <input type="text" name="street" />
                </label>
              </div>

              <div class="cart-form__input cart-form__input--small">
                <label class="input">
                  <span>Дом*</span>
                  <input type="text" name="house" />
                </label>
              </div>

              <div class="cart-form__input cart-form__input--small">
                <label class="input">
                  <span>Квартира</span>
                  <input type="text" name="apartment" />
                </label>
              </div>
            </div>
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
        <button type="submit" class="button">Оформить заказ</button>
      </div>
    </section>
  </form>
</template>

<script setup lang="ts">
import { useCartStore } from "@/stores/cart";
import { useDataStore } from "@/stores/data";
import type { CartPizza } from "@/stores/cart";

const cartStore = useCartStore();
const dataStore = useDataStore();

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

