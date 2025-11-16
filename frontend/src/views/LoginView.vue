<template>
  <div class="sign-form">
    <router-link to="/" class="close close--white">
      <span class="visually-hidden">Закрыть форму авторизации</span>
    </router-link>
    <div class="sign-form__title">
      <h1 class="title title--small">Авторизуйтесь на сайте</h1>
    </div>
    <form @submit.prevent="onSubmit">
      <div class="sign-form__input">
        <UiTextInput
          v-model="email"
          name="email"
          label="E-mail"
          placeholder="example@mail.ru"
          type="email"
        />
      </div>

      <div class="sign-form__input">
        <UiTextInput
          v-model="password"
          name="password"
          label="Пароль"
          placeholder="***********"
          type="password"
        />
      </div>
      <button type="submit" class="button">Авторизоваться</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import UiTextInput from "@/common/components/text-input/UiTextInput.vue";

const router = useRouter();

const email = ref("");
const password = ref("");

const onSubmit = () => {
  // TODO: Реализовать логику авторизации
  console.log("Login attempt:", { email: email.value, password: password.value });
  // После успешной авторизации можно перенаправить на главную
  // router.push("/");
};
</script>

<style lang="scss">
@use "@/assets/scss/blocks/title";
@use "@/assets/scss/blocks/button";
@use "@/assets/scss/blocks/input";
@use "@/assets/scss/blocks/close";
@use "@/assets/scss/layout/sign-form";
</style>

