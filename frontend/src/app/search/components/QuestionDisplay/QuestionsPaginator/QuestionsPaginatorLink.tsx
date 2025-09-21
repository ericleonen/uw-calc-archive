"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

type QuestionsPaginatorLinkProps = {
    toPage: number,
    active?: boolean,
    disabled?: boolean
    children: React.ReactNode
}

export default function QuestionsPaginatorLink({ toPage, active, disabled, children }: QuestionsPaginatorLinkProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("page", String(toPage));
    
    return (
        <Link
            href={`${pathname}?${sp.toString()}`}
            className={
                "font-bold rounded-full shadow-none h-8 w-8 flex items-center justify-center text-sm " +
                (active ? "bg-uw text-white/90 pointer-events-none " : "bg-transparent text-gray-500/90 hover:text-uw hover:bg-purple-100 pointer-events-auto ") +
                (disabled ? "pointer-events-none !text-gray-300/90" : "pointer-events-auto")
            }
        >
            {children}
        </Link>
    )
}