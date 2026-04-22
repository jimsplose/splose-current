"use client";

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

/**
 * Mount once, high in the tree (see `src/app/layout.tsx`). Imperative API:
 *
 *     import { toast } from "@/components/ds";
 *
 *     toast.success("Invoice saved");
 *     toast.error("Couldn't reach Stripe", { description: "Retrying in 5s." });
 *     toast.promise(createInvoice(), {
 *       loading: "Saving invoice...",
 *       success: "Invoice saved",
 *       error: (err) => `Couldn't save: ${err.message}`,
 *     });
 *
 * For blocking questions use `AlertDialog`; for inline validation errors use
 * `FormField`'s `error` prop. Toast is for non-blocking transient feedback.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          borderRadius: 8,
          border: "1px solid var(--color-border, #e5e5e5)",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
        },
      }}
    />
  );
}

/**
 * Imperative toast API. Re-exports sonner's `toast` object. Default
 * durations: 4s for success/info, 6s for error. Consumers never import
 * from `sonner` directly — the DS owns the brand and the shape.
 */
export const toast = sonnerToast;

export default toast;
