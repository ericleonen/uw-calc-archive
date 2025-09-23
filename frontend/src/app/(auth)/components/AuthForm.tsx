import Button from "@/components/Button"
import SectionHeader from "@/components/text/SectionHeader"
import React from "react"

type AuthFormProps = {
    action: (formDataOrFormEvent: FormData) => Promise<void>
    title: string,
    submitLabel: string,
    error?: string,
    status?: string,
    children: React.ReactNode
} | {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
    title: string,
    submitLabel: string,
    error?: string,
    status?: string,
    children: React.ReactNode
}

export default function AuthForm(props: AuthFormProps) {
    return (
        <form
            action={"action" in props ? props.action : undefined}
            onSubmit={"onSubmit" in props ? props.onSubmit : undefined}
            className="flex flex-col items-center w-full max-w-sm p-6 rounded-md shadow bg-white/90 h-min"
        >
            <SectionHeader>{props.title}</SectionHeader>
            {
                props.error ? (
                    <div className="w-full px-2 py-1 mt-1 text-sm font-medium text-center bg-red-100 border-2 border-red-300 rounded-md text-red-500/90">
                        <b>Sorry, there was an error:</b>
                        <p>{props.error}</p>
                    </div>
                ) : props.status ? (
                    <div className="w-full px-2 py-1 mt-1 text-sm font-medium text-center bg-blue-100 border-2 border-blue-300 rounded-md text-blue-500/90">
                        {props.status}
                    </div>
                ) : null
            }
            <div className="w-full mt-1 space-y-2">
                {props.children}
            </div>
            <Button className="mt-6">{props.submitLabel}</Button>
        </form>
    )
}