<template>
  <div class="sign-form">
    <router-link to="/" class="close close--white">
      <span class="visually-hidden">Закрыть форму авторизации</span>
    </router-link>
    <div class="sign-form__title">
      <h1 class="title title--small">Авторизуйтесь на сайте</h1>
    </div>
    <form @submit.prevent="onSubmit" action="test.html" method="post">
      <div v-if="authStore.error" class="sign-form__error">
        {{ authStore.error }}
      </div>

      <div class="sign-form__input">
        <label class="input">
          <span>E-mail</span>
          <input
            v-model="email"
            type="email"
            name="email"
            placeholder="example@mail.ru"
            :class="{ 'input--error': errors.email }"
            @blur="validateEmail"
          />
          <span v-if="errors.email" class="input__error">{{ errors.email }}</span>
        </label>
      </div>

      <div class="sign-form__input">
        <label class="input">
          <span>Пароль</span>
          <input
            v-model="password"
            type="password"
            name="pass"
            placeholder="***********"
            :class="{ 'input--error': errors.password }"
            @blur="validatePassword"
          />
          <span v-if="errors.password" class="input__error">{{ errors.password }}</span>
        </label>
      </div>
      <button type="submit" class="button" :disabled="authStore.isLoading || !isFormValid">
        {{ authStore.isLoading ? "Вход..." : "Авторизоваться" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const errors = ref<{ email?: string; password?: string }>({});

const validateEmail = () => {
  errors.value.email = undefined;
  
  if (!email.value) {
    errors.value.email = "E-mail обязателен";
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errors.value.email = "Введите корректный e-mail";
    return false;
  }

  return true;
};

const validatePassword = () => {
  errors.value.password = undefined;
  
  if (!password.value) {
    errors.value.password = "Пароль обязателен";
    return false;
  }

  return true;
};

const isFormValid = computed(() => {
  return email.value && password.value && !errors.value.email && !errors.value.password;
});

const onSubmit = async () => {
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (!isEmailValid || !isPasswordValid) {
    return;
  }

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });

    const redirect = route.query.redirect as string;
    router.push(redirect || "/");
  } catch (error) {
    console.error("Ошибка авторизации:", error);
  }
};
</script>

<style lang="scss">
@use "@/assets/scss/blocks/title";
@use "@/assets/scss/blocks/button";
@use "@/assets/scss/blocks/input";
@use "@/assets/scss/blocks/close";
@use "@/assets/scss/layout/sign-form";

.sign-form__error {
  padding: 10px;
  margin-bottom: 15px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  font-size: 14px;
}

.input__error {
  display: block;
  margin-top: 5px;
  color: #c62828;
  font-size: 12px;
}

.input--error input {
  border-color: #c62828;
}
</style>

