"use client"

import { CircleQuestionMarkIcon, SearchIcon, User2Icon } from "lucide-react";
import MobileAppBarLink from "./MobileAppBarLink";
import useUser from "@/hooks/useUser";
import { usePathname } from "next/navigation";

export default function MobileAppBar() {
    const { data: user } = useUser();
    const pathname = usePathname();
    const lastPathSegment = pathname.split("/").at(-1) || "";

    return (
        <div className="flex justify-around w-full h-16 p-2 bg-white/90 border-t-2 border-t-gray-300 lg:hidden shrink-0">
            <MobileAppBarLink
                Icon={CircleQuestionMarkIcon}
                label="About"
                to="about"
                active={lastPathSegment === "about"}
            />
            <MobileAppBarLink
                Icon={SearchIcon}
                label="Search"
                to="search"
                active={lastPathSegment === "search"}
            />
            <MobileAppBarLink 
                Icon={User2Icon}
                label="Profile"
                to={user ? "profile" : "login"}
                active={["profile", "login", "signup"].includes(lastPathSegment)}
            />
        </div>
    )
}