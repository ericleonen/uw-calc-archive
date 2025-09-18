import QuestionDisplayLoader from "./QuestionDisplayLoader";
import QuestionList from "./QuestionList";
import { useQuestions } from "@/app/hooks/useQuestions";
import QuestionsPaginator from "./QuestionsPaginator";
import Empty from "./Empty";

export default function QuestionDisplay() {
    const questions = useQuestions();

    return (
        <div className="h-full overflow-y-scroll grow flex justify-center p-3">
            {
                !questions ? null : (
                    <div className="w-full max-w-2xl flex flex-col items-center h-min space-y-3">
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