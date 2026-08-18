import { useMutation } from "@tanstack/react-query";

import { submitJobSubmission } from "../api/submitJobSubmission";

export function useSubmitJobSubmission() {
    return useMutation({ mutationFn: submitJobSubmission });
}
