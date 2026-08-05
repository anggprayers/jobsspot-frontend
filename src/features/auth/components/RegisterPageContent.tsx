"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import {
    isSafeInternalPath,
    rememberAuthReturnUrl,
} from "../utils/authReturnUrl";
import AuthPageShell from "./AuthPageShell";
import GuestOnlyAuthPage from "./GuestOnlyAuthPage";
import RegisterForm from "./RegisterForm";

export default function RegisterPageContent() {
    const searchParams =
        useSearchParams();

    const rawReturnUrl =
        searchParams.get("returnUrl");
    const returnUrl = isSafeInternalPath(
        rawReturnUrl,
    )
        ? rawReturnUrl
        : null;

    useEffect(() => {
        rememberAuthReturnUrl(returnUrl);
    }, [returnUrl]);

    const isCompanyInvitation =
        returnUrl?.startsWith(
            "/invitations/accept",
        ) ?? false;

    return (
        <GuestOnlyAuthPage
            redirectTo={
                returnUrl ?? "/jobs"
            }
        >
            <AuthPageShell
                size="wide"
                audience={
                    isCompanyInvitation
                        ? "employer"
                        : "job-seeker"
                }
                eyebrow={
                    isCompanyInvitation
                        ? "Accept your company invitation"
                        : "Join JobsSpot"
                }
                title="Create your account"
                description={
                    isCompanyInvitation
                        ? "Register using the exact email address that received the invitation. After verification, JobsSpot will return you to the invitation."
                        : "Build your profile, manage resumes, save jobs, and track every application in one place."
                }
            >
                <RegisterForm
                    returnUrl={returnUrl}
                />
            </AuthPageShell>
        </GuestOnlyAuthPage>
    );
}
