import { signup } from "@/actions/auth";
import AuthForm from "../components/AuthForm/AuthForm";
import AuthAlternative from "../components/AuthAlternative";
import { requireNoUser } from "@/server/guards";

export default async function SignupPage() {
    await requireNoUser();

    return (
        <div className="w-full flex flex-col items-center py-16">
            <AuthForm
                title="Signup"
                formAction={signup}
                submitLabel="Create an account"
            />
            <AuthAlternative
                question="Have an account?"
                linkLabel="Log in"
                href="login"
            />
        </div>
    )
}