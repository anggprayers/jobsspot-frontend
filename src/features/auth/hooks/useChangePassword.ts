"use client";

import { useMutation } from "@tanstack/react-query";

import { changePassword } from "../api/changePassword";
import type { ChangePasswordRequest } from "../types/auth";

export function useChangePassword() {
    return useMutation({
        mutationFn: (data: ChangePasswordRequest) => changePassword(data),
    });
}
