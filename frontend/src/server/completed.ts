import "server-only"
import { getCurrentUser } from "./auth"
import { createClient } from "@/utils/supabase/server";

export async function getQuestionCompleted(testId: string, questionNumber: number) {
    const user = await getCurrentUser();

    if (!user) return false;

    const supabase = await createClient();

    const { data } = await supabase
        .from("completed")
        .select("completed_at")
        .eq("profile_id", user.id)
        .eq("test_id", testId)
        .eq("question_number", questionNumber)
        .single()

    return data !== null;
}

export async function updateQuestionCompleted(testId: string, questionNumber: number, completed: boolean) {
    const user = await getCurrentUser();

    if (!user) return;

    const supabase = await createClient();

    if (completed) {
        const { error } = await supabase
            .from("completed")
            .upsert({
                profile_id: user.id,
                test_id: testId,
                question_number: questionNumber
            })

        if (error) throw error;
    } else {
        const { error } = await supabase
            .from("completed")
            .delete()
            .eq("profile_id", user.id)
            .eq("test_id", testId)
            .eq("question_number", questionNumber)

        if (error) throw error;
    }
}