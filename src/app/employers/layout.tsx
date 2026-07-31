import EmployerLayout from "@/features/employers/components/EmployerLayout";
import EmployerRouteGuard from "@/features/employers/components/EmployerRouteGuard";

type EmployersLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function EmployersLayout({ children }: EmployersLayoutProps) {
    return (
        <EmployerRouteGuard>
            <EmployerLayout>{children}</EmployerLayout>
        </EmployerRouteGuard>
    );
}
