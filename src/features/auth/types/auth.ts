export type CompanyMemberRole = "OWNER" | "ADMIN" | "RECRUITER" | "VIEWER";

export type AuthMembership = {
    membershipId: string;
    companyId: string;
    companyName: string;
    companySlug: string;
    companyLogoUrl: string | null;
    companyIsVerified: boolean;
    role: CompanyMemberRole;
    joinedAt: string;
};

export type AuthUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
    isAdmin: boolean;
    createdAt: string;
    memberships: AuthMembership[];
};

export type SessionUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    success: boolean;
    message: string;
    accessToken: string;
    user: SessionUser;
};

export type AuthenticatedRefreshSessionResponse = {
    success: true;
    authenticated: true;
    message: string;
    user: AuthUser;
    accessToken: string;
};

export type UnauthenticatedRefreshSessionResponse = {
    success: true;
    authenticated: false;
    message: string;
};

export type RefreshSessionResponse =
    AuthenticatedRefreshSessionResponse | UnauthenticatedRefreshSessionResponse;

export type CurrentUserResponse = {
    success: boolean;
    message: string;
    user: AuthUser;
};

export type LogoutResponse = {
    success: boolean;
    message: string;
};

export type UpdateProfileRequest = {
    firstName: string;
    lastName: string;
    phone: string | null;
};

export type UpdateProfileResponse = {
    success: boolean;
    message: string;
    user: AuthUser;
};

export type ChangePasswordRequest = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

export type ChangePasswordResponse = {
    success: boolean;
    message: string;
    requiresReauthentication: boolean;
    revokedSessions: number;
};
