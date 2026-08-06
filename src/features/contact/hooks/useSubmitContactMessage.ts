"use client";

import { useMutation } from "@tanstack/react-query";

import { submitContactMessage } from "../api/submitContactMessage";

export function useSubmitContactMessage() {
    return useMutation({
        mutationFn: submitContactMessage,
    });
}
