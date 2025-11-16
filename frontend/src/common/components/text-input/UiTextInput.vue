<template>
  <label class="input">
    <span class="visually-hidden">{{ label }}</span>
    <input
      v-model="inputValue"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      class="input__field"
    />
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: string;
  name: string;
  placeholder?: string;
  label: string;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  type: "text",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const inputValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<style lang="scss">
@use "@/assets/scss/blocks/input";
</style>
