import MobileAppBarLink from "./MobileAppBarLink";
import { getCurrentUser } from "@/server/auth";

export default async function MobileAppBar() {
    const user = await getCurrentUser();

    return (
        <div className="flex justify-around w-full h-16 p-2 bg-white border-t-2 border-t-gray-300 lg:hidden shrink-0">
            <MobileAppBarLink
                label="About"
                to="about"
            />
            <MobileAppBarLink
                label="Search"
                to="search"
            />
            <MobileAppBarLink
                label="Stats"
                to="stats"
            />
            <MobileAppBarLink
                label="Profile"
                to={user ? "profile" : "login"}
                activeFor={["profile", "login", "signup"]}
            />
        </div>
    )
}