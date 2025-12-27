import { confirmEmail } from "@/actions/auth";
import OneMoment from "@/app/(auth)/components/OneMoment";

export default function ResetPasswordOneMomentPage() {
    return <OneMoment
        action={confirmEmail}
        message="Please wait as we finish confirming your email. Thanks for your patience!"
    />;
}