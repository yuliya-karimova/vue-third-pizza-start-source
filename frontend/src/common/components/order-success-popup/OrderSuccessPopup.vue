<template>
  <Transition name="fade">
    <div v-if="isVisible" class="popup">
      <div class="popup__content">
        <a href="#" class="close" @click.prevent="handleClose">
          <span class="visually-hidden">Закрыть попап</span>
        </a>
        <div class="popup__title">
          <h2 class="title">Спасибо за заказ</h2>
        </div>
        <p>Мы начали готовить Ваш заказ, скоро привезём его вам ;)</p>
        <div class="popup__button">
          <router-link :to="redirectTo" class="button" @click="handleClose"
            >Отлично, я жду!</router-link
          >
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: boolean;
  redirectTo?: string;
}

const props = withDefaults(defineProps<Props>(), {
  redirectTo: "/orders",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleClose = () => {
  isVisible.value = false;
};
</script>

<style lang="scss">
@use "@/assets/scss/layout/popup";
</style>
