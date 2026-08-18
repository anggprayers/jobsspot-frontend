import type { Metadata } from "next";

import AccountLayout from "@/features/account/components/AccountLayout";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

type AccountRouteLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function AccountRouteLayout({
    children,
}: AccountRouteLayoutProps) {
    return <AccountLayout>{children}</AccountLayout>;
}
