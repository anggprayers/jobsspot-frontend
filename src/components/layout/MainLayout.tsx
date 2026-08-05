import type { ReactNode } from "react";

import EmailVerificationBanner from "@/features/auth/components/EmailVerificationBanner";

import Footer from "./Footer";
import Header from "./Header";

type MainLayoutProps = Readonly<{
    children: ReactNode;
}>;

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <EmailVerificationBanner />

            <main className="flex-1">{children}</main>

            <Footer />
        </div>
    );
}
