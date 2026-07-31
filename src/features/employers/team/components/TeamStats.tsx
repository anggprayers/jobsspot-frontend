import { ShieldCheck, UserCog, UserPlus, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { CompanyMember } from "../types/team";

type TeamStatsProps = {
    members: CompanyMember[];
    isLoading: boolean;
};

export default function TeamStats({ members, isLoading }: TeamStatsProps) {
    const stats = [
        {
            label: "Total members",
            value: members.length,
            icon: Users,
        },
        {
            label: "Owners",
            value: members.filter((member) => member.role === "OWNER").length,
            icon: ShieldCheck,
        },
        {
            label: "Admins",
            value: members.filter((member) => member.role === "ADMIN").length,
            icon: UserCog,
        },
        {
            label: "Recruiters",
            value: members.filter((member) => member.role === "RECRUITER").length,
            icon: UserPlus,
        },
        {
            label: "Viewers",
            value: members.filter((member) => member.role === "VIEWER").length,
            icon: Users,
        },
    ];

    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {stats.map((stat) => (
                <Card key={stat.label}>
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>

                            <p className="mt-1 text-2xl font-bold">
                                {isLoading ? "..." : stat.value}
                            </p>
                        </div>

                        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                            <stat.icon className="size-5" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </section>
    );
}
