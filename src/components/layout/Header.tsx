"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, LogIn } from "lucide-react";

import Logo from "@/components/common/Logo";
import SignInModal from "@/features/auth/components/SignInModal";

import Container from "./Container";
import Navigation from "./Navigation";

export default function Header() {
    const [isSignInOpen, setIsSignInOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
                <Container>
                    <div className="flex h-22 items-center justify-between lg:h-24">
                        <Logo />

                        <div className="hidden items-center gap-10 lg:flex">
                            <Navigation />

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsSignInOpen(true)}
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
                                >
                                    <LogIn size={19} />
                                    Sign In
                                </button>

                                <Link
                                    href="/employers"
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                                >
                                    <Building2 size={19} />
                                    For Employers
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </header>

            <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
        </>
    );
}
