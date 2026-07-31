"use client";

import { useEffect, useRef } from "react";

import { getCurrentUser } from "../api/getCurrentUser";
import { refreshSession } from "../api/refreshSession";
import { useAuthStore } from "../store/authStore";

type AuthProviderProps = Readonly<{
    children: React.ReactNode;
}>;

export default function AuthProvider({ children }: AuthProviderProps) {
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) {
            return;
        }

        hasInitialized.current = true;

        async function initializeSession() {
            const { setSession, clearSession, setInitializing } = useAuthStore.getState();

            try {
                const refreshResponse = await refreshSession();

                if (!refreshResponse) {
                    clearSession();
                    return;
                }

                const currentUserResponse = await getCurrentUser(refreshResponse.accessToken);

                setSession(currentUserResponse.user, refreshResponse.accessToken);
            } catch {
                clearSession();
            } finally {
                setInitializing(false);
            }
        }

        void initializeSession();
    }, []);

    return children;
}
