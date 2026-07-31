"use client";

import { useMutation } from "@tanstack/react-query";

import { updateProfile } from "../api/updateProfile";
import { useAuthStore } from "../store/authStore";
import type { UpdateProfileRequest } from "../types/auth";

export function useUpdateProfile() {
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: (data: UpdateProfileRequest) => updateProfile(data),

        onSuccess: (response) => {
            setUser(response.user);
        },
    });
}
