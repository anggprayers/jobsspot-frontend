"use client";

import {
    ChevronDown,
    RotateCcw,
    SlidersHorizontal,
} from "lucide-react";
import {
    type ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

import { useJobCategories } from "../hooks/useJobCategories";
import {
    employmentTypeFilterGroups,
    experienceLevelOptions,
    listingTimeOptions,
    salaryPeriodOptions,
    workplaceTypeOptions,
    type SalaryPeriodFilter,
} from "../types/jobFilters";

type FilterMenu =
    | "pay"
    | "type"
    | "workplace"
    | "classification"
    | "experience"
    | "listingTime";

type FilterDropdownProps = Readonly<{
    id: FilterMenu;
    label: string;
    summary: string;
    isActive: boolean;
    isOpen: boolean;
    align?: "left" | "right";
    widthClassName?: string;
    onToggle: (id: FilterMenu) => void;
    children: ReactNode;
}>;

type PayFilterPanelProps = Readonly<{
    initialPeriod: SalaryPeriodFilter | "";
    initialMinimum: string;
    initialMaximum: string;
    onApply: (input: {
        period: SalaryPeriodFilter;
        minimum: string;
        maximum: string;
    }) => void;
    onClear: () => void;
}>;

const ADVANCED_FILTER_KEYS = [
    "category",
    "employmentType",
    "workplaceType",
    "experienceLevel",
    "salaryPeriod",
    "salaryMin",
    "salaryMax",
    "salaryCurrency",
    "publishedWithinDays",
] as const;

const currencyFormatter = new Intl.NumberFormat(
    "en-US",
    {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    },
);

function getQueryValues(
    searchParams: ReturnType<typeof useSearchParams>,
    name: string,
): string[] {
    return [
        ...new Set(
            searchParams
                .getAll(name)
                .flatMap((value) => value.split(","))
                .map((value) => value.trim())
                .filter(Boolean),
        ),
    ];
}

function getSingleOrCountSummary(
    fallback: string,
    selectedValues: string[],
    labels: ReadonlyMap<string, string>,
): string {
    if (selectedValues.length === 0) {
        return fallback;
    }

    if (selectedValues.length === 1) {
        return (
            labels.get(selectedValues[0] ?? "") ??
            fallback
        );
    }

    return `${fallback} (${selectedValues.length})`;
}

function formatPaySummary({
    period,
    minimum,
    maximum,
}: {
    period: string | null;
    minimum: string | null;
    maximum: string | null;
}): string {
    if (!period || (!minimum && !maximum)) {
        return "Pay";
    }

    const periodLabel =
        salaryPeriodOptions.find(
            (option) => option.value === period,
        )?.label ?? "Pay";

    if (minimum && maximum) {
        return `${periodLabel} ${currencyFormatter.format(
            Number(minimum),
        )}–${currencyFormatter.format(
            Number(maximum),
        )}`;
    }

    if (minimum) {
        return `${periodLabel} from ${currencyFormatter.format(
            Number(minimum),
        )}`;
    }

    return `${periodLabel} up to ${currencyFormatter.format(
        Number(maximum),
    )}`;
}

function FilterDropdown({
    id,
    label,
    summary,
    isActive,
    isOpen,
    align = "left",
    widthClassName = "w-[min(22rem,calc(100vw-2rem))]",
    onToggle,
    children,
}: FilterDropdownProps) {
    return (
        <div className="relative">
            <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                onClick={() => onToggle(id)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors ${
                    isActive || isOpen
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                }`}
            >
                <span className="max-w-52 truncate">
                    {summary || label}
                </span>

                <ChevronDown
                    className={`size-4 shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label={`${label} filters`}
                    className={`absolute top-full z-50 mt-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/15 ${widthClassName} ${
                        align === "right"
                            ? "right-0"
                            : "left-0"
                    }`}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

function FilterCheckbox({
    checked,
    label,
    count,
    onChange,
}: Readonly<{
    checked: boolean;
    label: string;
    count?: number;
    onChange: () => void;
}>) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl px-2 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50">
            <span className="flex min-w-0 items-center gap-3">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="size-5 shrink-0 rounded border-slate-300 accent-blue-600"
                />

                <span className="leading-6">
                    {label}
                </span>
            </span>

            {count !== undefined && (
                <span className="shrink-0 text-xs font-semibold text-slate-400">
                    {count.toLocaleString("en-US")}
                </span>
            )}
        </label>
    );
}

function PayFilterPanel({
    initialPeriod,
    initialMinimum,
    initialMaximum,
    onApply,
    onClear,
}: PayFilterPanelProps) {
    const [period, setPeriod] =
        useState<SalaryPeriodFilter>(
            initialPeriod || "MONTHLY",
        );
    const [minimum, setMinimum] =
        useState(initialMinimum);
    const [maximum, setMaximum] =
        useState(initialMaximum);

    const minimumValue =
        minimum.trim() === ""
            ? null
            : Number(minimum);
    const maximumValue =
        maximum.trim() === ""
            ? null
            : Number(maximum);

    const hasInvalidNumber =
        (minimumValue !== null &&
            (!Number.isFinite(minimumValue) ||
                minimumValue < 0)) ||
        (maximumValue !== null &&
            (!Number.isFinite(maximumValue) ||
                maximumValue < 0));

    const hasInvalidRange =
        minimumValue !== null &&
        maximumValue !== null &&
        maximumValue < minimumValue;

    const hasAmount =
        minimumValue !== null ||
        maximumValue !== null;

    const canApply =
        hasAmount &&
        !hasInvalidNumber &&
        !hasInvalidRange;

    return (
        <div>
            <div className="flex gap-2 border-b border-slate-200 pb-4">
                {salaryPeriodOptions.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                            setPeriod(option.value)
                        }
                        className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                            period === option.value
                                ? "bg-blue-50 text-blue-700"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label>
                    <span className="text-sm font-semibold text-slate-800">
                        From · USD
                    </span>

                    <input
                        type="number"
                        min="0"
                        step="1"
                        inputMode="decimal"
                        value={minimum}
                        onChange={(event) =>
                            setMinimum(
                                event.target.value,
                            )
                        }
                        placeholder="Minimum"
                        className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                </label>

                <label>
                    <span className="text-sm font-semibold text-slate-800">
                        To · USD
                    </span>

                    <input
                        type="number"
                        min="0"
                        step="1"
                        inputMode="decimal"
                        value={maximum}
                        onChange={(event) =>
                            setMaximum(
                                event.target.value,
                            )
                        }
                        placeholder="Maximum"
                        className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                </label>
            </div>

            {hasInvalidRange && (
                <p className="mt-3 text-sm font-medium text-red-600">
                    Maximum pay cannot be lower than
                    minimum pay.
                </p>
            )}

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
                <button
                    type="button"
                    onClick={onClear}
                    className="text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
                >
                    Clear pay
                </button>

                <button
                    type="button"
                    disabled={!canApply}
                    onClick={() =>
                        onApply({
                            period,
                            minimum,
                            maximum,
                        })
                    }
                    className="inline-flex min-h-10 items-center justify-center rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}

export default function AdvancedJobFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const containerRef =
        useRef<HTMLDivElement>(null);

    const [isExpanded, setIsExpanded] =
        useState(false);
    const [openFilter, setOpenFilter] =
        useState<FilterMenu | null>(null);

    const {
        data: categoriesData,
        isLoading: isCategoriesLoading,
    } = useJobCategories();

    const categories =
        categoriesData?.categories ?? [];

    const selectedCategories =
        getQueryValues(searchParams, "category");
    const selectedEmploymentTypes =
        getQueryValues(
            searchParams,
            "employmentType",
        );
    const selectedWorkplaceTypes =
        getQueryValues(
            searchParams,
            "workplaceType",
        );
    const selectedExperienceLevels =
        getQueryValues(
            searchParams,
            "experienceLevel",
        );

    const salaryPeriod =
        searchParams.get("salaryPeriod");
    const salaryMinimum =
        searchParams.get("salaryMin");
    const salaryMaximum =
        searchParams.get("salaryMax");
    const publishedWithinDays =
        searchParams.get("publishedWithinDays");

    const hasPayFilter = Boolean(
        salaryPeriod &&
            (salaryMinimum || salaryMaximum),
    );
    const hasListingTimeFilter = Boolean(
        publishedWithinDays,
    );

    const activeGroupCount = [
        hasPayFilter,
        selectedEmploymentTypes.length > 0,
        selectedWorkplaceTypes.length > 0,
        selectedCategories.length > 0,
        selectedExperienceLevels.length > 0,
        hasListingTimeFilter,
    ].filter(Boolean).length;

    const hasActiveAdvancedFilters =
        activeGroupCount > 0;

    const shouldShowFilters =
        isExpanded || hasActiveAdvancedFilters;

    const employmentLabels = new Map(
        employmentTypeFilterGroups.flatMap(
            (group) =>
                group.values.map(
                    (value) =>
                        [value, group.label] as const,
                ),
        ),
    );

    const workplaceLabels = new Map(
        workplaceTypeOptions.map(
            (option) =>
                [option.value, option.label] as const,
        ),
    );

    const experienceLabels = new Map(
        experienceLevelOptions.map(
            (option) =>
                [option.value, option.label] as const,
        ),
    );

    const selectedCategoryLabels =
        selectedCategories.map(
            (slug) =>
                categories.find(
                    (category) =>
                        category.slug === slug,
                )?.name ?? slug,
        );

    useEffect(() => {
        function handlePointerDown(
            event: PointerEvent,
        ) {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node,
                )
            ) {
                setOpenFilter(null);
            }
        }

        function handleKeyDown(
            event: KeyboardEvent,
        ) {
            if (event.key === "Escape") {
                setOpenFilter(null);
            }
        }

        document.addEventListener(
            "pointerdown",
            handlePointerDown,
        );
        document.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.removeEventListener(
                "pointerdown",
                handlePointerDown,
            );
            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, []);

    function pushParams(
        params: URLSearchParams,
    ) {
        params.set("page", "1");

        router.push(
            `${pathname}?${params.toString()}`,
            {
                scroll: false,
            },
        );
    }

    function updateListFilter(
        name: string,
        values: string[],
    ) {
        const params = new URLSearchParams(
            searchParams.toString(),
        );

        if (values.length > 0) {
            params.set(name, values.join(","));
        } else {
            params.delete(name);
        }

        pushParams(params);
    }

    function toggleValues(
        name: string,
        currentValues: string[],
        valuesToToggle: readonly string[],
    ) {
        const selectedSet = new Set(
            currentValues,
        );
        const allSelected =
            valuesToToggle.every((value) =>
                selectedSet.has(value),
            );

        if (allSelected) {
            valuesToToggle.forEach((value) =>
                selectedSet.delete(value),
            );
        } else {
            valuesToToggle.forEach((value) =>
                selectedSet.add(value),
            );
        }

        updateListFilter(
            name,
            [...selectedSet],
        );
    }

    function updateSalaryFilter({
        period,
        minimum,
        maximum,
    }: {
        period: SalaryPeriodFilter;
        minimum: string;
        maximum: string;
    }) {
        const params = new URLSearchParams(
            searchParams.toString(),
        );

        params.set("salaryPeriod", period);
        params.set("salaryCurrency", "USD");

        if (minimum.trim()) {
            params.set(
                "salaryMin",
                minimum.trim(),
            );
        } else {
            params.delete("salaryMin");
        }

        if (maximum.trim()) {
            params.set(
                "salaryMax",
                maximum.trim(),
            );
        } else {
            params.delete("salaryMax");
        }

        setOpenFilter(null);
        pushParams(params);
    }

    function clearSalaryFilter() {
        const params = new URLSearchParams(
            searchParams.toString(),
        );

        params.delete("salaryPeriod");
        params.delete("salaryMin");
        params.delete("salaryMax");
        params.delete("salaryCurrency");

        setOpenFilter(null);
        pushParams(params);
    }

    function updateListingTime(
        value: string,
    ) {
        const params = new URLSearchParams(
            searchParams.toString(),
        );

        if (value) {
            params.set(
                "publishedWithinDays",
                value,
            );
        } else {
            params.delete(
                "publishedWithinDays",
            );
        }

        setOpenFilter(null);
        pushParams(params);
    }

    function clearAdvancedFilters() {
        const params = new URLSearchParams(
            searchParams.toString(),
        );

        ADVANCED_FILTER_KEYS.forEach((key) =>
            params.delete(key),
        );

        setOpenFilter(null);
        pushParams(params);
    }

    function toggleOpenFilter(id: FilterMenu) {
        setOpenFilter((current) =>
            current === id ? null : id,
        );
    }

    return (
        <section
            ref={containerRef}
            aria-label="Advanced job filters"
            className="mt-4 flex flex-wrap items-center gap-2"
        >
            <div className="contents">
                <button
                    type="button"
                    aria-expanded={shouldShowFilters}
                    onClick={() => {
                        setIsExpanded(
                            (current) => !current,
                        );
                        setOpenFilter(null);
                    }}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                    <SlidersHorizontal className="size-4" />
                    More options

                    {activeGroupCount > 0 && (
                        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white">
                            {activeGroupCount}
                        </span>
                    )}

                    <ChevronDown
                        className={`size-4 transition-transform ${
                            shouldShowFilters
                                ? "rotate-180"
                                : ""
                        }`}
                    />
                </button>

                {hasActiveAdvancedFilters && (
                    <button
                        type="button"
                        onClick={clearAdvancedFilters}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                        <RotateCcw className="size-4" />
                        Clear filters
                    </button>
                )}
            </div>

            {shouldShowFilters && (
                <div className="contents">
                    <FilterDropdown
                        id="pay"
                        label="Pay"
                        summary={formatPaySummary({
                            period: salaryPeriod,
                            minimum: salaryMinimum,
                            maximum: salaryMaximum,
                        })}
                        isActive={hasPayFilter}
                        isOpen={openFilter === "pay"}
                        onToggle={toggleOpenFilter}
                        widthClassName="w-[min(27rem,calc(100vw-2rem))]"
                    >
                        <PayFilterPanel
                            key={`${salaryPeriod ?? ""}|${salaryMinimum ?? ""}|${salaryMaximum ?? ""}`}
                            initialPeriod={
                                salaryPeriod === "HOURLY" ||
                                salaryPeriod === "MONTHLY" ||
                                salaryPeriod === "YEARLY"
                                    ? salaryPeriod
                                    : ""
                            }
                            initialMinimum={
                                salaryMinimum ?? ""
                            }
                            initialMaximum={
                                salaryMaximum ?? ""
                            }
                            onApply={
                                updateSalaryFilter
                            }
                            onClear={
                                clearSalaryFilter
                            }
                        />
                    </FilterDropdown>

                    <FilterDropdown
                        id="type"
                        label="Type"
                        summary={getSingleOrCountSummary(
                            "Type",
                            selectedEmploymentTypes,
                            employmentLabels,
                        )}
                        isActive={
                            selectedEmploymentTypes.length >
                            0
                        }
                        isOpen={
                            openFilter === "type"
                        }
                        onToggle={toggleOpenFilter}
                    >
                        <fieldset>
                            <legend className="text-base font-bold text-slate-950">
                                Employment type
                            </legend>

                            <div className="mt-3 space-y-1">
                                {employmentTypeFilterGroups.map(
                                    (group) => {
                                        const checked =
                                            group.values.every(
                                                (
                                                    value,
                                                ) =>
                                                    selectedEmploymentTypes.includes(
                                                        value,
                                                    ),
                                            );

                                        return (
                                            <FilterCheckbox
                                                key={
                                                    group.label
                                                }
                                                checked={
                                                    checked
                                                }
                                                label={
                                                    group.label
                                                }
                                                onChange={() =>
                                                    toggleValues(
                                                        "employmentType",
                                                        selectedEmploymentTypes,
                                                        group.values,
                                                    )
                                                }
                                            />
                                        );
                                    },
                                )}
                            </div>
                        </fieldset>
                    </FilterDropdown>

                    <FilterDropdown
                        id="workplace"
                        label="Workplace"
                        summary={getSingleOrCountSummary(
                            "Workplace",
                            selectedWorkplaceTypes,
                            workplaceLabels,
                        )}
                        isActive={
                            selectedWorkplaceTypes.length >
                            0
                        }
                        isOpen={
                            openFilter === "workplace"
                        }
                        onToggle={toggleOpenFilter}
                    >
                        <fieldset>
                            <legend className="text-base font-bold text-slate-950">
                                Workplace type
                            </legend>

                            <div className="mt-3 space-y-1">
                                {workplaceTypeOptions.map(
                                    (option) => (
                                        <FilterCheckbox
                                            key={
                                                option.value
                                            }
                                            checked={selectedWorkplaceTypes.includes(
                                                option.value,
                                            )}
                                            label={
                                                option.label
                                            }
                                            onChange={() =>
                                                toggleValues(
                                                    "workplaceType",
                                                    selectedWorkplaceTypes,
                                                    [
                                                        option.value,
                                                    ],
                                                )
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        </fieldset>
                    </FilterDropdown>

                    <FilterDropdown
                        id="classification"
                        label="Classification"
                        summary={
                            selectedCategoryLabels.length ===
                            1
                                ? selectedCategoryLabels[0] ??
                                  "Classification"
                                : selectedCategoryLabels.length >
                                    1
                                  ? `Classification (${selectedCategoryLabels.length})`
                                  : "Classification"
                        }
                        isActive={
                            selectedCategories.length > 0
                        }
                        isOpen={
                            openFilter ===
                            "classification"
                        }
                        onToggle={toggleOpenFilter}
                        widthClassName="w-[min(28rem,calc(100vw-2rem))]"
                    >
                        <fieldset>
                            <legend className="text-base font-bold text-slate-950">
                                Classification
                            </legend>

                            {isCategoriesLoading && (
                                <div className="mt-4 space-y-3">
                                    {Array.from({
                                        length: 6,
                                    }).map(
                                        (_, index) => (
                                            <div
                                                key={
                                                    index
                                                }
                                                className="h-9 animate-pulse rounded-xl bg-slate-100"
                                            />
                                        ),
                                    )}
                                </div>
                            )}

                            {!isCategoriesLoading &&
                                categories.length ===
                                    0 && (
                                    <p className="mt-4 text-sm text-slate-500">
                                        No classifications
                                        are available.
                                    </p>
                                )}

                            {!isCategoriesLoading &&
                                categories.length >
                                    0 && (
                                    <div className="mt-3 max-h-96 space-y-1 overflow-y-auto pr-1">
                                        {categories.map(
                                            (
                                                category,
                                            ) => (
                                                <FilterCheckbox
                                                    key={
                                                        category.id
                                                    }
                                                    checked={selectedCategories.includes(
                                                        category.slug,
                                                    )}
                                                    label={
                                                        category.name
                                                    }
                                                    count={
                                                        category.jobCount
                                                    }
                                                    onChange={() =>
                                                        toggleValues(
                                                            "category",
                                                            selectedCategories,
                                                            [
                                                                category.slug,
                                                            ],
                                                        )
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>
                                )}
                        </fieldset>
                    </FilterDropdown>

                    <FilterDropdown
                        id="experience"
                        label="Experience"
                        summary={getSingleOrCountSummary(
                            "Experience",
                            selectedExperienceLevels,
                            experienceLabels,
                        )}
                        isActive={
                            selectedExperienceLevels.length >
                            0
                        }
                        isOpen={
                            openFilter ===
                            "experience"
                        }
                        onToggle={toggleOpenFilter}
                    >
                        <fieldset>
                            <legend className="text-base font-bold text-slate-950">
                                Experience level
                            </legend>

                            <div className="mt-3 max-h-80 space-y-1 overflow-y-auto">
                                {experienceLevelOptions.map(
                                    (option) => (
                                        <FilterCheckbox
                                            key={
                                                option.value
                                            }
                                            checked={selectedExperienceLevels.includes(
                                                option.value,
                                            )}
                                            label={
                                                option.label
                                            }
                                            onChange={() =>
                                                toggleValues(
                                                    "experienceLevel",
                                                    selectedExperienceLevels,
                                                    [
                                                        option.value,
                                                    ],
                                                )
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        </fieldset>
                    </FilterDropdown>

                    <FilterDropdown
                        id="listingTime"
                        label="Listing time"
                        summary={
                            listingTimeOptions.find(
                                (option) =>
                                    option.value ===
                                    (publishedWithinDays ??
                                        ""),
                            )?.label ??
                            "Listing time"
                        }
                        isActive={
                            hasListingTimeFilter
                        }
                        isOpen={
                            openFilter ===
                            "listingTime"
                        }
                        align="right"
                        onToggle={toggleOpenFilter}
                    >
                        <fieldset>
                            <legend className="text-base font-bold text-slate-950">
                                Listing time
                            </legend>

                            <div className="mt-3 space-y-1">
                                {listingTimeOptions.map(
                                    (option) => (
                                        <label
                                            key={
                                                option.value ||
                                                "any-time"
                                            }
                                            className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                                        >
                                            <input
                                                type="radio"
                                                name="publishedWithinDays"
                                                value={
                                                    option.value
                                                }
                                                checked={
                                                    (publishedWithinDays ??
                                                        "") ===
                                                    option.value
                                                }
                                                onChange={() =>
                                                    updateListingTime(
                                                        option.value,
                                                    )
                                                }
                                                className="size-5 border-slate-300 accent-blue-600"
                                            />

                                            {
                                                option.label
                                            }
                                        </label>
                                    ),
                                )}
                            </div>
                        </fieldset>
                    </FilterDropdown>
                </div>
            )}
        </section>
    );
}
