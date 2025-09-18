import { login } from "@/app/profile/actions";
import AuthForm from "../components/AuthForm/AuthForm";
import AuthAlternative from "../components/AuthAlternative";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
    const supabase = createClient();

    // async function signInWithGoogle () {
    //     await supabase.auth.signInWithOAuth({
    //         provider: "google",
    //         options: { redirectTo: `${location.origin}/api/auth/callback` }
    //     });
    // };

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