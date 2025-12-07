<template>
  <div class="ingredients__sauce">
    <p>Основной соус:</p>

    <label
      v-for="sauce in sauceList"
      :key="sauce.id"
      class="radio ingredients__input"
    >
      <input
        v-model="selectedSauceId"
        type="radio"
        name="sauce"
        :value="sauce.id"
      />
      <span>{{ sauce.name }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Sauce } from "@/types";

interface Props {
  modelValue: Sauce;
  sauceList: Sauce[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Sauce): void;
}>();

const saucesMap = ref(
  props.sauceList.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<number, Sauce>,
  ),
);

const selectedSauceId = computed({
  get() {
    return props.modelValue.id;
  },
  set(id) {
    emit("update:modelValue", saucesMap.value[id]);
  },
});
</script>

<style lang="scss">
@use "@/assets/scss/blocks/radio";
</style>
