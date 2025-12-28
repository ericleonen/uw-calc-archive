"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { ChartPieIcon, CircleQuestionMarkIcon, SearchIcon, User2Icon } from "lucide-react";


type MobileAppBarLinkProps = {
    label: string,
    to: string,
    activeFor?: string[]
}

const MOBILE_ICON_MAP: {
    [key: string]: ForwardRefExoticComponent<RefAttributes<SVGSVGElement>>
} = {
    "about": CircleQuestionMarkIcon,
    "search": SearchIcon,
    "stats": ChartPieIcon,
    "profile": User2Icon,
    "login": User2Icon,
    "signup": User2Icon
}

export default function MobileAppBarLink({ label, to, activeFor = [to] }: MobileAppBarLinkProps) {
    const Icon = MOBILE_ICON_MAP[to];

    const pathname = usePathname()
    const activeSegment = pathname.split("/")[1] || "";

    return (
        <Link
            href={`${to}`}
            className={
                "flex flex-col items-center justify-center h-full p-1 aspect-square rounded-full " +
                (activeFor.includes(activeSegment) ? "text-uw/90" : "text-gray-400/90 hover:text-uw/90 hover:bg-purple-100")
            }
            title={label}
        >
            <Icon />
        </Link>
    )
}