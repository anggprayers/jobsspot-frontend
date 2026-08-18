import type { Metadata } from "next";

import ApplicationSharePage from "@/features/application-share/components/ApplicationSharePage";

export const metadata: Metadata = {
    title: "Secure Application",
    robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

type Props = { params: Promise<{ token: string }> };

export default async function ApplicationShareRoute({ params }: Props) {
    const { token } = await params;
    return <ApplicationSharePage token={token} />;
}
