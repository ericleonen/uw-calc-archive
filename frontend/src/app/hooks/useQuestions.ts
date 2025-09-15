import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function useQuestions() {
    const searchParams = useSearchParams();
    const [questions, setQuestions] = useState<
        Data<Question[]> & 
        { page: number, totalPagesCount: number, totalQuestionsCount: number, }
    >({
        data: [],
        loading: false,
        error: null,
        page: 1,
        totalPagesCount: 1,
        totalQuestionsCount: 0
    });

    useEffect(() => {
        (async () => {
            const class_ = searchParams.get("class") || "";
            const testType = searchParams.get("exam") || "";
            const topics = searchParams.get("topics")?.split(",") || [];
            const page = parseInt(searchParams.get("page") || "1");

            if (!class_ || !testType || topics.length === 0) {
                return;
            }
            
            setQuestions({
                data: [],
                loading: true,
                error: null,
                page: 1,
                totalPagesCount: 1,
                totalQuestionsCount: 0
            });

            try {
                const res = await fetch("/api/questions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    cache: "no-store",
                    body: JSON.stringify({
                        questionFilter: {
                            class: class_,
                            testType,
                            topics
                        },
                        page,
                        pageSize: 5
                    })
                });

                if (!res.ok) {
                    throw new Error(`${res.status} ${res.statusText}`)
                }

                const json = await res.json(); 

                setQuestions({
                    data: json.data,
                    loading: false,
                    error: null,
                    page: json.page,
                    totalPagesCount: json.totalPagesCount,
                    totalQuestionsCount: json.totalQuestionsCount
                });
            } catch (e: any) {
                setQuestions({
                    data: [],
                    loading: false,
                    error: e,
                    page: 1,
                    totalPagesCount: 1,
                    totalQuestionsCount: 0
                });
            }
        })();
    }, [searchParams, setQuestions]);

    return questions;
}