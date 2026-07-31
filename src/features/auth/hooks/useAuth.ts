import { useAuthStore } from "../store/authStore";

export function useAuth() {
    const user = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);
    const activeCompanyId = useAuthStore((state) => state.activeCompanyId);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitializing = useAuthStore((state) => state.isInitializing);
    const setActiveCompany = useAuthStore((state) => state.setActiveCompany);
    const clearSession = useAuthStore((state) => state.clearSession);

    const activeMembership =
        user?.memberships.find((membership) => membership.companyId === activeCompanyId) ?? null;

    const activeCompanyRole = activeMembership?.role ?? null;

    const isEmployer = user !== null && user.memberships.length > 0;

    return {
        user,
        accessToken,

        isAuthenticated,
        isInitializing,
        isEmployer,

        activeCompanyId,
        activeMembership,
        activeCompanyRole,

        setActiveCompany,
        clearSession,
    };
}
