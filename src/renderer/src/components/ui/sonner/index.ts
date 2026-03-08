import { toast } from "vue-sonner"
import type { ExternalToast, ToasterProps } from "vue-sonner"

export { default as Toaster } from "./Sonner.vue"
export { toast }

type ToastKind = "default" | "success" | "info" | "warning" | "error" | "loading"
type ToastPosition = NonNullable<ToasterProps["position"]>

interface ShowToastOptions extends Omit<ExternalToast, "position"> {
  type?: ToastKind
  position?: ToastPosition
}

export function showToast(message: string, options: ShowToastOptions = {}) {
  const { type = "default", position = "top-center", ...rest } = options
  if (type === "default") {
    return toast(message, { position, ...rest })
  }
  return toast[type](message, { position, ...rest })
}
