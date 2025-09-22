"use client"

import Divider from "@/components/Divider";
import SubmitButton from "@/components/SubmitButton";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignupConfirmPage() {
    const email = useSearchParams().get("email") || "";
    const [resent, setResent] = useState(false);

    const onSubmit = () => {
        const supabase = createClient();
        supabase.auth.resend({ type: "signup", email });
        
        setResent(true);
    }

    return (
        <div className="flex flex-col items-center w-full max-w-sm p-6 rounded-md shadow bg-white/90 h-min">
            <h2 className="text-lg font-bold text-gray-600/90">Check your email</h2>
            <p className="mt-3 font-medium text-center text-gray-500/90">We sent an account confirmation link to <b>{email}</b>. Click it to finish creating your UW CalcArchive account.</p>
            <Divider text="troubleshooting" className="my-4" />
            <p className="text-sm font-medium text-center text-gray-400/90">{ resent ? "Resent it. Maybe it's in spam?" : "Didn't get it? Try again." }</p>
            <form
                action={onSubmit}
                className="w-full mt-2"
            >
                <SubmitButton label="Resend email" />
            </form>
            <p className="mt-3 text-sm font-medium text-center text-gray-400/90">If this email already has an account, you won't get an email. Log in instead.</p>
            <Link href="/login" className="w-full px-2 py-1 mt-2 font-semibold text-center border-2 border-gray-300 rounded-md text-gray-400/90 hover:bg-gray-200">Log in</Link>
        </div>
    )
}
