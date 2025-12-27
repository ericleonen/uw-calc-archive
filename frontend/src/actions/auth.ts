"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { requireUser } from "@/server/guards";
import { createAdminClient } from "@/utils/supabase/admin";
import { cookies } from "next/headers";

/**
 * Logs a user in with email and password. If successful, redirects to /search, otherwise, to
 * /error.
 */
export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: String(formData.get("email")),
        password: String(formData.get("password"))
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect(`/login?error=${error.code || "unknown"}`);
    } else {
        revalidatePath("/", "layout");
        redirect("/search");
    }
}

export async function sendResetPasswordEmail(formData: FormData) {
    const email = String(formData.get("email") || "");
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login/reset-password`,
    });

    if (error) {
        redirect(`/login/forgot-password?error=${error.code || "unknown"}`)
    }
}

export async function loginToResetPassword(formData: FormData) {
    const supabase = await createClient();
    const token_hash = String(formData.get("token_hash") || "");

    const { error } = await supabase.auth.verifyOtp({
        type: "recovery",
        token_hash,
    });

    if (error) {
        redirect(`/login/forgot-password?error=${error.code || "unknown"}`);
    }

    (await cookies()).set({
        name: "recovery_lock",
        value: "1",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10
    })

    redirect("/login/reset-password");
}

export async function resetPassword(formData: FormData) {
    const newPassword = String(formData.get("password"));
    const newPasswordConfirmation = String(formData.get("password_confirmation"));

    if (newPassword !== newPasswordConfirmation) {
        redirect("/login/reset-password?error=password_mismatch")
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        redirect(`/login/reset-password?error=${error.code || "unknown"}`);
    } else {
        (await cookies()).delete("recovery_lock");

        supabase.auth.signOut();
        redirect("/login?status=password_reset_success");
    }
}

/**
 * Creates a user account with email, password, and name. Waits for a confirmation.
 */
export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: String(formData.get("email")),
        password: String(formData.get("password")),
        options: {
            data: { name: String(formData.get("name")) }
        }
    };

    const passwordConfirmation = String(formData.get("password_confirmation"));

    if (data.password !== passwordConfirmation) {
        redirect(`/signup?error=password_mismatch`)
    }

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        redirect(`/signup?error=${error.code || "unknown"}`);
    } else {
        revalidatePath("/", "layout");
        redirect(`/signup/confirm?email=${encodeURIComponent(data.email)}`);
    }
}

export async function confirmEmail(formData: FormData) {
    const token_hash = String(formData.get("token_hash") || "");

    if (!token_hash) {
        redirect("/auth/error");
    }
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
        type: "email",
        token_hash,
    });

    if (error) {
        redirect("/auth/error");
    }

    redirect("/profile");
}

/**
 * Signs a user out and redirects to /search.
 */
export async function signout() {
    await requireUser();

    const supabase = await createClient();
    await supabase.auth.signOut();

    revalidatePath("/", "layout");
    redirect("/search");
}

/**
 * Deletes a user's account and signs them out, then redirects to /search.
 */
export async function deleteAccount() {
    const user = await requireUser();

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);

    if (error) throw error;

    await signout();
}