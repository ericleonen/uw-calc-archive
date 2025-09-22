import HeaderLink from "./HeaderLink";
import { getCurrentUser } from "@/server/auth";

export default async function Header() {
    const user = await getCurrentUser();

    return (
        <header className="relative flex items-center w-full px-6 shadow h-14 bg-uw shrink-0">
            <h1 className="font-bold text-white/90 lg:static absolute left-1/2 lg:left-0 translate-x-[-50%] lg:translate-x-0">UW CalcArchive</h1>
            <div className="hidden ml-auto space-x-8 lg:flex">
                <HeaderLink label="Search" to="search" />
                <HeaderLink label="About" to="about" />
                {
                    user ? (
                        <HeaderLink label="My Profile" to="profile" />
                    ): (
                        <>
                            <HeaderLink label="Sign up" to="signup" />
                            <HeaderLink label="Log in" to="login" />
                        </>
                    )
                }
            </div>
        </header>
    )
}