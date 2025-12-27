import TextInput from "@/components/TextInput";
import AuthForm from "../../components/AuthForm";
import { resetPassword } from "@/actions/auth";

export default async function ResetPasswordPage({
    searchParams
} : {
    searchParams: Promise<{ error?: string }>
}) {
    const { error } = await searchParams;

    return (
        <AuthForm
            action={resetPassword}
            title="Password reset"
            submitLabel="Reset password"
            error={
                !error ? undefined :
                error === "password_mismatch" ? "Your password and password confirmation don't match. Please ensure they match." :
                "An unknown error occurred. Please try again."
            }
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