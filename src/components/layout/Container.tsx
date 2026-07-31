import type { ReactNode } from "react";

type ContainerProps = Readonly<{
    children: ReactNode;
    className?: string;
}>;

export default function Container({ children, className = "" }: ContainerProps) {
    return (
        <div
            className={`mx-auto w-full max-w-[1440px] px-5 sm:px-7 lg:px-10 xl:px-12 ${className}`}
        >
            {children}
        </div>
    );
}
