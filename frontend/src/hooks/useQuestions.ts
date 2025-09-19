import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function useQuestions() {
    const searchParams = useSearchParams();
    const [questions, setQuestions] = useState<PagedData<Question[]> | null>(null);

    useEffect(() => {
        (async () => {
            const class_ = searchParams.has("class") ? searchParams.get("class") : null;
            const testType = searchParams.has("exam") ? searchParams.get("exam") : null;
            const topics = searchParams.has("topics") ? searchParams.get("topics")?.split(",") || [] : null;

            if (topics && topics.length === 1 && !topics[0]) {
                topics.pop();
            }

            console.log(class_, testType, topics)

            const page = parseInt(searchParams.get("page") || "1");

            if (!class_ && !testType && !topics) {
                setQuestions({
                    data: null,
                    loading: false,
                    totalItemsCount: 0,
                    totalPagesCount: 0,
                    page: 0
                });

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