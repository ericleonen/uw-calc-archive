"use client"

import Divider from "@/components/Divider";
import Emphasis from "@/components/text/Emphasis";
import Paragraph from "@/components/text/Paragraph";
import SectionHeader from "@/components/text/SectionHeader";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";

export default function SignupConfirmPage() {
    const searchParams = useSearchParams();

    const email = searchParams.get("email") || "";
    const tokenHash = searchParams.get("token_hash") || "";
    const [resent, setResent] = useState(false);

    const onSubmit = () => {
        const supabase = createClient();
        supabase.auth.resend({ type: "signup", email });
        
        setResent(true);
    }

    const formRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        if (!tokenHash) return;

        const t = setTimeout(() => {
            formRef.current?.requestSubmit();
        }, 500);

        return () => clearTimeout(t);
    }, [tokenHash]);

    if (!tokenHash) {
        return (
            <div className="flex flex-col items-center w-full max-w-sm p-6 rounded-md shadow bg-white/90 h-min">
                <SectionHeader>Check your email</SectionHeader>
                <Paragraph className="mt-3 text-center">
                    We sent an account confirmation link to <Emphasis variant="secondary">{email}</Emphasis>. Click it to finish creating your UW CalcArchive account.
                </Paragraph>
                <Divider text="troubleshooting" className="my-6" />
                <Paragraph className="text-sm text-center">{ resent ? "Resent it. Maybe it's in spam?" : "Didn't get it? Try again." }</Paragraph>
                <form
                    action={onSubmit}
                    className="w-full mt-2"
                >
                    <Button>Resend email</Button>
                </form>
                <Paragraph className="mt-6 text-sm text-center">If this email already has an account, you won&#39;t get an email. Log in instead.</Paragraph>
                <Link href="/login" className="w-full px-2 py-1 mt-2 font-semibold text-center border-2 border-gray-300 rounded-md text-gray-400/90 hover:bg-gray-200">Log in</Link>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col items-center w-full max-w-sm p-6 rounded-md shadow bg-white/90 h-min">
                <SectionHeader>Confirming your account...</SectionHeader>
                <Paragraph className="mt-3 text-center">
                    Please wait as we finish confirming your account. Thanks for your patience!
                </Paragraph>
                <form method="post" action="/auth/confirm" className="hidden" ref={formRef}>
                    <input type="hidden" name="token_hash" value={tokenHash} />
                </form>
            </div>
        )
    }
}
