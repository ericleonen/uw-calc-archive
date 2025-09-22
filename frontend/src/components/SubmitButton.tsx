"use client"

import { LoaderCircleIcon } from "lucide-react";
import { useFormStatus } from "react-dom"

type SubmitButtonProps = {
    label: string,
    theme?: "primary" | "danger" | "secondary" | "custom",
    className?: string
}

export default function SubmitButton({ label, theme = "primary", className = "" }: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={
                "flex items-center justify-center w-full px-2 py-1 font-semibold rounded-md " +
                className + " " +
                (
                    theme === "primary" ? "bg-uw text-white/90 hover:bg-uw-light" :
                    theme === "secondary" ? "text-gray-400/90 border-gray-300 border-2 hover:bg-gray-200" :
                    theme === "danger" ? "text-white/90 bg-red-500 hover:bg-red-400" : ""
                )
            }
        >
            {
                pending ? (
                    <LoaderCircleIcon className="h-6 p-1 animate-spin"/>
                ) : label
            }
        </button>
    )
}