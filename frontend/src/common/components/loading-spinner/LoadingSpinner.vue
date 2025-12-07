<template>
  <div v-if="visible" :class="['loading-spinner', `loading-spinner--${size}`, { 'loading-spinner--overlay': overlay }]">
    <div class="loading-spinner__content">
      <div class="loading-spinner__spinner">
        <div class="spinner"></div>
      </div>
      <p v-if="message" class="loading-spinner__message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible?: boolean;
  size?: 'small' | 'medium' | 'large';
  message?: string;
  overlay?: boolean;
}

withDefaults(defineProps<Props>(), {
  visible: true,
  size: 'medium',
  message: '',
  overlay: false,
});
</script>

<style lang="scss">
@use "@/assets/scss/ds-system/ds-colors";

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  &--overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9998;
    width: 100%;
    height: 100%;
    background-color: rgba(ds-colors.$white, 0.9);
    backdrop-filter: blur(4px);
  }

  &--small {
    padding: 10px;
    
    .loading-spinner__spinner {
      width: 20px;
      height: 20px;
    }
    
    .spinner {
      border-width: 2px;
    }
    
    .loading-spinner__message {
      font-size: 12px;
      margin-top: 8px;
    }
  }

  &--medium {
    padding: 20px;
    
    .loading-spinner__spinner {
      width: 40px;
      height: 40px;
    }
    
    .loading-spinner__message {
      font-size: 14px;
      margin-top: 12px;
    }
  }

  &--large {
    padding: 40px;
    
    .loading-spinner__spinner {
      width: 60px;
      height: 60px;
    }
    
    .loading-spinner__message {
      font-size: 16px;
      margin-top: 16px;
    }
  }
}

.loading-spinner__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner__spinner {
  position: relative;
  width: 40px;
  height: 40px;
}

.loading-spinner__message {
  margin-top: 12px;
  color: ds-colors.$black;
  text-align: center;
  font-size: 14px;
  opacity: 0.7;
}

.spinner {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(ds-colors.$orange-100, 0.2);
  border-top-color: ds-colors.$orange-100;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// Альтернативный стиль с точками
.loading-spinner--dots {
  .loading-spinner__spinner {
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: center;
    width: auto;
    height: auto;
  }

  .spinner {
    width: 8px;
    height: 8px;
    border: none;
    background-color: ds-colors.$orange-100;
    border-radius: 50%;
    animation: bounce 1.4s ease-in-out infinite both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }

    &:nth-child(3) {
      animation-delay: 0s;
    }
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

