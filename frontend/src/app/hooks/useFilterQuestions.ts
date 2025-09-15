import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import questionFilterAtom from "../atoms/questionFilter";
import questionsAtom from "../atoms/questions";

export function useFilterQuestions() {
    const questionFilter = useAtomValue(questionFilterAtom);
    const setQuestions = useSetAtom(questionsAtom);

    const fetchFilteredQuestions = useCallback(async () => {
        if (!questionFilter.class || !questionFilter.testType || questionFilter.topics.length === 0) {
            return;
        }
        
        setQuestions({
            data: [],
            loading: true,
            error: null
        });

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

            setQuestions({
                data: await res.json(),
                loading: false,
                error: null
            });
        } catch (e: any) {
            setQuestions({
                data: [],
                loading: false,
                error: e
            });
        }
    }, [questionFilter, setQuestions]);

    return fetchFilteredQuestions;
}