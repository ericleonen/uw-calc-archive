import TextInput from "./TextInput";

type AuthFormProps = {
    title: string,
    formAction: (formData: FormData) => Promise<void>,
    submitLabel: string
}

export default function AuthForm({ title, formAction, submitLabel }: AuthFormProps) {
    return (
        <form className="bg-white/90 rounded-md flex flex-col p-6 h-min items-center w-full max-w-sm shadow">
            <h2 className="font-semibold text-lg text-gray-700/90">{title}</h2>
            <div className="w-full space-y-2">
                <TextInput for_="email" placeholder="Enter email here" />
                <TextInput for_="password" placeholder="Enter password here" />
            </div>
            <button
                formAction={formAction}
                className="my-6 py-1 px-2 bg-uw/90 text-white/90 font-semibold w-full rounded-md hover:bg-uw/70"
            >
                {submitLabel}
            </button>
        </form>
    )
}