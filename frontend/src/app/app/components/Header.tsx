"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    return (
        <header className="relative flex items-center w-full px-6 h-14 bg-uw/90 shrink-0 shadow">
            <h1 className="font-bold text-white/90 lg:static absolute left-1/2 lg:left-0 translate-x-[-50%] lg:translate-x-0">UW CalcArchive</h1>
            <div className="hidden ml-auto space-x-8 lg:flex">
                <HeaderLink label="Search" to="search" />
                <HeaderLink label="About" to="about" />
                <HeaderLink label="Sign up" to="signup" />
            </div>
        </header>
    )
}

type HeaderLinkProps = {
    label: string,
    to: string
}

function HeaderLink({ label, to }: HeaderLinkProps) {
    const pathname = usePathname();
    const active = pathname === `/app/${to}`;

    return (
        <Link 
            href={`${to}`}
            className={
                "text-white/90 font-medium rounded-md px-2 py-1 " +
                (active ? "bg-purple-100/10 hover:bg-purple-100/10" : "bg-transparent hover:bg-purple-400/10")
            }
        >
            {label}
        </Link>
    )
}