"use client";

import {
    useEffect,
    useRef,
} from "react";

import { refreshSession } from "../api/refreshSession";
import { useAuthStore } from "../store/authStore";
import {
    AUTH_TAB_EVENT_STORAGE_KEY,
    parseAuthTabEvent,
} from "../utils/authTabSync";

type AuthProviderProps = Readonly<{
    children: React.ReactNode;
}>;

export default function AuthProvider({
    children,
}: AuthProviderProps) {
    const hasInitialized =
        useRef(false);

    useEffect(() => {
        if (hasInitialized.current) {
            return;
        }

        hasInitialized.current = true;

        let isSynchronizing = false;
        let isDisposed = false;

        async function synchronizeSession(
            showInitializingState = false,
        ) {
            if (
                isSynchronizing ||
                isDisposed
            ) {
                return;
            }

            isSynchronizing = true;

            const {
                setSession,
                clearSession,
                setInitializing,
            } = useAuthStore.getState();

            if (showInitializingState) {
                setInitializing(true);
            }

            try {
                const refreshResponse =
                    await refreshSession();

                if (
                    isDisposed
                ) {
                    return;
                }

                if (!refreshResponse) {
                    clearSession();
                    return;
                }

                setSession(
                    refreshResponse.user,
                    refreshResponse.accessToken,
                );
            } catch {
                if (!isDisposed) {
                    clearSession();
                }
            } finally {
                if (
                    !isDisposed &&
                    showInitializingState
                ) {
                    setInitializing(false);
                }

                isSynchronizing = false;
            }
        }

        function handleStorageEvent(
            event: StorageEvent,
        ) {
            if (
                event.key !==
                AUTH_TAB_EVENT_STORAGE_KEY
            ) {
                return;
            }

            const authEvent =
                parseAuthTabEvent(
                    event.newValue,
                );

            if (!authEvent) {
                return;
            }

            if (
                authEvent.type ===
                "session-cleared"
            ) {
                useAuthStore
                    .getState()
                    .clearSession();

                return;
            }

            void synchronizeSession();
        }

        function handleVisibilityChange() {
            if (
                document.visibilityState !==
                "visible"
            ) {
                return;
            }

            const {
                isAuthenticated,
                isInitializing,
            } = useAuthStore.getState();

            if (
                !isAuthenticated &&
                !isInitializing
            ) {
                void synchronizeSession();
            }
        }

        function handleWindowFocus() {
            const {
                isAuthenticated,
                isInitializing,
            } = useAuthStore.getState();

            if (
                !isAuthenticated &&
                !isInitializing
            ) {
                void synchronizeSession();
            }
        }

        window.addEventListener(
            "storage",
            handleStorageEvent,
        );
        window.addEventListener(
            "focus",
            handleWindowFocus,
        );
        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange,
        );

        void synchronizeSession(true);

        return () => {
            isDisposed = true;

            window.removeEventListener(
                "storage",
                handleStorageEvent,
            );
            window.removeEventListener(
                "focus",
                handleWindowFocus,
            );
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    }, []);

    return children;
}
