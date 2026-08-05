const PENDING_AUTH_RETURN_URL_STORAGE_KEY =
    "jobsspot-pending-auth-return-url";

const PENDING_AUTH_RETURN_URL_MAX_AGE_MS =
    2 * 60 * 60 * 1000;

type StoredAuthReturnUrl = {
    path: string;
    createdAt: number;
};

export function isSafeInternalPath(
    value: string | null | undefined,
): value is string {
    if (
        !value ||
        !value.startsWith("/") ||
        value.startsWith("//")
    ) {
        return false;
    }

    try {
        const baseUrl = new URL(
            "https://jobsspot.local",
        );
        const resolvedUrl = new URL(
            value,
            baseUrl,
        );

        return (
            resolvedUrl.origin ===
            baseUrl.origin
        );
    } catch {
        return false;
    }
}

export function rememberAuthReturnUrl(
    value: string | null | undefined,
): void {
    if (
        typeof window === "undefined" ||
        !isSafeInternalPath(value)
    ) {
        return;
    }

    const storedValue: StoredAuthReturnUrl = {
        path: value,
        createdAt: Date.now(),
    };

    try {
        window.localStorage.setItem(
            PENDING_AUTH_RETURN_URL_STORAGE_KEY,
            JSON.stringify(storedValue),
        );
    } catch {
        // Authentication still works when browser storage is unavailable.
    }
}

export function getRememberedAuthReturnUrl(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const storedValue =
            window.localStorage.getItem(
                PENDING_AUTH_RETURN_URL_STORAGE_KEY,
            );

        if (!storedValue) {
            return null;
        }

        const parsedValue = JSON.parse(
            storedValue,
        ) as Partial<StoredAuthReturnUrl>;

        const isFresh =
            typeof parsedValue.createdAt ===
                "number" &&
            Date.now() - parsedValue.createdAt <=
                PENDING_AUTH_RETURN_URL_MAX_AGE_MS;

        if (
            !isFresh ||
            !isSafeInternalPath(parsedValue.path)
        ) {
            clearRememberedAuthReturnUrl();
            return null;
        }

        return parsedValue.path;
    } catch {
        clearRememberedAuthReturnUrl();
        return null;
    }
}

export function clearRememberedAuthReturnUrl(): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.removeItem(
            PENDING_AUTH_RETURN_URL_STORAGE_KEY,
        );
    } catch {
        // Nothing else is required when browser storage is unavailable.
    }
}

export function getAuthDestination({
    returnUrl,
    defaultPath,
    fallbackPath,
}: {
    returnUrl?: string | null;
    defaultPath?: string | null;
    fallbackPath: string;
}): string {
    if (isSafeInternalPath(returnUrl)) {
        return returnUrl;
    }

    const rememberedReturnUrl =
        getRememberedAuthReturnUrl();

    if (rememberedReturnUrl) {
        return rememberedReturnUrl;
    }

    if (isSafeInternalPath(defaultPath)) {
        return defaultPath;
    }

    return fallbackPath;
}
