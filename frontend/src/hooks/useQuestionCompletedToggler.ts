import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import { useState } from "react";

export default function useQuestionCompletedToggler(
    initiallyCompleted: boolean,
    user: User | null,
    question: Question,
) {
    const [completed, setCompleted] = useState(initiallyCompleted);
    const [inProgress, setInProgress] = useState(false);

    const onToggle = () => {
        if (!user) return;

        const supabase = createClient();

        setInProgress(true);

        if (!completed) {
            supabase.from("completed").upsert({
                profile_id: user.id,
                test_id: question.testId,
                question_number: question.number
            }).then(() => {
                setCompleted(true);
                setInProgress(false);
            })
        } else {
            supabase.from("completed").delete()
                .eq("profile_id", user.id)
                .eq("test_id", question.testId)
                .eq("question_number", question.number)
                .then(() => {
                    setCompleted(false);
                    setInProgress(false);
                })
        }
    };

    return {
        completed,
        inProgress,
        onToggle
    };
}