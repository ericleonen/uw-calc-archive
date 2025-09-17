import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function useQuestions() {
    const searchParams = useSearchParams();
    const [questions, setQuestions] = useState<PagedData<Question[]> | null>(null);

    useEffect(() => {
        (async () => {
            const class_ = searchParams.get("class") || "";
            const testType = searchParams.get("exam") || "";
            const topics = searchParams.get("topics")?.split(",") || [];
            const page = parseInt(searchParams.get("page") || "1");

            if (!class_ && !testType && !topics.length) {
                setQuestions({
                    data: null,
                    loading: false,
                    totalItemsCount: 0,
                    totalPagesCount: 0,
                    page: 0
                });

                return;
            } else if (!class_ || !testType || topics.length === 0) {
                return;
            }

            setQuestions(prevQuestions => {
                if (prevQuestions) {
                    return {
                        ...prevQuestions,
                        loading: true,
                        error: undefined
                    };
                } else {
                    return {
                        data: null,
                        loading: true,
                        totalItemsCount: 0,
                        totalPagesCount: 0,
                        page: 0
                    };
                }
            })

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
                    page: json.page,
                    totalPagesCount: json.totalPagesCount,
                    totalItemsCount: json.totalItemsCount
                });
            } catch (e: any) {
                setQuestions(prevQuestions => {
                    if (prevQuestions) {
                        return {
                            ...prevQuestions,
                            loading: false,
                            error: e,
                        };
                    } else {
                        return prevQuestions;
                    }
                })
            }
        })();
    }, [searchParams, setQuestions]);

    return questions;
}