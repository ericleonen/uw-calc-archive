"use client"

import { LoaderCircleIcon } from "lucide-react";
import { useFormStatus } from "react-dom"

type SubmitButtonProps = {
    label: string
}

export default function SubmitButton({ label }: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex items-center justify-center w-full px-2 py-1 my-6 font-semibold rounded-md bg-uw/90 text-white/90 hover:bg-uw/70"
        >
            {
                pending ? (
                    <LoaderCircleIcon className="h-6 p-1 animate-spin"/>
                ) : label
            }
        </button>
    )
}