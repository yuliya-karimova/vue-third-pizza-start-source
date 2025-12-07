<template>
  <Transition name="fade">
    <div v-if="isVisible" class="popup" @click.self="handleCancel">
      <div class="popup__content popup__content--dialog">
        <button
          type="button"
          class="close"
          aria-label="Закрыть диалог"
          @click="handleCancel"
        >
          <span class="visually-hidden">Закрыть</span>
        </button>

        <div class="popup__title">
          <h2 class="title">{{ title }}</h2>
        </div>

        <p v-if="message">{{ message }}</p>

        <div class="popup__buttons">
          <button
            v-if="showCancelButton"
            type="button"
            class="button button--border"
            :disabled="isLoading"
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="button"
            :class="{ 'button--danger': isDanger }"
            :disabled="isLoading"
            @click="handleConfirm"
          >
            {{ isLoading ? loadingText : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from "vue";

interface Props {
  modelValue: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  isDanger?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Подтверждение",
  message: "",
  confirmText: "Да",
  cancelText: "Отмена",
  showCancelButton: true,
  isDanger: false,
  isLoading: false,
  loadingText: "Обработка...",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleConfirm = () => {
  emit("confirm");
};

const handleCancel = () => {
  isVisible.value = false;
  emit("cancel");
};

// Блокировка прокрутки фона
watch(isVisible, (visible) => {
  if (visible) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

// Закрытие по ESC
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isVisible.value && !props.isLoading) {
    handleCancel();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
  document.body.style.overflow = "";
});
</script>

<style lang="scss">
@use "@/assets/scss/layout/popup";
@use "@/assets/scss/blocks/title";
@use "@/assets/scss/blocks/button";
@use "@/assets/scss/blocks/close";

.popup__content--dialog {
  p {
    margin-bottom: 32px;
  }
}

.popup__buttons {
  display: flex;
  gap: 12px;
  justify-content: center;

  .button {
    min-width: 120px;
  }
}

.button--danger {
  background-color: #dc3545;

  &:hover:not(:disabled) {
    background-color: #c82333;
  }

  &:active:not(:disabled) {
    background-color: #bd2130;
  }
}
</style>
