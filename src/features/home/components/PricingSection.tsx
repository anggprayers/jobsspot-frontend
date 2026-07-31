import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

import Container from "@/components/layout/Container";

const plans = [
    {
        name: "Starter",
        price: "Free",
        description: "For new employers beginning their hiring journey.",
        features: [
            "Create a company profile",
            "Publish one active job",
            "Review incoming applications",
            "Basic applicant management",
        ],
        action: "Start Hiring",
        href: "/employers",
        featured: false,
    },
    {
        name: "Growth",
        price: "Coming soon",
        description: "For growing teams with regular hiring requirements.",
        features: [
            "Multiple active job listings",
            "Team member access",
            "Enhanced applicant management",
            "Priority listing options",
        ],
        action: "Join the Waitlist",
        href: "/#contact",
        featured: true,
    },
    {
        name: "Business",
        price: "Let’s talk",
        description: "For organizations requiring flexible hiring support.",
        features: [
            "Custom job allowances",
            "Multiple hiring managers",
            "Priority support",
            "Custom hiring solutions",
        ],
        action: "Contact Us",
        href: "/#contact",
        featured: false,
    },
] as const;

export default function PricingSection() {
    return (
        <section id="pricing" className="scroll-mt-24 bg-white py-20 sm:py-28">
            <Container>
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                        Simple Hiring Plans
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-slate-600 sm:text-xl">
                        Start with the essentials and choose more hiring flexibility as your company
                        grows.
                    </p>
                </div>

                <div className="mt-14 grid gap-7 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <article
                            key={plan.name}
                            className={`relative flex flex-col rounded-3xl border p-7 sm:p-8 ${
                                plan.featured
                                    ? "border-blue-600 bg-slate-950 text-white shadow-xl shadow-slate-300/50"
                                    : "border-slate-200 bg-white text-slate-950 shadow-sm"
                            }`}
                        >
                            {plan.featured && (
                                <div className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white">
                                    <Sparkles size={15} />
                                    Recommended
                                </div>
                            )}

                            <p
                                className={`text-base font-bold ${
                                    plan.featured ? "text-blue-400" : "text-blue-600"
                                }`}
                            >
                                {plan.name}
                            </p>

                            <h3
                                className={`mt-4 text-3xl font-bold sm:text-4xl ${
                                    plan.featured ? "text-white" : "text-slate-950"
                                }`}
                            >
                                {plan.price}
                            </h3>

                            <p
                                className={`mt-5 text-lg leading-8 ${
                                    plan.featured ? "text-slate-300" : "text-slate-600"
                                }`}
                            >
                                {plan.description}
                            </p>

                            <ul className="mt-8 space-y-5">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <span
                                            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                                                plan.featured
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-blue-50 text-blue-600"
                                            }`}
                                        >
                                            <Check size={13} />
                                        </span>

                                        <span
                                            className={`text-base leading-7 sm:text-lg ${
                                                plan.featured ? "text-slate-100" : "text-slate-700"
                                            }`}
                                        >
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.href}
                                className={`mt-9 inline-flex min-h-13 items-center justify-center rounded-xl px-5 py-3.5 text-base font-semibold transition-all hover:-translate-y-0.5 ${
                                    plan.featured
                                        ? "bg-blue-600 text-white shadow-sm hover:bg-blue-500"
                                        : "border border-slate-300 bg-white text-slate-950 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                }`}
                            >
                                {plan.action}
                            </Link>
                        </article>
                    ))}
                </div>
            </Container>
        </section>
    );
}
