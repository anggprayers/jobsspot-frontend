import MainLayout from "@/components/layout/MainLayout";

type PublicLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function PublicLayout({ children }: PublicLayoutProps) {
    return <MainLayout>{children}</MainLayout>;
}
