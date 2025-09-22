import { Suspense } from "react";
import Empty from "./Empty";
import QuestionList from "./QuestionList";
import QuestionsPaginator from "./QuestionsPaginator";
import QuestionsPaginatorSkeleton from "./QuestionsPaginator/QuestionsPaginatorSkeleton";
import QuestionListSkeleton from "./QuestionList/QuestionListSkeleton";

type QuestionDisplayProps = {
    questionFilter: QuestionFilter | null,
    page: number
}

export default function QuestionDisplay({ questionFilter, page }: QuestionDisplayProps) {
    if (!questionFilter) {
        return <Empty noQuery />;
    }

    const questionFilterStr = JSON.stringify(questionFilter);

    return (
        <div className="flex justify-center h-full p-3 overflow-y-scroll grow">
            <div className="flex flex-col items-center w-full max-w-2xl space-y-3 h-min">
                <Suspense
                    key={questionFilterStr}
                    fallback={<QuestionsPaginatorSkeleton />}
                >
                    <QuestionsPaginator questionFilter={questionFilter} page={page} />
                </Suspense>
                <Suspense
                    key={questionFilterStr + " page-" + page}
                    fallback={<QuestionListSkeleton />}
                >
                    <QuestionList questionFilter={questionFilter} page={page} />
                </Suspense>
            </div>
        </div>
    )
}