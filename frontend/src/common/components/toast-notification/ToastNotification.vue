<template>
  <TransitionGroup name="toast" tag="div" class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast', `toast--${toast.type}`]"
      role="alert"
      aria-live="assertive"
    >
      <div class="toast__content">
        <span class="toast__message">{{ toast.message }}</span>
        <button
          type="button"
          class="toast__close"
          aria-label="Закрыть уведомление"
          @click="removeToast(toast.id)"
        >
          <span class="visually-hidden">Закрыть</span>
        </button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

const toasts = ref<Toast[]>([]);
let toastIdCounter = 0;

const addToast = (
  message: string,
  type: Toast["type"] = "info",
  duration: number = 4000,
) => {
  const id = toastIdCounter++;
  const toast: Toast = { id, message, type, duration };

  toasts.value.push(toast);

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
};

const removeToast = (id: number) => {
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

const clearAll = () => {
  toasts.value = [];
};

// Экспортируем методы для использования через provide/inject или composable
defineExpose({
  addToast,
  removeToast,
  clearAll,
});

// Делаем методы доступными глобально через window для удобства
onMounted(() => {
  (window as any).__toast = {
    success: (message: string, duration?: number) =>
      addToast(message, "success", duration),
    error: (message: string, duration?: number) =>
      addToast(message, "error", duration),
    warning: (message: string, duration?: number) =>
      addToast(message, "warning", duration),
    info: (message: string, duration?: number) =>
      addToast(message, "info", duration),
  };
});
</script>

<style lang="scss">
@use "@/assets/scss/ds-system/ds-colors";
@use "@/assets/scss/ds-system/ds-shadows";

.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;

  display: flex;
  flex-direction: column;
  gap: 12px;

  pointer-events: none;
}

.toast {
  min-width: 300px;
  max-width: 500px;
  padding: 16px 20px;

  pointer-events: auto;
  background-color: ds-colors.$white;
  border-radius: 8px;
  box-shadow: ds-shadows.$shadow-light;
  animation: slideInRight 0.3s ease-out;

  &--success {
    border-left: 4px solid #28a745;
  }

  &--error {
    border-left: 4px solid #dc3545;
  }

  &--warning {
    border-left: 4px solid #ffc107;
  }

  &--info {
    border-left: 4px solid #17a2b8;
  }
}

.toast__content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.toast__message {
  flex: 1;
  color: ds-colors.$black;
  font-size: 14px;
  line-height: 1.5;
}

.toast__close {
  position: relative;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  padding: 0;

  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  transition: opacity 0.2s;

  color: ds-colors.$black;
  opacity: 0.6;

  &::before,
  &::after {
    position: absolute;
    top: 50%;
    left: 50%;

    width: 12px;
    height: 2px;

    content: "";
    transform: translate(-50%, -50%) rotate(45deg);

    background-color: currentColor;
    border-radius: 2px;
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  &:hover {
    opacity: 1;
  }

  &:focus {
    opacity: 1;
    outline: 2px solid ds-colors.$orange-100;
    outline-offset: 2px;
  }
}

// Анимации
.toast-enter-active {
  animation: slideInRight 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOutRight 0.3s ease-out;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

// Адаптивность для мобильных
@media (max-width: 768px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }

  .toast {
    min-width: auto;
    max-width: 100%;
  }
}
</style>
