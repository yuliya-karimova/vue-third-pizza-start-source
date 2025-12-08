<template>
  <div class="sign-form">
    <router-link to="/" class="close close--white">
      <span class="visually-hidden">Закрыть форму регистрации</span>
    </router-link>
    <div class="sign-form__title">
      <h1 class="title title--small">Регистрация</h1>
    </div>
    <form action="test.html" method="post" @submit.prevent="onSubmit">
      <div v-if="authStore.error" class="sign-form__error">
        {{ authStore.error }}
      </div>

      <div class="sign-form__input">
        <label class="input">
          <span>Имя</span>
          <input
            v-model="name"
            type="text"
            name="name"
            placeholder="Введите ваше имя"
            :class="{ 'input--error': errors.name }"
            @blur="validateName"
          />
          <span v-if="errors.name" class="input__error">{{
            errors.name
          }}</span>
        </label>
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
          <span v-if="errors.email" class="input__error">{{
            errors.email
          }}</span>
        </label>
      </div>

      <div class="sign-form__input">
        <label class="input">
          <span>Телефон</span>
          <input
            :value="phoneInput.phone.value"
            type="text"
            name="phone"
            placeholder="+7 999 777-77-77"
            :class="{ 'input--error': errors.phone || (phoneInput.error && phoneInput.touched) }"
            @input="phoneInput.handleInput"
            @blur="handlePhoneBlur"
          />
          <span v-if="errors.phone || (phoneInput.error && phoneInput.touched)" class="input__error">
            {{ errors.phone || phoneInput.error }}
          </span>
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
          <span v-if="errors.password" class="input__error">{{
            errors.password
          }}</span>
        </label>
      </div>

      <div class="sign-form__input">
        <label class="input">
          <span>Повторите пароль</span>
          <input
            v-model="passwordConfirm"
            type="password"
            name="pass-confirm"
            placeholder="***********"
            :class="{ 'input--error': errors.passwordConfirm }"
            @blur="validatePasswordConfirm"
          />
          <span v-if="errors.passwordConfirm" class="input__error">{{
            errors.passwordConfirm
          }}</span>
        </label>
      </div>

      <button
        type="submit"
        :class="['button', authStore.isLoading && 'button--loading']"
        :disabled="authStore.isLoading || !isFormValid"
      >
        <template v-if="authStore.isLoading">
          <LoadingSpinner size="small" :message="''" />
          <span class="button__text">Регистрация...</span>
        </template>
        <span v-else class="button__text">Зарегистрироваться</span>
      </button>

      <div class="sign-form__link">
        <p>
          Уже есть аккаунт?
          <router-link to="/login">Войти</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { usePhoneInput } from "@/composables/usePhoneInput";
import { logger } from "@/utils/logger";
import { LoadingSpinner } from "@/common/components/loading-spinner";

const router = useRouter();
const authStore = useAuthStore();
const phoneInput = usePhoneInput("");

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const errors = ref<{
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  passwordConfirm?: string;
}>({});

const validateName = () => {
  errors.value.name = undefined;

  if (!name.value.trim()) {
    errors.value.name = "Имя обязательно для заполнения";
    return false;
  }

  if (name.value.trim().length < 2) {
    errors.value.name = "Имя должно содержать минимум 2 символа";
    return false;
  }

  return true;
};

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

const handlePhoneBlur = () => {
  phoneInput.handleBlur();
  validatePhone();
};

const validatePhone = () => {
  errors.value.phone = undefined;

  if (!phoneInput.validate()) {
    errors.value.phone = phoneInput.error.value || "Телефон обязателен";
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

  if (password.value.length < 6) {
    errors.value.password = "Пароль должен содержать минимум 6 символов";
    return false;
  }

  // Проверка на совпадение паролей, если поле подтверждения уже заполнено
  if (passwordConfirm.value && password.value !== passwordConfirm.value) {
    errors.value.passwordConfirm = "Пароли не совпадают";
  }

  return true;
};

const validatePasswordConfirm = () => {
  errors.value.passwordConfirm = undefined;

  if (!passwordConfirm.value) {
    errors.value.passwordConfirm = "Повторите пароль";
    return false;
  }

  if (password.value !== passwordConfirm.value) {
    errors.value.passwordConfirm = "Пароли не совпадают";
    return false;
  }

  return true;
};

const isFormValid = computed(() => {
  return (
    name.value.trim() &&
    email.value &&
    phoneInput.phone.value &&
    password.value &&
    passwordConfirm.value &&
    !errors.value.name &&
    !errors.value.email &&
    !errors.value.phone &&
    !errors.value.password &&
    !errors.value.passwordConfirm &&
    !phoneInput.error.value
  );
});

const onSubmit = async () => {
  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isPasswordValid = validatePassword();
  const isPasswordConfirmValid = validatePasswordConfirm();

  if (
    !isNameValid ||
    !isEmailValid ||
    !isPhoneValid ||
    !isPasswordValid ||
    !isPasswordConfirmValid
  ) {
    return;
  }

  try {
    await authStore.signUp({
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phoneInput.normalizedPhone.value,
      password: password.value,
    });

    // После успешной регистрации происходит автоматический вход
    router.push("/");
  } catch (error) {
    logger.error("Ошибка регистрации:", error);
  }
};
</script>

<style lang="scss">
@use "@/assets/scss/layout/sign-form";

.sign-form__error {
  padding: 10px;
  margin-bottom: 15px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  font-size: 14px;
}

.sign-form__link {
  margin-top: 20px;
  text-align: center;

  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }

  a {
    color: #73b918;
    text-decoration: underline;

    &:hover {
      color: #5d9314;
    }
  }
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

