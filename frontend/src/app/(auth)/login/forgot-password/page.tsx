import TextInput from "@/components/TextInput";
import AuthForm from "../../components/AuthForm";
import { sendResetPasswordEmail } from "@/actions/auth";

export default function ForgotPasswordPage() {
    return (
        <AuthForm
            action={sendResetPasswordEmail}
            title="Password reset"
            submitLabel="Send password reset email"
        >
            <TextInput
                for_="email"
                placeholder="Enter your email here"
            />
        </AuthForm>
    )
}