import { Suspense } from "react";
import Link from "next/link";

import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
    return (
        <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-slate-50 px-4 py-12">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
                <div className="mb-6">
                    <p className="text-sm font-semibold text-blue-600">JobsSpot</p>

                    <h1 className="mt-2 text-2xl font-bold text-slate-950">Employer Login</h1>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Sign in to manage your company, job postings, and applicants.
                    </p>
                </div>

                <Suspense
                    fallback={<p className="text-sm text-slate-500">Loading login form...</p>}
                >
                    <LoginForm />
                </Suspense>

                <div className="mt-6 flex items-center justify-between text-sm">
                    <Link
                        href="/forgot-password"
                        className="font-medium text-blue-600 hover:text-blue-700"
                    >
                        Forgot password?
                    </Link>

                    <Link
                        href="/register"
                        className="font-medium text-blue-600 hover:text-blue-700"
                    >
                        Create account
                    </Link>
                </div>
            </section>
        </main>
    );
}
