import { getFilteredQuestions } from "@/server/questions";
import Question from "./Question/Question"
import Empty from "../Empty";
import { getCurrentUser } from "@/server/auth";
import { getQuestionCompleted } from "@/server/completed";

type QuestionListProps = {
    questionFilter: QuestionFilter,
    page: number
}

export default async function QuestionList({ questionFilter, page }: QuestionListProps) {
    const questions = await getFilteredQuestions(questionFilter, page);

    if (questions.length === 0) return <Empty />;

    const user = await getCurrentUser();

    return questions.map(async (question, i) => (
        <Question
            key={`question_${i}`}
            question={question}
            user={user}
            completed={await getQuestionCompleted(question.testId, question.number)}
        />
    ));
}