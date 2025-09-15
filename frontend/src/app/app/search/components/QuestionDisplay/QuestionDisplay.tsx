import QuestionDisplayLoader from "./QuestionDisplayLoader";
import QuestionList from "./QuestionList";
import { useQuestions } from "@/app/hooks/useQuestions";

export default function QuestionDisplay() {
    const questions = useQuestions();

    return (
        <div className="flex justify-center h-full p-6 overflow-y-scroll grow">
            {
                questions.error ? null :
                questions.loading ? (
                    <QuestionDisplayLoader />
                ) : (
                    <QuestionList 
                        questions={questions.data}
                        page={questions.page}
                        totalPagesCount={questions.totalPagesCount}
                    />
                )
            }
        </div>
    )
}