import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

import Container from "@/components/layout/Container";

const plans = [
    {
        name: "Starter",
        price: "Free",
        description:
            "For new employers beginning their hiring journey.",
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
        description:
            "For growing teams with regular hiring requirements.",
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
        description:
            "For organizations requiring flexible hiring support.",
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
        <section
            id="pricing"
            className="scroll-mt-24 border-y border-slate-200 bg-slate-50 py-16 sm:py-20"
        >
            <Container>
                <div className="mx-auto max-w-6xl">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Simple hiring plans
                        </h2>

                        <p className="mt-4 text-lg leading-8 text-slate-600">
                            Start with the essentials and choose more hiring flexibility as your
                            company grows.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <article
                                key={plan.name}
                                className={`relative flex flex-col rounded-2xl border p-6 sm:p-7 ${
                                    plan.featured
                                        ? "border-blue-300 bg-blue-50/70 shadow-sm"
                                        : "border-slate-200 bg-white"
                                }`}
                            >
                                {plan.featured && (
                                    <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">
                                        <Sparkles
                                            size={14}
                                        />
                                        Recommended
                                    </div>
                                )}

                                <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-600">
                                    {plan.name}
                                </p>

                                <h3 className="mt-4 text-3xl font-bold text-slate-950">
                                    {plan.price}
                                </h3>

                                <p className="mt-4 text-base leading-7 text-slate-600">
                                    {plan.description}
                                </p>

                                <ul className="mt-7 space-y-4">
                                    {plan.features.map(
                                        (feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-start gap-3"
                                            >
                                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                                    <Check
                                                        size={
                                                            13
                                                        }
                                                    />
                                                </span>

                                                <span className="text-sm leading-6 text-slate-700 sm:text-base">
                                                    {
                                                        feature
                                                    }
                                                </span>
                                            </li>
                                        ),
                                    )}
                                </ul>

                                <Link
                                    href={plan.href}
                                    className={`mt-8 inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
                                        plan.featured
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "border border-slate-300 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                                >
                                    {plan.action}
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
