"use client"

import Image from "next/image";
import { useState } from "react";

type QuestionProps = {
    question: Question
}

export default function Question({ question }: QuestionProps) {
    const [showAnswer, setShowAnswer] = useState(false);
    const [answerLoading, setAnswerLoading] = useState(false);

    return (
        <div
            key={`${question.testId}/Q${question.number}`}
            className="flex flex-col w-full p-3 rounded-md shadow bg-white/90"
        >
            <p className="text-sm font-bold text-gray-600/90">Question {question.number} of {question.class} {question.exam}, {question.quarter}</p>
            <div className="flex flex-wrap">{
                question.topics.map(topic => (
                    <span
                        key={topic}
                        className="px-2 py-1 my-1 mr-2 text-xs font-semibold bg-purple-100 rounded-full text-uw/90"
                    >
                        {topic}
                    </span>
                ))
            }</div>
            <Image
                src={question.questionImgSrc}
                alt="question"
                width={512}
                height={48}
                className="w-full h-auto p-2 mt-1 bg-white border-2 border-gray-300 rounded-sm"
            />
            <div className="flex mt-2">
                <button
                    onClick={() => {
                        setShowAnswer(prevShowAnswer => !prevShowAnswer)
                        setAnswerLoading(true);
                    }}
                    className="px-2 py-1 ml-auto text-sm font-semibold border-2 rounded-md bg-amber-100 text-amber-600/90 border-amber-300 hover:bg-amber-200"
                >
                    { showAnswer ? "Hide" : "Show" } Answer
                </button>
            </div>
            {
                showAnswer &&
                <div className={
                    " rounded-md mt-2 overflow-hidden border-2 border-amber-300 " +
                    (answerLoading ? "animate-pulse bg-amber-200" : "animate-none bg-amber-600") 
                }>
                    <Image
                        src={question.answerImgSrc}
                        alt="answer"
                        width={512}
                        height={48}
                        onLoadingComplete={() => setAnswerLoading(false)}
                        className="w-full h-auto p-2 bg-white opacity-90"
                    />
                </div>
            }
        </div>
    )
}