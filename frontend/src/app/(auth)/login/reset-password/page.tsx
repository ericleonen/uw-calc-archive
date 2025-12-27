"use client"

import TextInput from "@/components/TextInput";
import AuthForm from "../../components/AuthForm";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/actions/auth";
import { Suspense } from "react";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordContent />
        </Suspense>
    );
}
function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const tokenHash = searchParams.get("token_hash") || "";

    return (
        <AuthForm
            action={resetPassword}
            title="Password reset"
            submitLabel="Reset password"
        >
            <input type="hidden" name="token_hash" value={tokenHash} />
            <TextInput
                for_="password"
                placeholder="Enter your new password here"
            />
        </AuthForm>
    )
}