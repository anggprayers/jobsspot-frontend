"use client";

import { useMutation } from "@tanstack/react-query";

import { sendVerificationEmail } from "../api/sendVerificationEmail";
import { verifyEmail } from "../api/verifyEmail";
import { useAuthStore } from "../store/authStore";
import type { VerifyEmailRequest } from "../types/auth";
import { publishAuthTabEvent } from "../utils/authTabSync";

function markCurrentUserVerified(): void {
    const {
        user,
        setUser,
    } = useAuthStore.getState();

    if (
        user &&
        !user.isEmailVerified
    ) {
        setUser({
            ...user,
            isEmailVerified: true,
        });
    }
}

export function useSendVerificationEmail() {
    return useMutation({
        mutationFn: sendVerificationEmail,

        onSuccess: (response) => {
            if (
                response.alreadyVerified
            ) {
                markCurrentUserVerified();
            }
        },
    });
}

export function useVerifyEmail() {
    return useMutation({
        mutationFn: (
            data: VerifyEmailRequest,
        ) => verifyEmail(data),

        onSuccess: (response) => {
            if (response.authenticated) {
                useAuthStore
                    .getState()
                    .setSession(
                        response.user,
                        response.accessToken,
                    );

                publishAuthTabEvent(
                    "session-updated",
                );

                return;
            }

            markCurrentUserVerified();
        },
    });
}
