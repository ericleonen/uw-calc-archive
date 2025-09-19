import SubmitButton from "@/components/SubmitButton"

type AuthFormProps = {
    action: (formData: FormData) => Promise<void>,
    title: string,
    submitLabel: string,
    children: React.ReactNode
}

export default function AuthForm({ action, title, submitLabel, children }: AuthFormProps) {
    return (
        <form
            action={action}
            className="flex flex-col items-center w-full max-w-sm p-6 rounded-md shadow bg-white/90 h-min"
        >
            <h2 className="text-lg font-bold text-gray-600/90">{title}</h2>
            <div className="w-full mt-1 space-y-2">
                {children}
            </div>
            <SubmitButton label={submitLabel} className="mt-6" />
        </form>
    )
}