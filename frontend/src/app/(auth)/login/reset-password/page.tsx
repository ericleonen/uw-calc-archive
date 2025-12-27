import TextInput from "@/components/TextInput";
import AuthForm from "../../components/AuthForm";
import { resetPassword } from "@/actions/auth";

export default function ResetPasswordPage() {
    return (
        <AuthForm
            action={resetPassword}
            title="Password reset"
            submitLabel="Reset password"
        >
            <TextInput
                for_="password"
                type_="password"
                placeholder="Enter your new password here"
            />
            <TextInput
                for_="password_confirmation"
                type_="password"
                placeholder="Confirm your new password here"
            />
        </AuthForm>
    )
}