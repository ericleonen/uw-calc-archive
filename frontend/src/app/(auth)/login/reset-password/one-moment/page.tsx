import { loginToResetPassword } from "@/actions/auth";
import OneMoment from "@/app/(auth)/components/OneMoment";

export default function ResetPasswordOneMomentPage() {
    return <OneMoment
        action={loginToResetPassword}
        message="Please wait as we process your password reset. Thanks for your patience!"
    />;
}