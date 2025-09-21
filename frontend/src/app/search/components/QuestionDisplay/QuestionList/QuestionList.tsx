import { getFilteredQuestions } from "@/server/questions";
import Question from "./Question"

type QuestionListProps = {
    questionFilter: QuestionFilter,
    page: number
}

export default async function QuestionList({ questionFilter, page }: QuestionListProps) {
    const questions = await getFilteredQuestions(questionFilter, page);

    return questions.map((question, i) => (
        <Question key={`question_${i}`} question={question} />
    ));
}