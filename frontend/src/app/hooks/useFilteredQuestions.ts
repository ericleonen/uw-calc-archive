import { useCallback, useState } from "react";

export function useFilteredQuestions() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFilteredQuestions = useCallback(async (class_: string, testType: string, topics: string[]) => {
        if (!class_ || !testType || topics.length === 0) {
            return;
        }
        
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
                body: JSON.stringify({
                    class: class_,
                    testType,
                    topics
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
        questions,
        updateQuestions: fetchFilteredQuestions
    };
}