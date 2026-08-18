import {
    Clock3,
    Mail,
    MessageCircleMore,
    Phone,
} from "lucide-react";

import Container from "@/components/layout/Container";
import ContactForm from "@/features/contact/components/ContactForm";

const SUPPORT_EMAIL = "jeff@jobsspot.net";
const SUPPORT_PHONE = "+19172018425";
const SUPPORT_PHONE_DISPLAY = "+1 917-201-8425";

const contactCardClassName =
    "flex min-w-0 items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/30 sm:p-5";

const interactiveContactCardClassName = `${contactCardClassName} transition-colors hover:border-blue-300 hover:bg-blue-50/40`;

export default function ContactSection() {
    return (
        <section
            id="contact"
            className="scroll-mt-24 border-t border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24"
        >
            <Container>
                <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14">
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-blue-600">
                            Contact JobsSpot
                        </p>

                        <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Let&apos;s talk about how JobsSpot can help.
                        </h2>

                        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                            Whether you&apos;re looking for work, hiring for your team, discussing
                            job posting arrangements, or need platform support, send us a message
                            and we&apos;ll help you with the next step.
                        </p>

                        <div className="mt-8 grid gap-4">
                            <a
                                href={`mailto:${SUPPORT_EMAIL}`}
                                className={interactiveContactCardClassName}
                            >
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Mail className="size-5" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-950">
                                        Email JobsSpot
                                    </p>
                                    <p className="mt-1 break-all text-base font-bold text-blue-700 sm:text-lg">
                                        {SUPPORT_EMAIL}
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        For hiring needs, job posting arrangements, hiring support,
                                        partnerships, and general inquiries.
                                    </p>
                                </div>
                            </a>

                            <a
                                href={`tel:${SUPPORT_PHONE}`}
                                className={interactiveContactCardClassName}
                            >
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Phone className="size-5" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-950">
                                        Call JobsSpot
                                    </p>
                                    <p className="mt-1 text-base font-bold text-blue-700 sm:text-lg">
                                        {SUPPORT_PHONE_DISPLAY}
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        For direct hiring, partnership, or business inquiries.
                                    </p>
                                </div>
                            </a>

                            <div className={contactCardClassName}>
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Clock3 className="size-5" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-950">
                                        Response time
                                    </p>
                                    <p className="mt-1 text-base font-bold text-slate-950 sm:text-lg">
                                        Normal business days
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Our team reviews messages as soon as possible and will follow up
                                        using the contact details you provide.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <a
                            href="#community"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                        >
                            <MessageCircleMore className="size-4" />
                            Visit the JobsSpot community instead
                        </a>
                    </div>

                    <div className="min-w-0">
                        <ContactForm />
                    </div>
                </div>
            </Container>
        </section>
    );
}
