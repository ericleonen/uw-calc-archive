"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type HeaderLinkProps = {
    label: string,
    to: string
}

export default function HeaderLink({ label, to }: HeaderLinkProps) {
    const pathname = usePathname();
    const active = pathname.split("/").at(-1) === to;

    return (
        <Link 
            href={`${to}`}
            className={
                "text-white/90 font-medium rounded-md px-2 py-1 hover:bg-uw-light/30 " +
                (active ? "bg-uw-light/30 pointer-events-none" : "pointer-events-auto")
            }
        >
            {label}
        </Link>
    )
}