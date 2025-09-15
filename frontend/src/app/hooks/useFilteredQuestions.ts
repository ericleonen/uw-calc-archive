import { useAtomValue } from "jotai";
import { useCallback, useState } from "react";
import questionFilterAtom from "../atoms/questionFilter";

export function useFilteredQuestions() {
    const questionFilter = useAtomValue(questionFilterAtom);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFilteredQuestions = useCallback(async () => {
        
        if (!questionFilter.class || !questionFilter.testType || questionFilter.topics.length === 0) {
            return;
        }
        
        setQuestions([]);
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
                body: JSON.stringify({
                    class: questionFilter.class,
                    testType: questionFilter.testType,
                    topics: questionFilter.topics
                })
            });

            if (!res.ok) {
                throw new Error(`${res.status} ${res.statusText}`)
            }

            setQuestions(await res.json());
        } catch (e: any) {
            setError(e.message || "Failed to fetch filtered question keys.");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        questions,
        updateQuestions: fetchFilteredQuestions
    };
}