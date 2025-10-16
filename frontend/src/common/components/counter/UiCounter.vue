<template>
  <div class="counter counter--orange ingredients__counter">
    <UiCounterButton
      kind="minus"
      :disabled="isDecrementDisabled"
      @click="onDecrease"
    />

    <input
      type="text"
      name="counter"
      class="counter__input"
      :value="modelValue"
      readonly
      aria-label="Количество ингредиента"
    />

    <UiCounterButton
      kind="plus"
      :disabled="isIncrementDisabled"
      @click="onIncrease"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UiCounterButton from "./UiCounterButton.vue";

interface Props {
  modelValue: number;
  minValue?: number;
  maxValue?: number;
}

const props = withDefaults(defineProps<Props>(), {
  minValue: 0,
  maxValue: Infinity,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const isDecrementDisabled = computed(() => {
  return props.modelValue <= props.minValue;
});

const isIncrementDisabled = computed(() => {
  return props.modelValue >= props.maxValue;
});

const onDecrease = () => {
  if (props.modelValue > props.minValue) {
    const newValue = props.modelValue - 1;
    emit("update:modelValue", newValue);
  }
};

const onIncrease = () => {
  if (props.modelValue < props.maxValue) {
    const newValue = props.modelValue + 1;
    emit("update:modelValue", newValue);
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/blocks/counter.scss";
</style>
