"use client";

import axios from "axios";
import {
    LoaderCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { toast } from "sonner";

import { googleLogin } from "../api/googleLogin";
import { useAuthStore } from "../store/authStore";
import { publishAuthTabEvent } from "../utils/authTabSync";
import { getDefaultRedirectPath } from "../utils/getDefaultRedirectPath";
import {
    clearRememberedAuthReturnUrl,
    getAuthDestination,
} from "../utils/authReturnUrl";

const GOOGLE_IDENTITY_SCRIPT_ID =
    "google-identity-services";
const GOOGLE_IDENTITY_SCRIPT_SRC =
    "https://accounts.google.com/gsi/client";

type GoogleCredentialResponse = {
    credential?: string;
    select_by?: string;
    clientId?: string;
};

type GoogleButtonConfiguration = {
    type: "standard";
    theme: "outline";
    size: "large";
    text: "continue_with";
    shape: "rectangular";
    logo_alignment: "left";
    width: string;
};

type GoogleIdentityApi = {
    accounts: {
        id: {
            initialize: (options: {
                client_id: string;
                callback: (
                    response:
                        GoogleCredentialResponse,
                ) => void;
                auto_select?: boolean;
                cancel_on_tap_outside?: boolean;
            }) => void;

            renderButton: (
                parent: HTMLElement,
                options:
                    GoogleButtonConfiguration,
            ) => void;
        };
    };
};

type GoogleCredentialHandler = (
    response: GoogleCredentialResponse,
) => void;

type JobsSpotGoogleIdentityState = {
    clientId: string | null;
    initialized: boolean;
    handlers: Set<GoogleCredentialHandler>;
};

const GOOGLE_IDENTITY_STATE_KEY =
    "__jobsspotGoogleIdentityState";

function getGoogleIdentityState(): JobsSpotGoogleIdentityState {
    const existingState =
        window[
            GOOGLE_IDENTITY_STATE_KEY
        ];

    if (existingState) {
        return existingState;
    }

    const state: JobsSpotGoogleIdentityState = {
        clientId: null,
        initialized: false,
        handlers:
            new Set<GoogleCredentialHandler>(),
    };

    window[
        GOOGLE_IDENTITY_STATE_KEY
    ] = state;

    return state;
}

function dispatchGoogleCredential(
    response: GoogleCredentialResponse,
): void {
    const handlers = Array.from(
        getGoogleIdentityState().handlers,
    );

    const activeHandler =
        handlers.at(-1);

    activeHandler?.(response);
}

function initializeGoogleIdentity(
    google: GoogleIdentityApi,
    clientId: string,
): void {
    const state =
        getGoogleIdentityState();

    if (state.initialized) {
        if (
            state.clientId !== clientId
        ) {
            throw new Error(
                "Google Identity Services was initialized with a different client ID.",
            );
        }

        return;
    }

    google.accounts.id.initialize({
        client_id: clientId,
        callback:
            dispatchGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
    });

    state.clientId = clientId;
    state.initialized = true;
}

declare global {
    interface Window {
        google?: GoogleIdentityApi;
        __jobsspotGoogleIdentityState?:
            JobsSpotGoogleIdentityState;
    }
}

type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

type GoogleSignInButtonProps = Readonly<{
    returnUrl?: string | null;
    defaultRedirectPath?: string;
    onSuccess?: () => void;
}>;

function getGoogleErrorMessage(
    error: unknown,
): string {
    if (
        axios.isAxiosError<ApiErrorResponse>(
            error,
        )
    ) {
        if (
            error.response?.status === 429
        ) {
            return "Too many Google sign-in attempts. Please wait a few minutes and try again.";
        }

        const validationMessage =
            Object.values(
                error.response?.data?.errors ??
                    {},
            )
                .flat()
                .find(Boolean);

        return (
            validationMessage ??
            error.response?.data?.message ??
            "Google sign-in could not be completed. Please try again."
        );
    }

    return "Google sign-in could not be completed. Please try again.";
}

export default function GoogleSignInButton({
    returnUrl,
    defaultRedirectPath,
    onSuccess,
}: GoogleSignInButtonProps) {
    const router = useRouter();

    const setSession =
        useAuthStore(
            (state) => state.setSession,
        );

    const buttonWrapperRef =
        useRef<HTMLDivElement | null>(
            null,
        );
    const buttonMountRef =
        useRef<HTMLDivElement | null>(
            null,
        );
    const isAuthenticatingRef =
        useRef(false);
    const lastRenderedButtonWidthRef =
        useRef(0);

    const [
        isAuthenticating,
        setIsAuthenticating,
    ] = useState(false);
    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const clientId =
        process.env
            .NEXT_PUBLIC_GOOGLE_CLIENT_ID
            ?.trim() ?? "";

    const handleCredential =
        useCallback(
            async (
                response:
                    GoogleCredentialResponse,
            ) => {
                if (
                    isAuthenticatingRef.current ||
                    !response.credential
                ) {
                    if (
                        !response.credential
                    ) {
                        setErrorMessage(
                            "Google did not return a sign-in credential. Please try again.",
                        );
                    }

                    return;
                }

                setErrorMessage("");
                isAuthenticatingRef.current =
                    true;
                setIsAuthenticating(true);

                try {
                    const loginResponse =
                        await googleLogin({
                            credential:
                                response.credential,
                        });

                    setSession(
                        loginResponse.user,
                        loginResponse.accessToken,
                    );

                    publishAuthTabEvent(
                        "session-updated",
                    );

                    const destination =
                        getAuthDestination({
                            returnUrl,
                            defaultPath:
                                defaultRedirectPath,
                            fallbackPath:
                                getDefaultRedirectPath(),
                        });

                    clearRememberedAuthReturnUrl();

                    const isEmployerDestination =
                        destination ===
                            "/employers" ||
                        destination.startsWith(
                            "/employers/",
                        );

                    const title =
                        loginResponse.isNewUser
                            ? `Welcome to JobsSpot, ${loginResponse.user.firstName}!`
                            : loginResponse.accountLinked
                              ? `Google connected, ${loginResponse.user.firstName}!`
                              : `Welcome back, ${loginResponse.user.firstName}!`;

                    const description =
                        isEmployerDestination
                            ? "Opening your employer workspace."
                            : loginResponse.accountLinked
                              ? "Google is now connected to your JobsSpot account."
                              : "You’re signed in and ready to continue.";

                    toast.success(title, {
                        description,
                    });

                    onSuccess?.();

                    router.replace(
                        destination,
                    );
                } catch (error) {
                    setErrorMessage(
                        getGoogleErrorMessage(
                            error,
                        ),
                    );
                    isAuthenticatingRef.current =
                        false;
                    setIsAuthenticating(false);
                }
            },
            [
                defaultRedirectPath,
                onSuccess,
                returnUrl,
                router,
                setSession,
            ],
        );

    useEffect(() => {
        if (!clientId) {
            return;
        }

        let isMounted = true;
        let renderFrameId:
            | number
            | null = null;
        let secondRenderFrameId:
            | number
            | null = null;

        const googleIdentityState =
            getGoogleIdentityState();

        googleIdentityState.handlers.add(
            handleCredential,
        );

        const renderButton = () => {
            const wrapper =
                buttonWrapperRef.current;
            const mountNode =
                buttonMountRef.current;
            const google =
                window.google;

            if (
                !isMounted ||
                !wrapper ||
                !mountNode ||
                !google
            ) {
                return;
            }

            const measuredWidth =
                wrapper
                    .getBoundingClientRect()
                    .width;

            if (measuredWidth <= 0) {
                return;
            }

            const buttonWidth = Math.min(
                400,
                Math.max(
                    240,
                    Math.floor(measuredWidth),
                ),
            );

            if (
                Math.abs(
                    lastRenderedButtonWidthRef.current -
                        buttonWidth,
                ) < 2 &&
                mountNode.childElementCount > 0
            ) {
                return;
            }

            try {
                initializeGoogleIdentity(
                    google,
                    clientId,
                );
            } catch (error) {
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Google sign-in could not be initialized.",
                );

                return;
            }

            mountNode.replaceChildren();

            google.accounts.id.renderButton(
                mountNode,
                {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    text: "continue_with",
                    shape: "rectangular",
                    logo_alignment: "left",
                    width:
                        String(buttonWidth),
                },
            );

            lastRenderedButtonWidthRef.current =
                buttonWidth;
        };

        const scheduleButtonRender = () => {
            if (!isMounted) {
                return;
            }

            if (renderFrameId !== null) {
                window.cancelAnimationFrame(
                    renderFrameId,
                );
            }

            if (
                secondRenderFrameId !== null
            ) {
                window.cancelAnimationFrame(
                    secondRenderFrameId,
                );
            }

            renderFrameId =
                window.requestAnimationFrame(
                    () => {
                        secondRenderFrameId =
                            window.requestAnimationFrame(
                                renderButton,
                            );
                    },
                );
        };

        const handleScriptError = () => {
            if (!isMounted) {
                return;
            }

            setErrorMessage(
                "Google sign-in could not load. Check your connection or browser privacy settings, then refresh the page.",
            );
        };

        let script =
            document.getElementById(
                GOOGLE_IDENTITY_SCRIPT_ID,
            ) as HTMLScriptElement | null;

        if (!script) {
            script =
                document.createElement(
                    "script",
                );

            script.id =
                GOOGLE_IDENTITY_SCRIPT_ID;
            script.src =
                GOOGLE_IDENTITY_SCRIPT_SRC;
            script.async = true;
            script.defer = true;

            document.head.appendChild(
                script,
            );
        }

        if (window.google) {
            scheduleButtonRender();
        } else {
            script.addEventListener(
                "load",
                scheduleButtonRender,
            );
            script.addEventListener(
                "error",
                handleScriptError,
            );
        }

        const resizeObserver =
            typeof ResizeObserver ===
            "undefined"
                ? null
                : new ResizeObserver(
                      scheduleButtonRender,
                  );

        const wrapper =
            buttonWrapperRef.current;

        if (
            resizeObserver &&
            wrapper
        ) {
            resizeObserver.observe(
                wrapper,
            );
        }

        window.addEventListener(
            "resize",
            scheduleButtonRender,
        );

        return () => {
            isMounted = false;

            googleIdentityState.handlers.delete(
                handleCredential,
            );

            script?.removeEventListener(
                "load",
                scheduleButtonRender,
            );
            script?.removeEventListener(
                "error",
                handleScriptError,
            );

            resizeObserver?.disconnect();

            window.removeEventListener(
                "resize",
                scheduleButtonRender,
            );

            if (renderFrameId !== null) {
                window.cancelAnimationFrame(
                    renderFrameId,
                );
            }

            if (
                secondRenderFrameId !== null
            ) {
                window.cancelAnimationFrame(
                    secondRenderFrameId,
                );
            }
        };
    }, [
        clientId,
        handleCredential,
    ]);

    if (isAuthenticating) {
        return (
            <button
                type="button"
                disabled
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600"
            >
                <LoaderCircle className="size-4 animate-spin" />
                Signing in with Google...
            </button>
        );
    }

    if (!clientId) {
        return (
            <div>
                <button
                    type="button"
                    disabled
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500"
                >
                    Continue with Google
                </button>

                <p
                    role="alert"
                    className="mt-2 text-sm leading-6 text-red-600"
                >
                    Google sign-in is not configured for this environment.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div
                ref={buttonWrapperRef}
                className="w-full"
            >
                <div
                    ref={buttonMountRef}
                    aria-label="Continue with Google"
                    className="flex min-h-11 w-full items-center justify-center"
                />
            </div>

            {errorMessage && (
                <p
                    role="alert"
                    className="mt-2 text-sm leading-6 text-red-600"
                >
                    {errorMessage}
                </p>
            )}
        </div>
    );
}
