import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppCounter from "../AppCounter.vue";

describe("AppCounter", () => {
  it("отображает текущее значение", () => {
    const wrapper = mount(AppCounter, {
      props: {
        modelValue: 5,
      },
    });

    const input = wrapper.find('input[type="text"]');
    expect(input.element.value).toBe("5");
  });

  it("увеличивает значение при клике на кнопку плюс", async () => {
    const wrapper = mount(AppCounter, {
      props: {
        modelValue: 2,
      },
    });

    const plusButton = wrapper.findAll("button").find((btn) => 
      btn.classes().includes("counter__button--plus")
    );

    expect(plusButton).toBeDefined();
    if (plusButton) {
      await plusButton.trigger("click");
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([3]);
    }
  });

  it("уменьшает значение при клике на кнопку минус", async () => {
    const wrapper = mount(AppCounter, {
      props: {
        modelValue: 2,
      },
    });

    const minusButton = wrapper.findAll("button").find((btn) => 
      btn.classes().includes("counter__button--minus")
    );

    expect(minusButton).toBeDefined();
    if (minusButton) {
      await minusButton.trigger("click");
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([1]);
    }
  });

  it("не уменьшает значение ниже minValue", async () => {
    const wrapper = mount(AppCounter, {
      props: {
        modelValue: 0,
        minValue: 0,
      },
    });

    const minusButton = wrapper.findAll("button").find((btn) => 
      btn.classes().includes("counter__button--minus")
    );

    expect(minusButton).toBeDefined();
    if (minusButton) {
      await minusButton.trigger("click");
      // Не должно быть события, так как значение уже минимальное
      expect(wrapper.emitted("update:modelValue")).toBeFalsy();
    }
  });

  it("не увеличивает значение выше maxValue", async () => {
    const wrapper = mount(AppCounter, {
      props: {
        modelValue: 3,
        maxValue: 3,
      },
    });

    const plusButton = wrapper.findAll("button").find((btn) => 
      btn.classes().includes("counter__button--plus")
    );

    expect(plusButton).toBeDefined();
    if (plusButton) {
      await plusButton.trigger("click");
      // Не должно быть события, так как значение уже максимальное
      expect(wrapper.emitted("update:modelValue")).toBeFalsy();
    }
  });

  it("отключает кнопку минус когда значение равно minValue", () => {
    const wrapper = mount(AppCounter, {
      props: {
        modelValue: 0,
        minValue: 0,
      },
    });

    const minusButton = wrapper.findAll("button").find((btn) => 
      btn.classes().includes("counter__button--minus")
    );

    expect(minusButton?.attributes("disabled")).toBeDefined();
  });

  it("отключает кнопку плюс когда значение равно maxValue", () => {
    const wrapper = mount(AppCounter, {
      props: {
        modelValue: 3,
        maxValue: 3,
      },
    });

    const plusButton = wrapper.findAll("button").find((btn) => 
      btn.classes().includes("counter__button--plus")
    );

    expect(plusButton?.attributes("disabled")).toBeDefined();
  });

  it("имеет input только для чтения", () => {
    const wrapper = mount(AppCounter, {
      props: {
        modelValue: 5,
      },
    });

    const input = wrapper.find('input[type="text"]');
    expect(input.attributes("readonly")).toBeDefined();
  });

  it("корректно использует значения по умолчанию для minValue и maxValue", () => {
    const wrapper = mount(AppCounter, {
      props: {
        modelValue: 1,
      },
    });

    // При значении 1 и minValue 0, кнопка минус не должна быть отключена
    const minusButton = wrapper.findAll("button").find((btn) => 
      btn.classes().includes("counter__button--minus")
    );
    expect(minusButton?.attributes("disabled")).toBeUndefined();
  });
});

