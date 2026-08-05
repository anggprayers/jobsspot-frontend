"use client";

import { usePathname } from "next/navigation";

import EmployerLayout from "./EmployerLayout";
import EmployerOnboardingGuard from "./EmployerOnboardingGuard";
import EmployerRouteGuard from "./EmployerRouteGuard";

type EmployersRootLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

const EMPLOYER_ONBOARDING_PATH =
    "/employers/get-started";

export default function EmployersRootLayout({
    children,
}: EmployersRootLayoutProps) {
    const pathname = usePathname();

    const isOnboardingRoute =
        pathname === EMPLOYER_ONBOARDING_PATH ||
        pathname.startsWith(
            `${EMPLOYER_ONBOARDING_PATH}/`,
        );

    if (isOnboardingRoute) {
        return (
            <EmployerOnboardingGuard>
                {children}
            </EmployerOnboardingGuard>
        );
    }

    return (
        <EmployerRouteGuard>
            <EmployerLayout>
                {children}
            </EmployerLayout>
        </EmployerRouteGuard>
    );
}
