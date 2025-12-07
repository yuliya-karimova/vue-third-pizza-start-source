import { getCurrentInstance } from "vue";

export interface ToastOptions {
  duration?: number;
}

export function useToast() {
  const instance = getCurrentInstance();
  
  // Получаем доступ к toast компоненту через глобальный API
  const toast = (window as any).__toast;

  if (!toast) {
    console.warn("Toast component not found. Make sure ToastNotification is mounted.");
    // Fallback на обычный alert если toast не доступен
    return {
      success: (message: string) => alert(message),
      error: (message: string) => alert(message),
      warning: (message: string) => alert(message),
      info: (message: string) => alert(message),
    };
  }

  return {
    success: (message: string, duration?: number) => toast.success(message, duration),
    error: (message: string, duration?: number) => toast.error(message, duration),
    warning: (message: string, duration?: number) => toast.warning(message, duration),
    info: (message: string, duration?: number) => toast.info(message, duration),
  };
}

