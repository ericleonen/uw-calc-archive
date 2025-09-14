import Image from "next/image";

type QuestionListProps = {
    questions: Question[]
}

export default function QuestionList({ questions }: QuestionListProps) {
    return (
        <div className="grow flex flex-col h-full py-8 px-16 overflow-y-scroll space-y-3">
            {questions.map(question => (
                <div className="bg-white/90 w-full rounded-md flex flex-col p-3">
                    <p className="font-bold text-gray-700/90">Question {question.number} of {question.test.class} {question.test.type}, {question.test.quarter}</p>
                    <Image
                        src={question.questionImgSrc}
                        alt="question"
                        width={512}
                        height={32}
                        className="h-auto w-full border-gray-300/90 border-2 rounded-sm mt-3 bg-white p-3"
                    />
                </div>
            ))}
        </div>
    )
}