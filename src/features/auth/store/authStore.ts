import { create } from "zustand";

import type { AuthUser } from "../types/auth";

const ACTIVE_COMPANY_STORAGE_KEY = "jobsspot-active-company-id";

function getStoredActiveCompanyId(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        return window.localStorage.getItem(ACTIVE_COMPANY_STORAGE_KEY);
    } catch {
        return null;
    }
}

function storeActiveCompanyId(companyId: string): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(ACTIVE_COMPANY_STORAGE_KEY, companyId);
    } catch {
        // The application can still work without persisting this preference.
    }
}

function getValidActiveCompanyId(user: AuthUser, preferredCompanyId: string | null): string | null {
    const preferredMembershipExists =
        preferredCompanyId !== null &&
        user.memberships.some((membership) => membership.companyId === preferredCompanyId);

    if (preferredMembershipExists) {
        return preferredCompanyId;
    }

    return user.memberships[0]?.companyId ?? null;
}

type AuthStore = {
    user: AuthUser | null;
    accessToken: string | null;
    activeCompanyId: string | null;
    isAuthenticated: boolean;
    isInitializing: boolean;

    setSession: (user: AuthUser, accessToken: string) => void;
    setUser: (user: AuthUser) => void;
    setAccessToken: (accessToken: string) => void;
    setActiveCompany: (companyId: string) => void;
    setInitializing: (isInitializing: boolean) => void;
    clearSession: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    accessToken: null,
    activeCompanyId: null,
    isAuthenticated: false,
    isInitializing: true,

    setSession: (user, accessToken) =>
        set((state) => {
            const preferredCompanyId = state.activeCompanyId ?? getStoredActiveCompanyId();

            const activeCompanyId = getValidActiveCompanyId(user, preferredCompanyId);

            if (activeCompanyId) {
                storeActiveCompanyId(activeCompanyId);
            }

            return {
                user,
                accessToken,
                isAuthenticated: true,
                activeCompanyId,
            };
        }),

    setUser: (user) =>
        set((state) => {
            const preferredCompanyId = state.activeCompanyId ?? getStoredActiveCompanyId();

            const activeCompanyId = getValidActiveCompanyId(user, preferredCompanyId);

            if (activeCompanyId) {
                storeActiveCompanyId(activeCompanyId);
            }

            return {
                user,
                activeCompanyId,
            };
        }),

    setAccessToken: (accessToken) =>
        set({
            accessToken,
            isAuthenticated: true,
        }),

    setActiveCompany: (companyId) =>
        set((state) => {
            const hasMembership = state.user?.memberships.some(
                (membership) => membership.companyId === companyId,
            );

            if (!hasMembership) {
                return state;
            }

            storeActiveCompanyId(companyId);

            return {
                activeCompanyId: companyId,
            };
        }),

    setInitializing: (isInitializing) =>
        set({
            isInitializing,
        }),

    clearSession: () =>
        set({
            user: null,
            accessToken: null,
            activeCompanyId: null,
            isAuthenticated: false,
            isInitializing: false,
        }),
}));
