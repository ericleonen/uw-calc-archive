"use client"

import TextInput from "@/components/TextInput";
import AuthForm from "../../components/AuthForm";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const supabase = createClient();
    const router = useRouter();

    const [ready, setReady] = useState(false);

    useEffect(() => {
        const code = searchParams.get("code");
        if (code) supabase.auth.exchangeCodeForSession(code).finally(() => setReady(true));
    }, [searchParams, supabase, setReady]);

    const updatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!ready) return;

        const formData = new FormData(e.currentTarget);
        const password = String(formData.get("password"));

        const { error } = await supabase.auth.updateUser({ password });

        if (error) throw error;
        else router.replace("/login?status=password_reset_success");
    };

    return (
        <AuthForm
            onSubmit={updatePassword}
            title="Password reset"
            submitLabel="Reset password"
        >
            <TextInput
                for_="password"
                placeholder="Enter your new password here"
            />
        </AuthForm>
    )
}