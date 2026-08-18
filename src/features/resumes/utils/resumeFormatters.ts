import axios from "axios";

import { JOBS_SPOT_TIME_ZONE } from "@/lib/jobsSpotDateTime";

const MIME_TYPE_LABELS: Record<string, string> = {
    "application/pdf": "PDF",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "DOCX",
    "application/octet-stream": "Document",
};

export function formatResumeFileType(mimeType: string): string {
    return MIME_TYPE_LABELS[mimeType] ?? "Document";
}

export function formatResumeFileSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const kilobytes = bytes / 1024;

    if (kilobytes < 1024) {
        return `${kilobytes.toFixed(kilobytes >= 100 ? 0 : 1)} KB`;
    }

    const megabytes = kilobytes / 1024;

    return `${megabytes.toFixed(megabytes >= 10 ? 1 : 2)} MB`;
}

export function formatResumeDate(value: string): string {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: JOBS_SPOT_TIME_ZONE,
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export function getResumeErrorMessage(
    error: unknown,
    fallback: string,
): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}
