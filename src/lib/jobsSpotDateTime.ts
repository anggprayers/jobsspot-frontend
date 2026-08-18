export const JOBS_SPOT_TIME_ZONE = "America/New_York";

const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function getDatePartsInJobsSpotTimeZone(value: Date) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: JOBS_SPOT_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(value);

    const getPart = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((part) => part.type === type)?.value ?? "";

    return {
        year: getPart("year"),
        month: getPart("month"),
        day: getPart("day"),
    };
}

function parseDateInput(value: string) {
    const match = DATE_INPUT_PATTERN.exec(value);

    if (!match) {
        throw new Error("Invalid date input. Expected YYYY-MM-DD.");
    }

    return {
        year: Number(match[1]),
        month: Number(match[2]),
        day: Number(match[3]),
    };
}

function getJobsSpotOffsetMilliseconds(value: Date): number {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: JOBS_SPOT_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    }).formatToParts(value);

    const values = Object.fromEntries(
        parts
            .filter((part) => part.type !== "literal")
            .map((part) => [part.type, part.value]),
    );

    const representedAsUtc = Date.UTC(
        Number(values.year),
        Number(values.month) - 1,
        Number(values.day),
        Number(values.hour),
        Number(values.minute),
        Number(values.second),
    );

    return representedAsUtc - Math.floor(value.getTime() / 1000) * 1000;
}

export function toJobsSpotDateInput(value: string | Date): string {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const { year, month, day } = getDatePartsInJobsSpotTimeZone(date);
    return `${year}-${month}-${day}`;
}

export function getJobsSpotTodayDateInput(): string {
    return toJobsSpotDateInput(new Date());
}

export function addDaysToDateInput(value: string, days: number): string {
    const { year, month, day } = parseDateInput(value);
    const date = new Date(Date.UTC(year, month - 1, day + days));
    return date.toISOString().slice(0, 10);
}

export function jobsSpotEndOfDayToIso(value: string): string {
    const { year, month, day } = parseDateInput(value);
    const wallClockUtcGuess = new Date(
        Date.UTC(year, month - 1, day, 23, 59, 59),
    );

    const initialOffset = getJobsSpotOffsetMilliseconds(wallClockUtcGuess);
    let result = new Date(wallClockUtcGuess.getTime() - initialOffset);
    const resolvedOffset = getJobsSpotOffsetMilliseconds(result);

    if (resolvedOffset !== initialOffset) {
        result = new Date(wallClockUtcGuess.getTime() - resolvedOffset);
    }

    result.setUTCMilliseconds(999);
    return result.toISOString();
}
