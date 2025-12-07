# Logger Utility

Утилита для логирования с поддержкой разных уровней и режимов работы.

## Использование

### Импорт

```typescript
import { logger } from "@/utils/logger";
// или
import { log } from "@/utils/logger";
```

### Уровни логирования

```typescript
// Отладочные сообщения (только в dev режиме)
logger.debug("Debug message", data);

// Информационные сообщения
logger.info("Info message", data);

// Предупреждения (логируются всегда)
logger.warn("Warning message", data);

// Ошибки (логируются всегда, в production отправляются в мониторинг)
logger.error("Error message", error);
```

### Дополнительные методы

```typescript
// Группировка логов
logger.group("Group label");
logger.debug("Message 1");
logger.debug("Message 2");
logger.groupEnd();

// Свернутая группа
logger.group("Collapsed group", true);
logger.debug("Hidden messages");
logger.groupEnd();

// Табличное отображение
logger.table(arrayOfObjects);
```

### Настройка

```typescript
import { logger } from "@/utils/logger";

// Отключить все логи
logger.configure({ enabled: false });

// Показывать только ошибки
logger.configure({ minLevel: "error" });

// Включить все логи даже в production
logger.configure({ enabled: true, minLevel: "debug" });
```

## Поведение по умолчанию

- **Development режим**: все логи включены, минимальный уровень - `debug`
- **Production режим**: логи включены, но минимальный уровень - `warn` (показываются только warnings и errors)

## Отправка в мониторинг

В production режиме ошибки (`error`) автоматически сохраняются в localStorage для последующего анализа. Это можно расширить для интеграции с системами мониторинга (Sentry, LogRocket и т.д.).

## Примеры замены

### Было:
```typescript
console.log("Debug info:", data);
console.error("Error occurred:", error);
console.warn("Warning:", message);
```

### Стало:
```typescript
logger.debug("Debug info:", data);
logger.error("Error occurred:", error);
logger.warn("Warning:", message);
```

