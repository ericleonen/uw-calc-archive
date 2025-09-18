import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(req: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request: req
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
        cookies: {
            getAll() {
                return req.cookies.getAll()
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) =>
                    req.cookies.set(name, value)
                );
                supabaseResponse = NextResponse.next({
                    request: req
                });
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                );
            }
        }
        }
    );

    await supabase.auth.getUser();

    return supabaseResponse;
}