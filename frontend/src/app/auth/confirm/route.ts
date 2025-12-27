import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const token_hash = formData.get("token_hash")?.toString() ?? null;
  const next = "/profile";

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

  redirect(next);
}