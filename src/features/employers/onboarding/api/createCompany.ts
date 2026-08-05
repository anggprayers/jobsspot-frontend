import apiClient from "@/lib/apiClient";

import type {
    CreateCompanyInput,
    CreateCompanyResponse,
} from "../types/companyOnboarding";

type CreateCompanyParameters = {
    accessToken: string;
    data: CreateCompanyInput;
};

export async function createCompany({
    accessToken,
    data,
}: CreateCompanyParameters): Promise<CreateCompanyResponse> {
    const response =
        await apiClient.post<CreateCompanyResponse>(
            "/companies",
            data,
            {
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                },
            },
        );

    return response.data;
}
