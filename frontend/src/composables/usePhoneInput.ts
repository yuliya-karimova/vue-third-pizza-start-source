import { ref, computed } from "vue";
import { applyPhoneMask, validatePhone, formatPhoneNumber, normalizePhone } from "@/utils/phone";

/**
 * Composable для работы с полем ввода телефона
 */
export function usePhoneInput(initialValue: string = "") {
  const phone = ref(initialValue);
  const error = ref<string | null>(null);
  const touched = ref(false);

  /**
   * Применяет маску при вводе
   */
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    // Сохраняем позицию курсора
    const cursorPosition = target.selectionStart || 0;
    
    // Применяем маску
    const formatted = applyPhoneMask(value);
    phone.value = formatted;
    
    // Восстанавливаем позицию курсора с учетом изменений
    const nextCursorPosition = getNextCursorPosition(value, formatted, cursorPosition);
    
    // Устанавливаем позицию курсора после обновления DOM
    requestAnimationFrame(() => {
      target.setSelectionRange(nextCursorPosition, nextCursorPosition);
    });
    
    // Очищаем ошибку при вводе
    if (error.value) {
      error.value = null;
    }
  };

  /**
   * Валидация при потере фокуса
   */
  const handleBlur = () => {
    touched.value = true;
    validate();
  };

  /**
   * Валидация телефона
   */
  const validate = (): boolean => {
    const result = validatePhone(phone.value);
    error.value = result.isValid ? null : (result.error || null);
    return result.isValid;
  };

  /**
   * Нормализованное значение для отправки на сервер
   */
  const normalizedPhone = computed(() => normalizePhone(phone.value));

  /**
   * Отформатированное значение
   */
  const formattedPhone = computed(() => formatPhoneNumber(phone.value));

  /**
   * Сброс поля
   */
  const reset = () => {
    phone.value = "";
    error.value = null;
    touched.value = false;
  };

  /**
   * Установка значения
   */
  const setValue = (value: string | unknown) => {
    // Защита от передачи объекта вместо строки
    if (typeof value === "object" && value !== null) {
      console.warn("usePhoneInput.setValue: получен объект вместо строки", value);
      phone.value = "";
      error.value = null;
      return;
    }
    
    const stringValue = String(value || "");
    if (stringValue) {
      phone.value = formatPhoneNumber(stringValue);
    } else {
      phone.value = "";
    }
    error.value = null;
  };

  return {
    phone,
    error,
    touched,
    handleInput,
    handleBlur,
    validate,
    normalizedPhone,
    formattedPhone,
    reset,
    setValue,
  };
}

/**
 * Вычисляет новую позицию курсора после применения маски
 */
function getNextCursorPosition(
  oldValue: string,
  newValue: string,
  oldCursorPosition: number
): number {
  // Подсчитываем количество цифр до курсора в старом значении
  const digitsBeforeCursor = (oldValue.slice(0, oldCursorPosition).match(/\d/g) || []).length;
  
  // Находим позицию в новом значении, соответствующую этому количеству цифр
  let digitCount = 0;
  for (let i = 0; i < newValue.length; i++) {
    if (/\d/.test(newValue[i])) {
      digitCount++;
      if (digitCount === digitsBeforeCursor) {
        return i + 1;
      }
    }
  }
  
  return newValue.length;
}

