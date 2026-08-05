"use client";

import Image from "next/image";
import Link from "next/link";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type MouseEvent as ReactMouseEvent,
    type PointerEvent as ReactPointerEvent,
    type WheelEvent as ReactWheelEvent,
} from "react";

import Container from "@/components/layout/Container";
import { usePublicJobs } from "@/features/jobs/hooks/usePublicJobs";

import styles from "./TrustedTeams.module.css";

const STATIC_COMPANY_LIMIT = 4;
const MINIMUM_MARQUEE_ITEMS = 9;
const AUTO_SCROLL_PIXELS_PER_SECOND = 34;
const DRAG_CLICK_THRESHOLD = 6;

function getCompanyInitials(companyName: string) {
    const words = companyName
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) {
        return "CO";
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return words
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
}

type Company = {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
};

type CompanyLogoProps = {
    company: Company;
    isDuplicate?: boolean;
};

function CompanyLogo({
    company,
    isDuplicate = false,
}: CompanyLogoProps) {
    return (
        <Link
            href={`/companies/${company.slug}`}
            tabIndex={isDuplicate ? -1 : undefined}
            draggable={false}
            aria-label={`View ${company.name}`}
            className={styles.companyLogoLink}
            onDragStart={(event) =>
                event.preventDefault()
            }
        >
            <div className={styles.companyVisual}>
                {company.logoUrl ? (
                    <Image
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
                        width={160}
                        height={80}
                        sizes="160px"
                        draggable={false}
                        className={styles.companyLogoImage}
                    />
                ) : (
                    <span
                        className={
                            styles.companyInitials
                        }
                    >
                        {getCompanyInitials(
                            company.name,
                        )}
                    </span>
                )}
            </div>

            <span className={styles.companyName}>
                {company.name}
            </span>
        </Link>
    );
}

function TrustedTeamsSkeleton() {
    return (
        <div className="mt-10 flex justify-center gap-8 overflow-hidden">
            {Array.from({ length: 5 }).map(
                (_, index) => (
                    <div
                        key={index}
                        className="h-32 w-48 shrink-0 animate-pulse rounded-xl bg-slate-200/70"
                    />
                ),
            )}
        </div>
    );
}

function buildMarqueeCompanies(
    companies: Company[],
): Company[] {
    if (companies.length >= MINIMUM_MARQUEE_ITEMS) {
        return companies;
    }

    const repeatCount = Math.ceil(
        MINIMUM_MARQUEE_ITEMS / companies.length,
    );

    return Array.from(
        { length: repeatCount },
        () => companies,
    )
        .flat()
        .slice(0, MINIMUM_MARQUEE_ITEMS);
}

export default function TrustedTeams() {
    const { data, isLoading } = usePublicJobs({
        page: 1,
        limit: 100,
        sort: "newest",
    });

    const companies = useMemo(
        () =>
            Array.from(
                new Map(
                    (data?.jobs ?? []).map((job) => [
                        job.company.id,
                        job.company,
                    ]),
                ).values(),
            ),
        [data?.jobs],
    );

    const shouldUseCarousel =
        companies.length > STATIC_COMPANY_LIMIT;

    const marqueeCompanies = useMemo(
        () =>
            shouldUseCarousel
                ? buildMarqueeCompanies(companies)
                : [],
        [companies, shouldUseCarousel],
    );

    const viewportRef =
        useRef<HTMLDivElement | null>(null);
    const animationFrameRef =
        useRef<number | null>(null);
    const lastAnimationTimeRef =
        useRef<number | null>(null);

    const isDraggingRef = useRef(false);
    const dragStartXRef = useRef(0);
    const dragStartScrollLeftRef = useRef(0);
    const dragDistanceRef = useRef(0);

    const [isHovered, setIsHovered] =
        useState(false);
    const [isFocused, setIsFocused] =
        useState(false);
    const [isDragging, setIsDragging] =
        useState(false);

    const isAutoScrollPaused =
        isHovered || isFocused || isDragging;

    useEffect(() => {
        if (!shouldUseCarousel) {
            return;
        }

        function animate(timestamp: number) {
            const viewport = viewportRef.current;

            if (viewport) {
                if (
                    !isAutoScrollPaused &&
                    lastAnimationTimeRef.current !==
                        null
                ) {
                    const elapsedSeconds =
                        (timestamp -
                            lastAnimationTimeRef.current) /
                        1000;

                    viewport.scrollLeft +=
                        AUTO_SCROLL_PIXELS_PER_SECOND *
                        elapsedSeconds;

                    const loopPoint =
                        viewport.scrollWidth / 2;

                    if (
                        viewport.scrollLeft >= loopPoint
                    ) {
                        viewport.scrollLeft -=
                            loopPoint;
                    }
                }

                lastAnimationTimeRef.current =
                    timestamp;
            }

            animationFrameRef.current =
                window.requestAnimationFrame(animate);
        }

        animationFrameRef.current =
            window.requestAnimationFrame(animate);

        return () => {
            if (
                animationFrameRef.current !== null
            ) {
                window.cancelAnimationFrame(
                    animationFrameRef.current,
                );
            }

            lastAnimationTimeRef.current = null;
        };
    }, [
        isAutoScrollPaused,
        shouldUseCarousel,
    ]);

    function normalizeCarouselPosition(
        viewport: HTMLDivElement,
    ) {
        const loopPoint = viewport.scrollWidth / 2;

        if (loopPoint <= 0) {
            return;
        }

        if (viewport.scrollLeft >= loopPoint) {
            viewport.scrollLeft -= loopPoint;
        } else if (viewport.scrollLeft <= 0) {
            viewport.scrollLeft += loopPoint;
        }
    }

    function handlePointerDown(
        event: ReactPointerEvent<HTMLDivElement>,
    ) {
        const viewport = viewportRef.current;

        if (!viewport) {
            return;
        }

        isDraggingRef.current = true;
        dragStartXRef.current = event.clientX;
        dragStartScrollLeftRef.current =
            viewport.scrollLeft;
        dragDistanceRef.current = 0;

        setIsDragging(true);
        viewport.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(
        event: ReactPointerEvent<HTMLDivElement>,
    ) {
        const viewport = viewportRef.current;

        if (!viewport || !isDraggingRef.current) {
            return;
        }

        const distance =
            event.clientX - dragStartXRef.current;

        dragDistanceRef.current = Math.max(
            dragDistanceRef.current,
            Math.abs(distance),
        );

        viewport.scrollLeft =
            dragStartScrollLeftRef.current -
            distance;

        normalizeCarouselPosition(viewport);
    }

    function finishPointerInteraction(
        event: ReactPointerEvent<HTMLDivElement>,
    ) {
        const viewport = viewportRef.current;

        if (
            viewport?.hasPointerCapture(event.pointerId)
        ) {
            viewport.releasePointerCapture(
                event.pointerId,
            );
        }

        isDraggingRef.current = false;
        setIsDragging(false);
    }

    function handleWheel(
        event: ReactWheelEvent<HTMLDivElement>,
    ) {
        const viewport = viewportRef.current;

        if (!viewport) {
            return;
        }

        event.preventDefault();

        const wheelDistance =
            Math.abs(event.deltaX) >
            Math.abs(event.deltaY)
                ? event.deltaX
                : event.deltaY;

        viewport.scrollLeft += wheelDistance;
        normalizeCarouselPosition(viewport);
    }

    function handleClickCapture(
        event: ReactMouseEvent<HTMLDivElement>,
    ) {
        if (
            dragDistanceRef.current >
            DRAG_CLICK_THRESHOLD
        ) {
            event.preventDefault();
            event.stopPropagation();
        }

        dragDistanceRef.current = 0;
    }

    if (!isLoading && companies.length === 0) {
        return null;
    }

    return (
        <section className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
            <Container>
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                        Trusted by growing teams
                    </h2>

                    <p className="mt-4 text-lg leading-8 text-slate-600">
                        Explore companies already using JobsSpot to connect with candidates.
                    </p>

                    {shouldUseCarousel && (
                        <p className="mt-3 text-sm text-slate-500">
                            Hover to pause, then drag or scroll to explore.
                        </p>
                    )}
                </div>
            </Container>

            {isLoading ? (
                <Container>
                    <TrustedTeamsSkeleton />
                </Container>
            ) : shouldUseCarousel ? (
                <div
                    ref={viewportRef}
                    className={`${styles.carouselViewport} mt-10 ${
                        isDragging
                            ? styles.isDragging
                            : ""
                    }`}
                    aria-label="Companies using JobsSpot"
                    onMouseEnter={() =>
                        setIsHovered(true)
                    }
                    onMouseLeave={() =>
                        setIsHovered(false)
                    }
                    onFocusCapture={() =>
                        setIsFocused(true)
                    }
                    onBlurCapture={(event) => {
                        if (
                            !event.currentTarget.contains(
                                event.relatedTarget,
                            )
                        ) {
                            setIsFocused(false);
                        }
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={
                        finishPointerInteraction
                    }
                    onPointerCancel={
                        finishPointerInteraction
                    }
                    onWheel={handleWheel}
                    onClickCapture={handleClickCapture}
                >
                    <div className={styles.carouselTrack}>
                        <div
                            className={
                                styles.carouselGroup
                            }
                        >
                            {marqueeCompanies.map(
                                (company, index) => (
                                    <CompanyLogo
                                        key={`${company.id}-${index}`}
                                        company={company}
                                    />
                                ),
                            )}
                        </div>

                        <div
                            className={
                                styles.carouselGroup
                            }
                            aria-hidden="true"
                        >
                            {marqueeCompanies.map(
                                (company, index) => (
                                    <CompanyLogo
                                        key={`duplicate-${company.id}-${index}`}
                                        company={company}
                                        isDuplicate
                                    />
                                ),
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <Container>
                    <div className={styles.staticLogoGrid}>
                        {companies.map((company) => (
                            <CompanyLogo
                                key={company.id}
                                company={company}
                            />
                        ))}
                    </div>
                </Container>
            )}
        </section>
    );
}
