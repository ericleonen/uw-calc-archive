"use server"

import { requireUser } from "@/server/guards";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const user = await requireUser();
    const supabase = await createClient();

    const profile = {
        name: String(formData.get("name")),
        class: String(formData.get("class"))
    };

    const { error } = await supabase
        .from("profiles")
        .update(profile)
        .eq("id", user.id)

    if (error) throw error;

    revalidatePath("/profile");
}