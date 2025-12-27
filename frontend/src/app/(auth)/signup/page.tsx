import { signup } from "@/actions/auth";
import AuthAlternative from "../components/AuthAlternative";
import TextInput from "@/components/TextInput";
import AuthForm from "../components/AuthForm";
import { requireNoUser } from "@/server/guards";

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    requireNoUser();

    const { error } = await searchParams;

    return (
        <>
            <AuthForm
                action={signup}
                title="Create an account"
                submitLabel="Sign up"
                error={
                    !error ? undefined :
                    error === "weak_password" ? "Password is too short or weak. Please enter a stronger password." :
                    error === "password_mismatch" ? "Your password and password confirmation don't match. Please ensure they match." :
                    "An unknown error occurred. Please try again."
                }
            >
                <TextInput for_="name" placeholder="Your name here" />
                <TextInput for_="email" placeholder="Your email here" />
                <TextInput for_="password" type_="password" placeholder="A secure password here" />
                <TextInput for_="password_confirmation" type_="password" placeholder="Confirm your password here" />
            </AuthForm>
            <AuthAlternative
                question="Have an account?"
                linkLabel="Log in"
                href="login"
            />
        </>
    )
}