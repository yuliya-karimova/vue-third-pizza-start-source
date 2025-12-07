<template>
  <div class="content__dough">
    <div class="sheet">
      <h2 class="title title--small sheet__title">Выберите тесто</h2>

      <div class="sheet__content dough">
        <label
          v-for="dough in doughList"
          :key="dough.id"
          :class="`dough__input dough__input--${doughKeys[dough.id]}`"
        >
          <input
            v-model="selectedDoughId"
            type="radio"
            name="dought"
            :value="dough.id"
            class="visually-hidden"
          />
          <b>{{ dough.name }}</b>
          <span>{{ dough.description }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Dough } from "@/types";

interface Props {
  modelValue: Dough;
  doughList: Dough[];
  doughKeys: Record<number, string>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Dough): void;
}>();

const doughMap = ref(
  props.doughList.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<number, Dough>,
  ),
);

const selectedDoughId = computed({
  get() {
    return props.modelValue.id;
  },
  set(id) {
    emit("update:modelValue", doughMap.value[id]);
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/blocks/dough.scss";
</style>
