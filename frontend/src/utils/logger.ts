/**
 * Утилита для логирования с поддержкой разных уровней и режимов
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
}

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// Конфигурация по умолчанию
const defaultConfig: LoggerConfig = {
  enabled: isDev || !isProd, // Включаем в dev, отключаем только в production
  minLevel: isDev ? 'debug' : 'warn', // В dev показываем все, в prod только warnings и errors
};

// Порядок уровней для сравнения
const levelOrder: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) {
      return false;
    }
    return levelOrder[level] >= levelOrder[this.config.minLevel];
  }

  /**
   * Логирование для отладки (только в dev режиме)
   */
  debug(...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug('[DEBUG]', ...args);
    }
  }

  /**
   * Информационные сообщения
   */
  info(...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info('[INFO]', ...args);
    }
  }

  /**
   * Предупреждения
   */
  warn(...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', ...args);
    }
    // В production можно отправлять warnings в систему мониторинга
    if (isProd) {
      this.sendToMonitoring('warn', args);
    }
  }

  /**
   * Ошибки (всегда логируются, даже в production)
   */
  error(...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', ...args);
    }
    // В production отправляем ошибки в систему мониторинга
    if (isProd) {
      this.sendToMonitoring('error', args);
    }
  }

  /**
   * Группировка логов для лучшей читаемости
   */
  group(label: string, collapsed: boolean = false): void {
    if (this.config.enabled) {
      if (collapsed) {
        console.groupCollapsed(label);
      } else {
        console.group(label);
      }
    }
  }

  /**
   * Закрытие группы
   */
  groupEnd(): void {
    if (this.config.enabled) {
      console.groupEnd();
    }
  }

  /**
   * Логирование объекта в виде таблицы
   */
  table(data: any): void {
    if (this.config.enabled) {
      console.table(data);
    }
  }

  /**
   * Отправка в систему мониторинга (например, Sentry)
   * Можно расширить для интеграции с реальными системами
   */
  private sendToMonitoring(level: LogLevel, args: any[]): void {
    // Здесь можно добавить интеграцию с Sentry, LogRocket и т.д.
    // Например:
    // if (window.Sentry && level === 'error') {
    //   window.Sentry.captureException(args[0]);
    // }
    
    // Для демонстрации просто логируем в отдельном месте
    if (level === 'error') {
      // Можно сохранять критичные ошибки в localStorage для анализа
      try {
        const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
        errors.push({
          level,
          message: args.map(arg => 
            arg instanceof Error ? arg.message : String(arg)
          ).join(' '),
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        });
        // Храним только последние 50 ошибок
        errors.splice(0, errors.length - 50);
        localStorage.setItem('app_errors', JSON.stringify(errors));
      } catch (e) {
        // Игнорируем ошибки при сохранении
      }
    }
  }

  /**
   * Настройка логгера
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Экспортируем singleton экземпляр
export const logger = new Logger();

// Экспортируем класс для создания кастомных экземпляров
export { Logger };
export type { LogLevel, LoggerConfig };

// Для удобства экспортируем методы напрямую
export const log = {
  debug: (...args: any[]) => logger.debug(...args),
  info: (...args: any[]) => logger.info(...args),
  warn: (...args: any[]) => logger.warn(...args),
  error: (...args: any[]) => logger.error(...args),
  group: (label: string, collapsed?: boolean) => logger.group(label, collapsed),
  groupEnd: () => logger.groupEnd(),
  table: (data: any) => logger.table(data),
};

