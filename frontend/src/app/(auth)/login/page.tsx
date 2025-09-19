import { signup } from "@/actions/auth";
import AuthAlternative from "../components/AuthAlternative";
import { requireNoUser } from "@/server/guards";
import TextInput from "@/components/TextInput";
import AuthForm from "../components/AuthForm";

export default async function SignupPage() {
    await requireNoUser();

    return (
        <>
            <AuthForm
                action={signup}
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