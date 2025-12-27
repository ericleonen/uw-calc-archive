"use client"

import { loginToResetPassword } from "@/actions/auth";
import OneMoment from "@/app/(auth)/components/OneMoment";
import { Suspense } from "react";

export default function ResetPasswordOneMomentPage() {
    return (
        <Suspense fallback={null}>
            <OneMoment
                action={loginToResetPassword}
                message="Please wait as we process your password reset. Thanks for your patience!"
            />
        </Suspense>
    );
}