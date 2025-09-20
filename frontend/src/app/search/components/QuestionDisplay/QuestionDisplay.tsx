"use client"

import QuestionDisplayLoader from "./QuestionDisplayLoader";
import QuestionList from "./QuestionList";
import { useQuestions } from "@/hooks/useQuestions";
import QuestionsPaginator from "./QuestionsPaginator";
import Empty from "./Empty";

export default function QuestionDisplay() {
    const questions = useQuestions();

    return (
        <div className="flex justify-center h-full p-3 overflow-y-scroll grow">
            {
                !questions ? null : (
                    <div className="flex flex-col items-center w-full max-w-2xl space-y-3 h-min">
                        {
                            questions.error ? null :
                            !questions.data ? (<>
                                { questions.loading ? <QuestionDisplayLoader withPaginator /> : <Empty noQuery /> }
                            </>) :
                            questions.data.length === 0 ? <Empty /> : (<>
                                <QuestionsPaginator
                                    page={questions.page}
                                    totalPagesCount={questions.totalPagesCount}
                                    pageQuestionsCount={questions.data.length}
                                    totalQuestionsCount={questions.totalItemsCount}
                                />
                                    {
                                        questions.loading ? (
                                            <QuestionDisplayLoader />
                                        ) : (
                                            <QuestionList questions={questions.data} />
                                        )
                                    }
                                {
                                    questions.page < questions.totalPagesCount &&
                                    <QuestionsPaginator
                                        page={questions.page}
                                        totalPagesCount={questions.totalPagesCount}
                                        pageQuestionsCount={questions.data.length}
                                        totalQuestionsCount={questions.totalItemsCount}
                                    />
                                }
                            </>)
                        }
                    </div>
                )
            }
        </div>
    )
}