"use client";

import { useMutation } from "@tanstack/react-query";

import { reportJob } from "../api/reportJob";

export function useReportJob() {
    return useMutation({
        mutationFn: reportJob,
    });
}
