import TextInput from "@/components/TextInput";
import AuthForm from "../../components/AuthForm";
import { sendResetPasswordEmail } from "@/actions/auth";

export default async function ForgotPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ email?: string, error?: string }>
}) {
    const { email } = await searchParams;

    return (
        <AuthForm
            action={sendResetPasswordEmail}
            title="Password reset"
            submitLabel="Send password reset email"
            status={
                email ? `Successfully sent. Please check your email at ${email} for a password reset email.` :
                undefined
            }
        >
            <TextInput
                for_="email"
                placeholder="Enter your email here"
            />
        </AuthForm>
    )
}