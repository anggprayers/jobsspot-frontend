"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getSharedApplication, getSharedCoverLetterDownload, getSharedResumeDownload } from "../api/applicationShareApi";

export function useSharedApplication(token: string) {
    return useQuery({ queryKey: ["application-share", token], queryFn: () => getSharedApplication(token), enabled: Boolean(token), retry: false });
}

export function useSharedResumeDownload(token: string) {
    return useMutation({ mutationFn: () => getSharedResumeDownload(token) });
}

export function useSharedCoverLetterDownload(token: string) {
    return useMutation({ mutationFn: () => getSharedCoverLetterDownload(token) });
}
