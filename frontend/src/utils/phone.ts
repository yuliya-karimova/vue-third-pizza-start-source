/**
 * Утилиты для работы с телефонными номерами
 */

/**
 * Формат российского телефона: +7 999-999-99-99
 */
export const PHONE_PATTERN = /^\+7\s\d{3}-\d{3}-\d{2}-\d{2}$/;

/**
 * Упрощенный паттерн для проверки (только цифры после +7)
 */
const PHONE_DIGITS_PATTERN = /^\+?7?\d{10}$/;

/**
 * Удаляет все нецифровые символы из номера телефона
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Форматирует номер телефона в формат +7 999-999-99-99
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);
  
  // Если номер начинается с 8, заменяем на 7
  let digits = cleaned;
  if (digits.startsWith("8") && digits.length === 11) {
    digits = "7" + digits.slice(1);
  }
  
  // Если номер не начинается с 7, добавляем 7
  if (!digits.startsWith("7") && digits.length === 10) {
    digits = "7" + digits;
  }
  
  // Если номер начинается с +7, убираем +
  if (digits.startsWith("+7")) {
    digits = digits.slice(1);
  }
  
  // Форматируем в +7 999-999-99-99
  if (digits.startsWith("7") && digits.length === 11) {
    const code = digits.slice(0, 1);
    const part1 = digits.slice(1, 4);
    const part2 = digits.slice(4, 7);
    const part3 = digits.slice(7, 9);
    const part4 = digits.slice(9, 11);
    return `+${code} ${part1}-${part2}-${part3}-${part4}`;
  }
  
  return phone;
}

/**
 * Применяет маску ввода при вводе телефона
 * @param value - текущее значение поля
 * @returns отформатированное значение
 */
export function applyPhoneMask(value: string): string {
  // Удаляем все нецифровые символы кроме +
  let cleaned = value.replace(/[^\d+]/g, "");
  
  // Ограничиваем длину (максимум 11 цифр + 1 символ +)
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.slice(0, 12);
  } else if (cleaned.startsWith("8")) {
    cleaned = cleaned.slice(0, 11);
  } else if (cleaned.startsWith("7")) {
    cleaned = "+" + cleaned.slice(0, 11);
  } else {
    cleaned = cleaned.slice(0, 10);
  }
  
  // Если начинается с 8, заменяем на +7
  if (cleaned.startsWith("8") && cleaned.length > 1) {
    cleaned = "+7" + cleaned.slice(1);
  }
  
  // Если начинается с 7, но нет +, добавляем +
  if (cleaned.startsWith("7") && !cleaned.startsWith("+7")) {
    cleaned = "+" + cleaned;
  }
  
  // Если не начинается с +, но есть цифры, добавляем +7
  if (!cleaned.startsWith("+") && cleaned.length > 0) {
    cleaned = "+7" + cleaned;
  }
  
  // Форматируем по мере ввода
  const digits = cleaned.replace(/\D/g, "");
  
  if (digits.length === 0) {
    return "";
  }
  
  if (digits.length <= 1) {
    return "+7";
  }
  
  if (digits.length <= 4) {
    return `+7 ${digits.slice(1)}`;
  }
  
  if (digits.length <= 7) {
    return `+7 ${digits.slice(1, 4)}-${digits.slice(4)}`;
  }
  
  if (digits.length <= 9) {
    return `+7 ${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // Полный формат: +7 999-999-99-99
  return `+7 ${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
}

/**
 * Валидация телефонного номера
 * @param phone - номер телефона
 * @returns объект с результатом валидации
 */
export function validatePhone(phone: string): {
  isValid: boolean;
  error?: string;
} {
  if (!phone || !phone.trim()) {
    return {
      isValid: false,
      error: "Телефон обязателен для заполнения",
    };
  }
  
  const cleaned = cleanPhoneNumber(phone);
  
  // Проверяем количество цифр
  if (cleaned.length < 10) {
    return {
      isValid: false,
      error: "Телефон должен содержать минимум 10 цифр",
    };
  }
  
  // Проверяем формат
  if (!PHONE_DIGITS_PATTERN.test(cleaned) && cleaned.length < 11) {
    return {
      isValid: false,
      error: "Неверный формат телефона",
    };
  }
  
  // Проверяем, что номер начинается с 7 или 8
  if (!cleaned.startsWith("7") && !cleaned.startsWith("8")) {
    return {
      isValid: false,
      error: "Телефон должен начинаться с +7 или 8",
    };
  }
  
  // Проверяем полный формат
  const formatted = formatPhoneNumber(phone);
  if (!PHONE_PATTERN.test(formatted)) {
    return {
      isValid: false,
      error: "Неверный формат телефона. Используйте формат: +7 999-999-99-99",
    };
  }
  
  return {
    isValid: true,
  };
}

/**
 * Нормализует номер телефона для отправки на сервер
 * @param phone - номер телефона
 * @returns нормализованный номер (только цифры с кодом страны)
 */
export function normalizePhone(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);
  
  // Если начинается с 8, заменяем на 7
  if (cleaned.startsWith("8") && cleaned.length === 11) {
    return "7" + cleaned.slice(1);
  }
  
  // Если номер из 10 цифр, добавляем 7
  if (cleaned.length === 10) {
    return "7" + cleaned;
  }
  
  // Если номер из 11 цифр и начинается с 7
  if (cleaned.length === 11 && cleaned.startsWith("7")) {
    return cleaned;
  }
  
  return cleaned;
}

