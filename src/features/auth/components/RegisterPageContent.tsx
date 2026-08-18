"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import {
    normalizeAuthReturnPath,
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
    const returnUrl = normalizeAuthReturnPath(rawReturnUrl);

    useEffect(() => {
        rememberAuthReturnUrl(returnUrl);
    }, [returnUrl]);


    return (
        <GuestOnlyAuthPage
            redirectTo={
                returnUrl ?? "/jobs"
            }
        >
            <AuthPageShell
                size="wide"
                audience="job-seeker"
                eyebrow="Join JobsSpot"
                title="Create your account"
                description="Build your profile, manage resumes, save jobs, and track every application in one place."
            >
                <RegisterForm
                    returnUrl={returnUrl}
                />
            </AuthPageShell>
        </GuestOnlyAuthPage>
    );
}
