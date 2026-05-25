/**
 * Dispatch in-app modal from anywhere (including deep client modules without hooks).
 * Listened to by ModalProvider.
 */
export function showAppModal(message, options = {}) {
  if (typeof window === "undefined") return;
  const { title, variant } = options;
  window.dispatchEvent(
    new CustomEvent("pioneer-app-modal", {
      detail: {
        message: String(message ?? ""),
        title: title ?? (variant === "success" ? "Success" : variant === "error" ? "Error" : "Notice"),
        variant: variant ?? "info",
      },
    })
  );
}

/**
 * Promise-based confirm dialog (replaces window.confirm).
 * @returns {Promise<boolean>} true if user confirmed
 */
export function confirmAppModal(message, options = {}) {
  if (typeof window === "undefined") return Promise.resolve(false);
  const { title, confirmLabel, cancelLabel } = options;
  return new Promise((resolve) => {
    window.dispatchEvent(
      new CustomEvent("pioneer-app-confirm", {
        detail: {
          message: String(message ?? ""),
          title: title ?? "Please confirm",
          confirmLabel: confirmLabel ?? "OK",
          cancelLabel: cancelLabel ?? "Cancel",
          resolve,
        },
      })
    );
  });
}
