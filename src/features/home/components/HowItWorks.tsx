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
    Users,
} from "lucide-react";

import Container from "@/components/layout/Container";

type Audience = "job-seekers" | "employers";

const jobSeekerSteps = [
    {
        icon: UserRound,
        title: "Create your account",
        description: "Build your profile and provide the information employers need.",
    },
    {
        icon: Search,
        title: "Find the right opportunity",
        description: "Search jobs by role, location, workplace type, and experience level.",
    },
    {
        icon: Send,
        title: "Apply with confidence",
        description: "Submit applications and keep track of opportunities in one place.",
    },
] as const;

const employerSteps = [
    {
        icon: Building2,
        title: "Create your company",
        description: "Set up a professional company profile and invite your hiring team.",
    },
    {
        icon: FileText,
        title: "Publish your opportunity",
        description: "Create detailed job listings that clearly explain the role.",
    },
    {
        icon: Users,
        title: "Connect with candidates",
        description: "Review applicants and manage your hiring process efficiently.",
    },
] as const;

export default function HowItWorks() {
    const [audience, setAudience] = useState<Audience>("job-seekers");

    const steps = audience === "job-seekers" ? jobSeekerSteps : employerSteps;

    return (
        <section id="how-it-works" className="scroll-mt-24 bg-slate-50 py-20 sm:py-28">
            <Container>
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 sm:text-base">
                        Simple Process
                    </p>

                    <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                        How JobsSpot Works
                    </h2>

                    <p className="mt-5 text-lg leading-9 text-slate-600 sm:text-xl">
                        A straightforward experience designed for job seekers and growing employers.
                    </p>
                </div>

                <div className="mx-auto mt-10 flex w-fit max-w-full flex-wrap justify-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                    <button
                        id="how-it-works-job-seekers"
                        type="button"
                        onClick={() => setAudience("job-seekers")}
                        className={`inline-flex min-h-13 items-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold transition-all duration-200 ${
                            audience === "job-seekers"
                                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                        }`}
                    >
                        <BriefcaseBusiness size={19} />
                        For Job Seekers
                    </button>

                    <button
                        id="how-it-works-employers"
                        type="button"
                        onClick={() => setAudience("employers")}
                        className={`inline-flex min-h-13 items-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold transition-all duration-200 ${
                            audience === "employers"
                                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                        }`}
                    >
                        <Building2 size={19} />
                        For Employers
                    </button>
                </div>

                <div className="mt-14 grid gap-6 md:grid-cols-3">
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <article
                                key={step.title}
                                className="group relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-8"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                        <Icon size={24} />
                                    </div>

                                    <span className="text-5xl font-bold text-slate-100">
                                        0{index + 1}
                                    </span>
                                </div>

                                <h3 className="mt-7 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">
                                    {step.title}
                                </h3>

                                <p className="mt-4 text-lg leading-8 text-slate-600">
                                    {step.description}
                                </p>

                                <CheckCircle2 size={20} className="mt-7 text-blue-600" />
                            </article>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
