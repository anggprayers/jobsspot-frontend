"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
    isCloseDisabled?: boolean;
};

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    closeOnBackdropClick = false,
    closeOnEscape = true,
    isCloseDisabled = false,
}: ModalProps) {
    useEffect(() => {
        if (!isOpen || !closeOnEscape) {
            return;
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key !== "Escape" || isCloseDisabled) {
                return;
            }

            onClose();
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [closeOnEscape, isCloseDisabled, isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    function handleBackdropMouseDown() {
        if (closeOnBackdropClick && !isCloseDisabled) {
            onClose();
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onMouseDown={handleBackdropMouseDown}
        >
            <div
                className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="modal-title" className="text-xl font-semibold text-slate-950">
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-1 text-sm text-slate-600">{description}</p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isCloseDisabled}
                        aria-label="Close modal"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mt-6">{children}</div>
            </div>
        </div>
    );
}
