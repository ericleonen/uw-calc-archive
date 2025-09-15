import questionsAtom from "@/app/atoms/questions";
import { useAtomValue } from "jotai";
import QuestionDisplayLoader from "./QuestionDisplayLoader";
import QuestionList from "./QuestionList";

export default function QuestionDisplay() {
    const questions = useAtomValue(questionsAtom);

    return (
        <div className="flex justify-center h-full p-6 overflow-y-scroll grow">
            {
                questions.error ? null :
                questions.loading ? (
                    <QuestionDisplayLoader />
                ) : (
                    <QuestionList questions={questions.data} />
                )
            }
        </div>
    )
}