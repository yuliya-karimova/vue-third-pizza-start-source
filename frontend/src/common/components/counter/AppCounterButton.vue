<template>
  <button
    type="button"
    :class="['counter__button', `counter__button--${kind}`]"
    :disabled="disabled"
    :aria-label="ariaLabel || (kind === 'minus' ? 'Уменьшить' : 'Увеличить')"
    @click="$emit('click')"
  >
    <span class="visually-hidden">
      {{ ariaLabel || (kind === "minus" ? "Меньше" : "Больше") }}
    </span>
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    kind: "minus" | "plus";
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    disabled: false,
    ariaLabel: "",
  },
);

defineEmits<{ (e: "click"): void }>();
</script>
