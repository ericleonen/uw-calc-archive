import Question from "./Question"

type QuestionListProps = {
    questions: Question[]
}

export default function QuestionList({ questions }: QuestionListProps) {
    return questions.map((question, i) => (
        <Question key={`question_${i}`} question={question} />
    ));
}