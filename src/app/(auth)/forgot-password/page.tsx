import type { Metadata } from "next";

import AuthPageShell from "@/features/auth/components/AuthPageShell";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";
import GuestOnlyAuthPage from "@/features/auth/components/GuestOnlyAuthPage";

export const metadata: Metadata = {
    title: "Forgot Password",
    description:
        "Request a secure JobsSpot password reset link.",
};

export default function ForgotPasswordPage() {
    return (
        <GuestOnlyAuthPage>
            <AuthPageShell
                mode="security"
                eyebrow="Account recovery"
                title="Forgot your password?"
                description="Enter your email address and we’ll send a secure reset link when an eligible account exists."
            >
                <ForgotPasswordForm />
            </AuthPageShell>
        </GuestOnlyAuthPage>
    );
}
