<template>
  <main class="layout">
    <div class="layout__sidebar sidebar">
      <router-link to="/" class="logo layout__logo">
        <img src="@/assets/img/logo.svg" alt="V!U!E! Pizza logo" width="90" height="40" />
      </router-link>

      <router-link to="/orders" class="layout__link">История заказов</router-link>
      <router-link to="/profile" class="layout__link layout__link--active">Мои данные</router-link>
    </div>

    <div class="layout__content">
      <div class="layout__title">
        <h1 class="title title--big">Мои данные</h1>
        <div class="layout__tabs">
          <button type="button" class="layout__tab layout__tab--active">Мои данные</button>
        </div>
      </div>

      <div class="user">
        <picture v-if="profileStore.avatar">
          <img :src="getImageUrl(profileStore.avatar)" :alt="profileStore.name" width="72" height="72" />
        </picture>
        <div class="user__name">
          <span>{{ profileStore.name || "Пользователь" }}</span>
        </div>
        <p class="user__phone">Контактный телефон: <span>{{ profileStore.phone || "Не указан" }}</span></p>
      </div>

      <div v-for="address in profileStore.addresses" :key="address.id" class="layout__address">
        <div class="sheet address-form">
          <div class="address-form__header">
            <b>{{ address.name }}</b>
            <div class="address-form__edit">
              <button
                type="button"
                class="icon"
                @click="editAddress(address.id!)"
              >
                <span class="visually-hidden">Изменить адрес</span>
              </button>
            </div>
          </div>
          <p>{{ address.street }}, д. {{ address.building }}{{ address.flat ? `, кв. ${address.flat}` : "" }}</p>
          <small v-if="address.comment">{{ address.comment }}</small>
        </div>
      </div>

      <div v-if="editingAddress" class="layout__address">
        <form @submit.prevent="saveAddress" class="address-form address-form--opened sheet">
          <div class="address-form__header">
            <b>{{ editingAddress.id ? "Редактирование адреса" : "Новый адрес" }}</b>
          </div>

          <div class="address-form__wrapper">
            <div class="address-form__input">
              <label class="input">
                <span>Название адреса*</span>
                <input
                  v-model="addressForm.name"
                  type="text"
                  name="addr-name"
                  placeholder="Введите название адреса"
                  required
                />
              </label>
            </div>
            <div class="address-form__input address-form__input--size--normal">
              <label class="input">
                <span>Улица*</span>
                <input
                  v-model="addressForm.street"
                  type="text"
                  name="addr-street"
                  placeholder="Введите название улицы"
                  required
                />
              </label>
            </div>
            <div class="address-form__input address-form__input--size--small">
              <label class="input">
                <span>Дом*</span>
                <input
                  v-model="addressForm.building"
                  type="text"
                  name="addr-house"
                  placeholder="Введите номер дома"
                  required
                />
              </label>
            </div>
            <div class="address-form__input address-form__input--size--small">
              <label class="input">
                <span>Квартира</span>
                <input
                  v-model="addressForm.flat"
                  type="text"
                  name="addr-apartment"
                  placeholder="Введите № квартиры"
                />
              </label>
            </div>
            <div class="address-form__input">
              <label class="input">
                <span>Комментарий</span>
                <input
                  v-model="addressForm.comment"
                  type="text"
                  name="addr-comment"
                  placeholder="Введите комментарий"
                />
              </label>
            </div>
          </div>

          <div class="address-form__buttons">
            <button
              v-if="editingAddress.id"
              type="button"
              class="button button--transparent"
              @click="deleteAddress"
            >
              Удалить
            </button>
            <button
              type="button"
              class="button button--transparent"
              @click="cancelEdit"
            >
              Отмена
            </button>
            <button type="submit" class="button">Сохранить</button>
          </div>
        </form>
      </div>

      <div v-if="!editingAddress && profileStore.addresses.length > 0" class="layout__button">
        <button type="button" class="button button--border" @click="addNewAddress">
          Добавить новый адрес
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { AddressesService, API_BASE_URL } from "@/services";
import { getImageUrl } from "@/utils/images";
import type { Address } from "@/stores/profile";

const profileStore = useProfileStore();
const authStore = useAuthStore();
const addressesService = new AddressesService(API_BASE_URL);

const editingAddress = ref<Address | null>(null);
const addressForm = ref({
  name: "",
  street: "",
  building: "",
  flat: "",
  comment: "",
});

onMounted(async () => {
  // Если пользователь аутентифицирован, загружаем адреса
  // fetchUser() уже должен быть вызван в App.vue
  if (authStore.isAuthenticated) {
    // Если пользователь еще не загружен, ждем его загрузки
    // fetchUser() имеет защиту от повторных вызовов, так что безопасно вызывать
    if (!authStore.user && !authStore.isLoading) {
      await authStore.fetchUser();
    }
    await loadAddresses();
  }
});

const loadAddresses = async () => {
  try {
    const addresses = await addressesService.findAll();
    profileStore.addresses = addresses;
    // Показываем форму сразу, если нет адресов
    if (addresses.length === 0) {
      addNewAddress();
    }
  } catch (error) {
    console.error("Ошибка загрузки адресов:", error);
  }
};

const addNewAddress = () => {
  editingAddress.value = {
    name: "",
    street: "",
    building: "",
    flat: "",
    comment: "",
  };
  addressForm.value = {
    name: "",
    street: "",
    building: "",
    flat: "",
    comment: "",
  };
};

const editAddress = (id: number) => {
  const address = profileStore.getAddressById(id);
  if (address) {
    editingAddress.value = { ...address };
    addressForm.value = {
      name: address.name,
      street: address.street,
      building: address.building,
      flat: address.flat || "",
      comment: address.comment || "",
    };
  }
};

const saveAddress = async () => {
  if (!editingAddress.value) return;

  try {
    if (editingAddress.value.id) {
      await addressesService.update(editingAddress.value.id, addressForm.value);
      profileStore.updateAddress(editingAddress.value.id, addressForm.value);
    } else {
      const newAddress = await addressesService.create({
        ...addressForm.value,
        userId: profileStore.id,
      });
      profileStore.addresses.push(newAddress);
    }
    editingAddress.value = null;
  } catch (error) {
    console.error("Ошибка сохранения адреса:", error);
  }
};

const cancelEdit = () => {
  editingAddress.value = null;
};

const deleteAddress = async () => {
  if (!editingAddress.value?.id) return;

  try {
    await addressesService.remove(editingAddress.value.id);
    profileStore.removeAddress(editingAddress.value.id);
    editingAddress.value = null;
  } catch (error) {
    console.error("Ошибка удаления адреса:", error);
  }
};
</script>

<style lang="scss">
@use "@/assets/scss/blocks/title";
@use "@/assets/scss/blocks/button";
@use "@/assets/scss/blocks/input";
@use "@/assets/scss/blocks/logo";
@use "@/assets/scss/blocks/user";
@use "@/assets/scss/blocks/icon";
@use "@/assets/scss/blocks/address-form";
@use "@/assets/scss/layout/layout";
@use "@/assets/scss/layout/sidebar";
</style>

