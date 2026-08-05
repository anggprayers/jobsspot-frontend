export const AUTH_TAB_EVENT_STORAGE_KEY =
    "jobsspot-auth-tab-event";

export type AuthTabEventType =
    | "session-updated"
    | "session-cleared";

export type AuthTabEvent = {
    type: AuthTabEventType;
    occurredAt: number;
    nonce: string;
};

function createNonce(): string {
    if (
        typeof crypto !== "undefined" &&
        "randomUUID" in crypto
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random()}`;
}

export function publishAuthTabEvent(
    type: AuthTabEventType,
): void {
    if (typeof window === "undefined") {
        return;
    }

    const event: AuthTabEvent = {
        type,
        occurredAt: Date.now(),
        nonce: createNonce(),
    };

    try {
        window.localStorage.setItem(
            AUTH_TAB_EVENT_STORAGE_KEY,
            JSON.stringify(event),
        );
    } catch {
        // Cross-tab synchronization is helpful but not
        // required for the authenticated session to work.
    }
}

export function parseAuthTabEvent(
    rawValue: string | null,
): AuthTabEvent | null {
    if (!rawValue) {
        return null;
    }

    try {
        const parsed = JSON.parse(
            rawValue,
        ) as Partial<AuthTabEvent>;

        if (
            (parsed.type !==
                "session-updated" &&
                parsed.type !==
                    "session-cleared") ||
            typeof parsed.occurredAt !==
                "number" ||
            typeof parsed.nonce !== "string"
        ) {
            return null;
        }

        return {
            type: parsed.type,
            occurredAt:
                parsed.occurredAt,
            nonce: parsed.nonce,
        };
    } catch {
        return null;
    }
}
