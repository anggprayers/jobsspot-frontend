import type { Metadata } from "next";

import AuthPageShell from "@/features/auth/components/AuthPageShell";
import GuestOnlyAuthPage from "@/features/auth/components/GuestOnlyAuthPage";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
    title: "Create Account | JobsSpot",
    description:
        "Create your JobsSpot account to build a job seeker profile, save opportunities, and apply for jobs.",
};

export default function RegisterPage() {
    return (
        <GuestOnlyAuthPage>
            <AuthPageShell
                size="wide"
                eyebrow="Join JobsSpot"
                title="Create your account"
                description="Build your profile, manage resumes, save jobs, and track every application in one place."
            >
                <RegisterForm />
            </AuthPageShell>
        </GuestOnlyAuthPage>
    );
}
