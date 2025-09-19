"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { requireUser } from "@/server/guards";
import { createAdminClient } from "@/utils/supabase/admin";

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

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: String(formData.get("email")),
        password: String(formData.get("password"))
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        redirect("/error");
    }

    revalidatePath("/", "layout");
}

export async function signout() {
    await requireUser();

    const supabase = await createClient();
    await supabase.auth.signOut();

    revalidatePath("/", "layout");
    redirect("/search");
}

export async function deleteAccount() {
    const user = await requireUser();

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);

    if (error) throw error;

    await signout();
}