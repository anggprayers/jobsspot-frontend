import clsx from "clsx";
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

type InputProps = Readonly<
    InputHTMLAttributes<HTMLInputElement> & {
        label?: string;
        error?: string;
        helperText?: string;
        startIcon?: ReactNode;
        endIcon?: ReactNode;
    }
>;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { id, label, error, helperText, startIcon, endIcon, className, disabled, required, ...props },
    ref,
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="mb-2 block text-base font-semibold text-slate-800"
                >
                    {label}

                    {required && (
                        <span className="ml-1 text-red-500" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}

            <div className="relative">
                {startIcon && (
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        {startIcon}
                    </span>
                )}

                <input
                    {...props}
                    ref={ref}
                    id={inputId}
                    disabled={disabled}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error || helperText ? messageId : undefined}
                    className={clsx(
                        "min-h-13 w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-950 shadow-sm outline-none transition-all",
                        "placeholder:text-slate-400",
                        "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
                        startIcon && "pl-11",
                        endIcon && "pr-11",
                        error
                            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
                        className,
                    )}
                />

                {endIcon && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                        {endIcon}
                    </span>
                )}
            </div>

            {(error || helperText) && (
                <p
                    id={messageId}
                    className={clsx(
                        "mt-2 text-sm leading-6",
                        error ? "font-medium text-red-600" : "text-slate-500",
                    )}
                >
                    {error ?? helperText}
                </p>
            )}
        </div>
    );
});

export { Input };
export default Input;
