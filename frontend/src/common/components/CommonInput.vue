<template>
  <label class="input">
    <span class="visually-hidden">{{ label }}</span>
    <input
      :type="type"
      :name="name"
      :placeholder="placeholder"
      class="input__field"
      v-model="inputValue"
    />
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: string | number;
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
  (e: "update:modelValue", value: string | number): void;
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
