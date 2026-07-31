import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import Providers from "./providers";

import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: {
        default: "JobsSpot",
        template: "%s | JobsSpot",
    },
    description: "Discover job opportunities and connect with employers through JobsSpot.",
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
            </body>
        </html>
    );
}
