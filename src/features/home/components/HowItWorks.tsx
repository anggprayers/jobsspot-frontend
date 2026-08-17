"use client";

import { useState } from "react";
import {
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    FileText,
    Search,
    Send,
    UserRound,
    ClipboardCheck,
} from "lucide-react";

import Container from "@/components/layout/Container";

type Audience = "job-seekers" | "employers";

const jobSeekerSteps = [
    {
        icon: UserRound,
        title: "Create your account",
        description:
            "Build your profile and provide the information employers need.",
    },
    {
        icon: Search,
        title: "Find the right opportunity",
        description:
            "Search jobs by role, location, workplace type, and experience level.",
    },
    {
        icon: Send,
        title: "Apply with confidence",
        description:
            "Submit applications and keep track of opportunities in one place.",
    },
] as const;

const employerSteps = [
    {
        icon: FileText,
        title: "Send the job details",
        description:
            "Share the role, company, location, pay information, and contact details in one simple form.",
    },
    {
        icon: ClipboardCheck,
        title: "Confirm the arrangement",
        description:
            "JobsSpot reviews the submission and contacts you to confirm the posting details and next steps.",
    },
    {
        icon: Building2,
        title: "JobsSpot publishes the role",
        description:
            "After confirmation, Platform Admin prepares the structured listing and manages it on JobsSpot.",
    },
] as const;

export default function HowItWorks() {
    const [audience, setAudience] =
        useState<Audience>("job-seekers");

    const steps =
        audience === "job-seekers"
            ? jobSeekerSteps
            : employerSteps;

    return (
        <section
            id="how-it-works"
            className="scroll-mt-24 bg-white py-16 sm:py-20"
        >
            <Container>
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                                Simple Process
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                                How JobsSpot works
                            </h2>

                            <p className="mt-4 text-lg leading-8 text-slate-600">
                                A straightforward experience for job seekers and organizations looking to hire.
                            </p>
                        </div>

                        <div className="flex w-fit max-w-full rounded-xl border border-slate-200 bg-slate-50 p-1">
                            <button
                                id="how-it-works-job-seekers"
                                type="button"
                                onClick={() =>
                                    setAudience(
                                        "job-seekers",
                                    )
                                }
                                className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5 ${
                                    audience ===
                                    "job-seekers"
                                        ? "bg-white text-blue-700 shadow-sm"
                                        : "text-slate-600 hover:text-slate-950"
                                }`}
                            >
                                <BriefcaseBusiness
                                    size={17}
                                />
                                Job seekers
                            </button>

                            <button
                                id="how-it-works-employers"
                                type="button"
                                onClick={() =>
                                    setAudience("employers")
                                }
                                className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5 ${
                                    audience ===
                                    "employers"
                                        ? "bg-white text-blue-700 shadow-sm"
                                        : "text-slate-600 hover:text-slate-950"
                                }`}
                            >
                                <Building2 size={17} />
                                Employers
                            </button>
                        </div>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <article
                                    key={step.title}
                                    className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition-colors hover:border-blue-200 hover:bg-blue-50/30 sm:p-7"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <Icon size={22} />
                                        </div>

                                        <span className="text-sm font-bold tracking-[0.16em] text-slate-300">
                                            0{index + 1}
                                        </span>
                                    </div>

                                    <h3 className="mt-6 text-xl font-bold leading-tight text-slate-950 sm:text-2xl">
                                        {step.title}
                                    </h3>

                                    <p className="mt-3 text-base leading-7 text-slate-600">
                                        {step.description}
                                    </p>

                                    <CheckCircle2
                                        size={18}
                                        className="mt-6 text-blue-600"
                                    />
                                </article>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </section>
    );
}
