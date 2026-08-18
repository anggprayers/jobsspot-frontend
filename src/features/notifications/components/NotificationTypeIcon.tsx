import {
    Bell,
    BriefcaseBusiness,
    Building2,
    CircleAlert,
    FileCheck2,
    Info,
    MailCheck,
    ShieldCheck,
    UserCheck,
} from "lucide-react";

type NotificationTypeIconProps = {
    type: string;
    className?: string;
};

export default function NotificationTypeIcon({
    type,
    className,
}: NotificationTypeIconProps) {
    if (type.includes("APPLICATION_SUBMITTED")) {
        return <FileCheck2 className={className} />;
    }

    if (type.includes("APPLICATION_FIRST_VIEWED")) {
        return <UserCheck className={className} />;
    }

    if (type.includes("APPLICATION_STATUS")) {
        return <BriefcaseBusiness className={className} />;
    }

    if (type.includes("NEW_APPLICATION")) {
        return <MailCheck className={className} />;
    }

    if (type.includes("COMPANY")) {
        return <Building2 className={className} />;
    }

    if (type.includes("JOB")) {
        return <BriefcaseBusiness className={className} />;
    }

    if (type.includes("ADMIN")) {
        return <ShieldCheck className={className} />;
    }

    if (type.includes("REVIEW") || type.includes("SUSPENDED")) {
        return <CircleAlert className={className} />;
    }

    if (type === "SYSTEM") {
        return <Info className={className} />;
    }

    return <Bell className={className} />;
}
