"use client"

import { LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom"

type ButtonProps = {
    theme?: "primary" | "danger" | "secondary" | "custom",
    href?: string,
    onClick?: () => void,
    className?: string
    children: React.ReactNode
}

export default function Button({ theme = "primary", href, onClick, className = "", children }: ButtonProps) {
    const { pending } = useFormStatus();

    className = (
        "flex items-center justify-center w-full px-2 py-1 font-semibold rounded-md " +
        className + " " +
        (
            theme === "primary" ? "bg-uw text-white/90 hover:bg-uw-light" :
            theme === "secondary" ? "text-gray-500/90 border-gray-300 border-2 hover:bg-gray-200" :
            theme === "danger" ? "text-white/90 bg-red-500 hover:bg-red-400" : ""
        )
    );

    if (href) {
        return (
            <Link
                href={href}
                className={className}
            >
                {children}
            </Link>
        )
    }

    return (
        <button
            type={onClick ? "button" : "submit"}
            onClick={onClick || undefined}
            disabled={pending}
            className={className}
        >
            {
                pending ? (
                    <LoaderCircleIcon className="h-6 p-1 animate-spin"/>
                ) : children
            }
        </button>
    )
}