import { login } from "@/actions/auth";
import AuthForm from "../components/AuthForm/AuthForm";
import AuthAlternative from "../components/AuthAlternative";
import { requireNoUser } from "@/server/guards";

export default async function LoginPage() {
    await requireNoUser();

    return (
        <div className="w-full flex flex-col items-center py-16">
            <AuthForm
                title="Login"
                formAction={login}
                submitLabel="Log in"
            />
            <AuthAlternative
                question="No account?"
                linkLabel="Sign up"
                href="signup"
            />
        </div>
    )
}