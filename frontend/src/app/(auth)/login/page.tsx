import { login } from "@/actions/auth";
import AuthAlternative from "../components/AuthAlternative";
import TextInput from "@/components/TextInput";
import AuthForm from "../components/AuthForm";
import Hyperlink from "@/components/text/Hyperlink";
import { requireNoUser } from "@/server/guards";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string, status?: string }>
}) {
    requireNoUser();
    const sp = await searchParams;

    return (
        <>
            <AuthForm
                action={login}
                title="Login"
                submitLabel="Log in"
                error={
                    !sp.error ? undefined :
                    sp.error === "invalid_credentials" ? "Invalid email or password. Please try again." :
                    "An unknown error occured. Please try again."
                }
                status={
                    sp.status === "password_reset_success" ? "Successfully reset your password. You can now log in with that password." :
                    undefined
                }
            >
                <TextInput for_="email" placeholder="Your email here" />
                <div className="flex flex-col items-end w-full">
                    <TextInput for_="password" type_="password" placeholder="Your password here" />
                    <Hyperlink href="/login/forgot-password" className="mt-1 text-xs font-medium">Forgot password?</Hyperlink>
                </div>
                
            </AuthForm>
            <AuthAlternative
                question="No account?"
                linkLabel="Sign up"
                href="signup"
            />
        </>
    )
}