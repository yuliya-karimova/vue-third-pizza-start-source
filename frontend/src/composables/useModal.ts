import { ref } from "vue";

export interface ModalOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  isDanger?: boolean;
}

export function useModal() {
  const isVisible = ref(false);
  const modalOptions = ref<ModalOptions>({
    title: "",
    message: "",
    confirmText: "Да",
    cancelText: "Отмена",
    showCancelButton: true,
    isDanger: false,
  });
  const resolveRef = ref<((value: boolean) => void) | null>(null);

  const show = (options: ModalOptions = {}): Promise<boolean> => {
    modalOptions.value = {
      title: options.title || "Подтверждение",
      message: options.message || "",
      confirmText: options.confirmText || "Да",
      cancelText: options.cancelText || "Отмена",
      showCancelButton: options.showCancelButton !== false,
      isDanger: options.isDanger || false,
    };
    
    isVisible.value = true;

    return new Promise((resolve) => {
      resolveRef.value = resolve;
    });
  };

  const confirm = () => {
    if (resolveRef.value) {
      resolveRef.value(true);
      resolveRef.value = null;
    }
    isVisible.value = false;
  };

  const cancel = () => {
    if (resolveRef.value) {
      resolveRef.value(false);
      resolveRef.value = null;
    }
    isVisible.value = false;
  };

  const reset = () => {
    isVisible.value = false;
    modalOptions.value = {
      title: "",
      message: "",
      confirmText: "Да",
      cancelText: "Отмена",
      showCancelButton: true,
      isDanger: false,
    };
    if (resolveRef.value) {
      resolveRef.value(false);
      resolveRef.value = null;
    }
  };

  return {
    isVisible,
    modalOptions,
    show,
    confirm,
    cancel,
    reset,
  };
}

