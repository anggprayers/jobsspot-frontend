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
    isEmailVerified: boolean;
    hasPassword: boolean;
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

export type SendVerificationEmailResponse = {
    success: boolean;
    message: string;
    emailSent: boolean;
    alreadyVerified: boolean;
    expiresAt: string | null;
};

export type VerifyEmailRequest = {
    token: string;
};

export type AuthenticatedVerifyEmailResponse = {
    success: true;
    message: string;
    isEmailVerified: true;
    alreadyVerified: false;
    authenticated: true;
    accessToken: string;
    user: AuthUser;
    redirectTo: "/jobs";
};

export type AlreadyVerifiedEmailResponse = {
    success: true;
    message: string;
    isEmailVerified: true;
    alreadyVerified: true;
    authenticated: false;
    accessToken: null;
    user: null;
    redirectTo: null;
};

export type VerifyEmailResponse =
    | AuthenticatedVerifyEmailResponse
    | AlreadyVerifiedEmailResponse;

export type RegisterRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type RegisterResponse = {
    success: boolean;
    message: string;
    verificationEmailSent: boolean;
    user: SessionUser;
};


export type ForgotPasswordRequest = {
    email: string;
};

export type ForgotPasswordResponse = {
    success: true;
    message: string;
};

export type ResetPasswordRequest = {
    token: string;
    newPassword: string;
    confirmNewPassword: string;
};

export type ResetPasswordResponse = {
    success: true;
    message: string;
    requiresReauthentication: true;
    revokedSessions: number;
    redirectTo: "/login?passwordReset=success";
};


export type GoogleLoginRequest = {
    credential: string;
};

export type GoogleLoginResponse = {
    success: true;
    message: string;
    provider: "GOOGLE";
    isNewUser: boolean;
    accountLinked: boolean;
    user: AuthUser;
    accessToken: string;
};
