import { signup } from "@/actions/auth";
import AuthAlternative from "../components/AuthAlternative";
import TextInput from "@/components/TextInput";
import AuthForm from "../components/AuthForm";

export default async function SignupPage() {
    return (
        <>
            <AuthForm
                action={signup}
                title="Create an account"
                submitLabel="Sign up"
            >
                <TextInput for_="name" placeholder="Your name here" />
                <TextInput for_="email" placeholder="Your email here" />
                <TextInput for_="password" placeholder="A secure password here" />
            </AuthForm>
            <AuthAlternative
                question="Have an account?"
                linkLabel="Log in"
                href="login"
            />
        </>
    )
}