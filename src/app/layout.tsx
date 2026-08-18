import type { Metadata } from "next";
import { Inter } from "next/font/google";

import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Toaster } from "@/components/ui/sonner";
import {
    SITE_DESCRIPTION,
    SITE_NAME,
    absoluteUrl,
    getSiteUrl,
} from "@/lib/seo/site";

import Providers from "./providers";

import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    metadataBase: new URL(getSiteUrl()),
    applicationName: SITE_NAME,
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    openGraph: {
        type: "website",
        siteName: SITE_NAME,
        locale: "en_US",
        url: absoluteUrl("/"),
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: [
            {
                url: absoluteUrl("/logo.png"),
                width: 1125,
                height: 1175,
                alt: `${SITE_NAME} logo`,
            },
        ],
    },
    twitter: {
        card: "summary",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: [absoluteUrl("/logo.png")],
    },
};

type RootLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" className={inter.variable}>
            <body>
                <Providers>
                    {children}

                    <Toaster position="bottom-right" richColors closeButton />
                </Providers>

                <GoogleAnalytics />
            </body>
        </html>
    );
}
