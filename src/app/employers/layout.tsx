import type { Metadata } from "next";

import EmployersRootLayout from "@/features/employers/components/EmployersRootLayout";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

type EmployersLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function EmployersLayout({
    children,
}: EmployersLayoutProps) {
    return (
        <EmployersRootLayout>
            {children}
        </EmployersRootLayout>
    );
}
