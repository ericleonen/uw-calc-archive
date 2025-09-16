import QuestionDisplayLoader from "./QuestionDisplayLoader";
import QuestionList from "./QuestionList";
import { useQuestions } from "@/app/hooks/useQuestions";
import QuestionsPaginator from "./QuestionsPaginator";
import NoQuestionsFound from "./NoQuestionsFound";

export default function QuestionDisplay() {
    const questions = useQuestions();

    return (
        <div className="h-full overflow-y-scroll grow flex justify-center p-6">
            {
                !questions ? null : (
                    <div className="w-full max-w-2xl flex flex-col items-center h-min">
                        {
                            questions.error ? null :
                            !questions.loading && questions.data.length === 0 ? (
                                <NoQuestionsFound />
                            ) : (<>
                                <QuestionsPaginator page={questions.page} totalPagesCount={questions.totalPagesCount} />
                                    {
                                        questions.loading ? (
                                            <QuestionDisplayLoader />
                                        ) : (
                                            <QuestionList questions={questions.data} />
                                        )
                                    }
                                <QuestionsPaginator page={questions.page} totalPagesCount={questions.totalPagesCount} />
                            </>)
                        }
                    </div>
                )
            }
        </div>
    )
}