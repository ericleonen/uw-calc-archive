import Image from "next/image";
import { useState } from "react";

type QuestionProps = {
    question: Question
}

export default function Question({ question }: QuestionProps) {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <div
            key={`${question.test.id}/Q${question.number}`}
            className="flex flex-col w-full p-3 rounded-md shadow bg-white/90"
        >
            <p className="text-sm font-bold text-gray-700/90">Question {question.number} of {question.test.class} {question.test.type}, {question.test.quarter}</p>
            <div className="flex flex-wrap">{
                question.topics.map(topic => (
                    <span
                        key={topic}
                        className="py-1 px-2 text-xs bg-purple-100/90 text-uw/90 rounded-full font-semibold my-1 mr-2"
                    >
                        {topic}
                    </span>
                ))
            }</div>
            <Image
                src={question.questionImgSrc}
                alt="question"
                width={512}
                height={32}
                className="w-full h-auto p-2 bg-white border-2 rounded-sm border-gray-300/90 mt-1"
            />
            <div className="flex mt-2">
                <button
                    onClick={() => setShowAnswer(prevShowAnswer => !prevShowAnswer)}
                    className="px-2 py-1 text-sm border-2 font-semibold rounded-md ml-auto bg-orange-100/90 text-orange-600/90 border-orange-300/90 hover:bg-orange-200/90"
                >
                    { showAnswer ? "Hide" : "Show" } Answer
                </button>
            </div>
            {
                showAnswer &&
                <div className="border-orange-300/90 bg-orange-600 border-2 rounded-md mt-2 overflow-hidden">
                    <Image
                        src={question.answerImgSrc}
                        alt="answer"
                        width={512}
                        height={32}
                        className="w-full h-auto p-2 bg-white opacity-90"
                    />
                </div>
            }
        </div>
    )
}