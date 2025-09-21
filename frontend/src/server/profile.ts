import { cache } from "react";
import { requireUser } from "./guards";
import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "./auth";

export const getProfile = cache(async () => {
    const user = await getCurrentUser();

    if (!user) {
        return null;
    }

    const supabase = await createClient();
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("name, class")
        .eq("id", user.id)
        .single()

    if (error) throw error;

    return profile;
});