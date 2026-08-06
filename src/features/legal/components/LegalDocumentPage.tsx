import Link from "next/link";
import type { ReactNode } from "react";

import Container from "@/components/layout/Container";

type LegalSection = Readonly<{
    id: string;
    title: string;
    content: ReactNode;
}>;

type LegalDocumentPageProps = Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    effectiveDate: string;
    lastUpdated: string;
    sections: readonly LegalSection[];
}>;

const contentLinkClassName =
    "font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 transition-colors hover:text-blue-800 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300";

export function LegalContentLink({
    href,
    children,
}: Readonly<{
    href: string;
    children: ReactNode;
}>) {
    return (
        <Link href={href} className={contentLinkClassName}>
            {children}
        </Link>
    );
}

export default function LegalDocumentPage({
    eyebrow,
    title,
    description,
    effectiveDate,
    lastUpdated,
    sections,
}: LegalDocumentPageProps) {
    return (
        <div className="bg-slate-50">
            <section className="border-b border-slate-200 bg-white">
                <Container className="py-16 sm:py-20 lg:py-24">
                    <div className="max-w-4xl">
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                            {eyebrow}
                        </p>

                        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            {title}
                        </h1>

                        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
                            {description}
                        </p>

                        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-600">
                            <div className="flex gap-2">
                                <dt className="font-semibold text-slate-900">
                                    Effective:
                                </dt>
                                <dd>{effectiveDate}</dd>
                            </div>

                            <div className="flex gap-2">
                                <dt className="font-semibold text-slate-900">
                                    Last updated:
                                </dt>
                                <dd>{lastUpdated}</dd>
                            </div>
                        </dl>
                    </div>
                </Container>
            </section>

            <Container className="py-12 sm:py-16 lg:py-20">
                <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
                    <aside className="lg:sticky lg:top-28 lg:self-start">
                        <nav
                            aria-label={`${title} contents`}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                                On this page
                            </p>

                            <ol className="mt-4 space-y-1.5">
                                {sections.map((section, index) => (
                                    <li key={section.id}>
                                        <a
                                            href={`#${section.id}`}
                                            className="flex gap-3 rounded-lg px-2 py-2 text-sm leading-6 text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="shrink-0 font-semibold text-slate-400"
                                            >
                                                {index + 1}.
                                            </span>
                                            <span>{section.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </aside>

                    <article className="min-w-0 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-9 sm:py-10 lg:px-12 lg:py-12">
                        <div className="space-y-12">
                            {sections.map((section, index) => (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-28"
                                    aria-labelledby={`${section.id}-heading`}
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                                            {index + 1}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <h2
                                                id={`${section.id}-heading`}
                                                className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
                                            >
                                                {section.title}
                                            </h2>

                                            <div className="mt-5 space-y-5 text-base leading-8 text-slate-600 [&_a]:break-words [&_li]:pl-1 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2">
                                                {section.content}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </div>

                        <div className="mt-14 rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
                            <h2 className="text-lg font-bold text-slate-950">
                                Questions about this document?
                            </h2>
                            <p className="mt-2 leading-7 text-slate-600">
                                Contact the JobsSpot team through our secure contact form and keep the reference number sent to your email.
                            </p>
                            <LegalContentLink href="/#contact">
                                Contact JobsSpot
                            </LegalContentLink>
                        </div>
                    </article>
                </div>
            </Container>
        </div>
    );
}
