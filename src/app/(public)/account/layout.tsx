import AccountLayout from "@/features/account/components/AccountLayout";

type AccountRouteLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function AccountRouteLayout({
    children,
}: AccountRouteLayoutProps) {
    return <AccountLayout>{children}</AccountLayout>;
}
