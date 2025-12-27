"use client"

import { confirmEmail } from "@/actions/auth";
import OneMoment from "@/app/(auth)/components/OneMoment";
import { Suspense } from "react";

export default function ResetPasswordOneMomentPage() {
    return (
        <Suspense fallback={null}>
            <OneMoment
                action={confirmEmail}
                message="Please wait as we finish confirming your email. Thanks for your patience!"
            />
        </Suspense>
    );
}