import { loginToResetPassword } from "@/actions/auth";
import OneMoment from "@/app/(auth)/components/OneMoment";
import { Suspense } from "react";

export default function ResetPasswordOneMomentPage() {
    return (
        <Suspense fallback={null}>
            <OneMoment
                action={loginToResetPassword}
                header="Account Confirmed"
                message="Hit continue to finish resetting your password."
            />
        </Suspense>
    );
}