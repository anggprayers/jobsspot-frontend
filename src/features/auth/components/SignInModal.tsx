"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import LoginForm from "./LoginForm";

type SignInModalProps = Readonly<{
    isOpen: boolean;
    onClose: () => void;
}>;

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sign-in-title"
            onMouseDown={onClose}
        >
            <div
                className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close sign-in dialog"
                    className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                    <X size={20} />
                </button>

                <div>
                    <p className="text-sm font-semibold text-blue-600">JobsSpot</p>

                    <h2 id="sign-in-title" className="mt-2 text-2xl font-bold text-slate-950">
                        Welcome back
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Sign in to manage your profile, applications, saved jobs, or employer
                        account.
                    </p>
                </div>

                <div className="mt-6">
                    <LoginForm onSuccess={onClose} />
                </div>

                <div className="mt-6 flex items-center justify-between text-sm">
                    <Link
                        href="/forgot-password"
                        onClick={onClose}
                        className="font-medium text-blue-600 hover:text-blue-700"
                    >
                        Forgot password?
                    </Link>

                    <Link
                        href="/register"
                        onClick={onClose}
                        className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Create account
                    </Link>
                </div>
            </div>
        </div>
    );
}
