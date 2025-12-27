import { confirmEmail } from "@/actions/auth";
import OneMoment from "@/app/(auth)/components/OneMoment";
import { Suspense } from "react";

export default function SignupConfirmationOneMomentPage() {
    return (
        <Suspense fallback={null}>
            <OneMoment
                action={confirmEmail}
                header="Welcome to HuskyCalcArchive"
                message="Hit continue to finish confirming your account and create your profile."
            />
        </Suspense>
    );
}