"use client"

import { CircleQuestionMarkIcon, SearchIcon, User2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppBar() {
    return (
        <div className="flex justify-around w-full h-16 p-2 bg-white/90 border-t-2 border-t-gray-300 lg:hidden shrink-0">
            <AppBarLink
                Icon={CircleQuestionMarkIcon}
                label="About"
                to="about"
            />
            <AppBarLink
                Icon={SearchIcon}
                label="Search"
                to="search"
            />
            <AppBarLink 
                Icon={User2Icon}
                label="Profile"
                to="signup"
            />
        </div>
    )
}

type AppBarLinkProps = {
    Icon: React.ForwardRefExoticComponent<any>,
    label: string,
    to: string
}

function AppBarLink({ Icon, label, to }: AppBarLinkProps) {
    const pathname = usePathname();
    const active = pathname === `/app/${to}`;

    return (
        <Link
            href={`/app/${to}`}
            className={
                "flex flex-col items-center justify-center h-full p-1 aspect-square rounded-full " +
                (active ? "text-uw/90" : "text-gray-400/90 hover:text-uw/90 hover:bg-purple-100/90")
            }
            title={label}
        >
            <Icon />
        </Link>
    )
}