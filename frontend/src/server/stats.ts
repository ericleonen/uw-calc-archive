import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

type TestTopicCoverageStatsDB = {
    topic: string,
    tests_with_topic_count: number,
    questions_with_topic_count: number
}

export const getStats = cache(async (class_: string, exam: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("topic_coverage", {
        class_: class_,
        exam_: exam
    });

    if (error) throw error;

    return {
        totalTestsCount: data?.[0]?.total_tests_count ?? 0,
        totalQuestionsCount: data?.[0]?.total_questions_count ?? 0,
        topics: (data ?? []).map((d: TestTopicCoverageStatsDB) => ({
            topic: d.topic,
            testsWithTopicCount: d.tests_with_topic_count,
            questionsWithTopicCount: d.questions_with_topic_count
        }))
    };
});