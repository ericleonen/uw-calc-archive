import { createClient } from "@/utils/supabase/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token_hash = searchParams.get("token_hash");
    const type_ = searchParams.get("type") as EmailOtpType | null;
    const next = "/account";

    const redirectTo = req.nextUrl.clone();
    redirectTo.pathname = next;
    redirectTo.searchParams.delete("token_hash");
    redirectTo.searchParams.delete("type");

    if (token_hash && type_) {
        const supabase = await createClient();

        const { error } = await supabase.auth.verifyOtp({
            type: type_,
            token_hash
        });

        if (!error) {
            redirectTo.searchParams.delete("next");
            return NextResponse.redirect(redirectTo);
        }
    }

    redirectTo.pathname = "/error";
    return NextResponse.redirect(redirectTo);
}