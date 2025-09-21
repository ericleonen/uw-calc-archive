"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { requireUser } from "@/server/guards";
import { createAdminClient } from "@/utils/supabase/admin";

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
        redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/search");
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
            data: { name: String(formData.get("name")) },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/signup/confirm`
        }
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) redirect("/error");

    revalidatePath("/", "layout");
    redirect(`/signup/confirm?email=${encodeURIComponent(data.email)}`);
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