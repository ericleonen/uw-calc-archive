import { login } from "@/actions/auth";
import AuthAlternative from "../components/AuthAlternative";
import TextInput from "@/components/TextInput";
import AuthForm from "../components/AuthForm";

export default async function LoginPage() {
    return (
        <>
            <AuthForm
                action={login}
                title="Login"
                submitLabel="Log in"
            >
                <TextInput for_="email" placeholder="Your email here" />
                <TextInput for_="password" placeholder="Your password here" />
            </AuthForm>
            <AuthAlternative
                question="No account?"
                linkLabel="Sign up"
                href="signup"
            />
        </>
    )
}