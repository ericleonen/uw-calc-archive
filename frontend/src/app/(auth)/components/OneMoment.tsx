"use client";

import Paragraph from "@/components/text/Paragraph";
import SectionHeader from "@/components/text/SectionHeader";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

type OneMomentProps = {
    action: (formDataOrFormEvent: FormData) => Promise<void>,
    message: string,
    timeout?: number
};

export default function OneMoment({ action, message, timeout = 300 }: OneMomentProps) {
    const searchParams = useSearchParams();

    const formRef = useRef<HTMLFormElement | null>(null);
    const tokenHash = searchParams.get("token_hash") || "";

    useEffect(() => {
        if (!tokenHash) return;

        const t = setTimeout(() => {
            formRef.current?.requestSubmit();
        }, 300);

        return () => clearTimeout(t);
    }, [tokenHash]);

    return (
        <div className="flex flex-col items-center w-full max-w-sm p-6 rounded-md shadow bg-white/90 h-min">
            <SectionHeader>One moment please...</SectionHeader>
            <Paragraph className="mt-3 text-center">{message}</Paragraph>
            <form action={action} className="hidden" ref={formRef}>
                <input type="hidden" name="token_hash" value={tokenHash} />
            </form>
        </div>
    );
}