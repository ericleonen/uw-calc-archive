"use client";

import Button from "@/components/Button";
import Paragraph from "@/components/text/Paragraph";
import SectionHeader from "@/components/text/SectionHeader";
import { useSearchParams } from "next/navigation";

type OneMomentProps = {
    action: (formDataOrFormEvent: FormData) => Promise<void>,
    header: string,
    message: string,
    timeout?: number
};

export default function OneMoment({ action, header, message }: OneMomentProps) {
    const searchParams = useSearchParams();
    const tokenHash = searchParams.get("token_hash") || "";

    return (
        <div className="flex flex-col items-center w-full max-w-sm p-6 rounded-md shadow bg-white/90 h-min">
            <SectionHeader>{header}</SectionHeader>
            <Paragraph className="mt-3 text-center">{message}</Paragraph>
            <form action={action} className="mt-4">
                <input type="hidden" name="token_hash" value={tokenHash} />
                <Button>Continue</Button>
            </form>
        </div>
    );
}