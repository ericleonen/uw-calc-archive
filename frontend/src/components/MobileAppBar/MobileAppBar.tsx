"use client"

import { CircleQuestionMarkIcon, SearchIcon, User2Icon } from "lucide-react";
import MobileAppBarLink from "./MobileAppBarLink";
import useUser from "@/hooks/useUser";

export default function MobileAppBar() {
    const { data: user } = useUser();

    return (
        <div className="flex justify-around w-full h-16 p-2 bg-white/90 border-t-2 border-t-gray-300 lg:hidden shrink-0">
            <MobileAppBarLink
                Icon={CircleQuestionMarkIcon}
                label="About"
                to="about"
            />
            <MobileAppBarLink
                Icon={SearchIcon}
                label="Search"
                to="search"
            />
            <MobileAppBarLink 
                Icon={User2Icon}
                label="Profile"
                to={user ? "profile" : "login"}
            />
        </div>
    )
}