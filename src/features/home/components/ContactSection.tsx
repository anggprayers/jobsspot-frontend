import {
    Clock3,
    Mail,
    MessageCircleMore,
    ShieldCheck,
} from "lucide-react";

import Container from "@/components/layout/Container";
import ContactForm from "@/features/contact/components/ContactForm";

const contactDetails = [
    {
        icon: Mail,
        title: "Email support",
        description:
            "Send a structured request and receive a reference number by email.",
    },
    {
        icon: Clock3,
        title: "Response time",
        description:
            "Our team reviews messages as soon as possible during normal business days.",
    },
    {
        icon: ShieldCheck,
        title: "Safer submissions",
        description:
            "Validation, rate limits, and spam protection help keep the support inbox useful.",
    },
];

export default function ContactSection() {
    return (
        <section
            id="contact"
            className="scroll-mt-24 border-t border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24"
        >
            <Container>
                <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
                    <div className="lg:sticky lg:top-28">
                        <p className="text-sm font-semibold text-blue-600">
                            Contact JobsSpot
                        </p>

                        <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Tell us what you need help with.
                        </h2>

                        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                            Ask about finding work, managing an employer workspace, partnerships, technical issues, or platform feedback.
                        </p>

                        <div className="mt-8 space-y-4">
                            {contactDetails.map(
                                ({
                                    icon: Icon,
                                    title,
                                    description,
                                }) => (
                                    <div
                                        key={title}
                                        className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                                    >
                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <Icon className="size-5" />
                                        </div>

                                        <div>
                                            <h3 className="text-base font-semibold text-slate-950">
                                                {title}
                                            </h3>
                                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>

                        <a
                            href="#community"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                        >
                            <MessageCircleMore className="size-4" />
                            Visit the JobsSpot community instead
                        </a>
                    </div>

                    <ContactForm />
                </div>
            </Container>
        </section>
    );
}
