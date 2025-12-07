<template>
  <div class="content__diameter">
    <div class="sheet">
      <h2 class="title title--small sheet__title">Выберите размер</h2>

      <div class="sheet__content diameter">
        <label
          v-for="size in sizeList"
          :key="size.id"
          :class="`diameter__input diameter__input--${sizesKeys[size.id]}`"
        >
          <input
            v-model="selectedSizeId"
            type="radio"
            name="diameter"
            :value="size.id"
            class="visually-hidden"
          />
          <span>{{ size.name }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Size } from "@/types";

interface Props {
  modelValue: Size | null;
  sizeList: Size[];
  sizesKeys: Record<number, string>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Size): void;
}>();

const sizesMap = ref(
  props.sizeList.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<number, Size>,
  ),
);

const selectedSizeId = computed({
  get() {
    return props.modelValue?.id ?? 0;
  },
  set(id) {
    const size = sizesMap.value[id];
    if (size) {
      emit("update:modelValue", size);
    }
  },
});
</script>

<style lang="scss">
@use "@/assets/scss/blocks/diameter";
</style>
