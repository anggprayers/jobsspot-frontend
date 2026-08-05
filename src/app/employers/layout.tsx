import EmployersRootLayout from "@/features/employers/components/EmployersRootLayout";

type EmployersLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function EmployersLayout({
    children,
}: EmployersLayoutProps) {
    return (
        <EmployersRootLayout>
            {children}
        </EmployersRootLayout>
    );
}
