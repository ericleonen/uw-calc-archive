import Question from "./Question"

type QuestionListProps = {
    questions: Question[]
}

export default function QuestionList({ questions }: QuestionListProps) {
    return (
        <>
            {
                questions.map(question => (
                    <Question question={question} />
                ))
            }
        </>
    )
}