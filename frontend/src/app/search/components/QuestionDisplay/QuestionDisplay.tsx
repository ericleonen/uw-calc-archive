import QuestionList from "./QuestionList";
import QuestionsPaginator from "./QuestionsPaginator";
import { getFilteredQuestions } from "@/server/questions";

type QuestionDisplayProps = {
    questionFilter: QuestionFilter | null,
    page: number
}

export default async function QuestionDisplay({ questionFilter, page }: QuestionDisplayProps) {
    const questions = questionFilter && await getFilteredQuestions(questionFilter, page);

    return (
        <div className="flex justify-center h-full p-3 overflow-y-scroll grow">

            {
                !questions ? null : (
                    <div className="flex flex-col items-center w-full max-w-2xl space-y-3 h-min">
                        <QuestionsPaginator
                            page={questions.page}
                            totalPagesCount={questions.totalPagesCount}
                            pageQuestionsCount={questions.data.length}
                            totalQuestionsCount={questions.totalItemsCount}
                        />
                        <QuestionList questions={questions.data} />
                    </div>
                )
            }
        </div>
    )
}