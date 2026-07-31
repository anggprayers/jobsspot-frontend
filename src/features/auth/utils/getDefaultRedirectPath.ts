import type { AuthUser } from "../types/auth";

export function getDefaultRedirectPath(user: AuthUser): string {
    if (user.memberships.length > 0) {
        return "/employers";
    }

    return "/";
}
