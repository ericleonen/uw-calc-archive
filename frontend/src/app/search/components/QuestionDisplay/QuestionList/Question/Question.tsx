"use client"

import Image from "next/image";
import { type User } from "@supabase/supabase-js";
import { useState } from "react";
import useQuestionCompletedToggler from "@/hooks/useQuestionCompletedToggler";

type QuestionProps = {
    question: Question,
    user: User | null,
    completed: boolean
}

export default function Question({ question, user, completed }: QuestionProps) {
    const completedToggler = useQuestionCompletedToggler(completed, user, question);

    const [showAnswer, setShowAnswer] = useState(false);
    const [answerLoading, setAnswerLoading] = useState(false);

    return (
        <div
            key={`${question.testId}/Q${question.number}`}
            className="flex flex-col w-full p-3 rounded-md shadow bg-white/90"
        >
            <p className="text-sm font-bold text-gray-600/90">Question {question.number} of {question.class} {question.exam}, {question.quarter}</p>
            <div className="flex flex-wrap">
                <button
                    onClick={completedToggler.onToggle}
                    disabled={!user}
                    className={
                        "px-2 py-1 my-1 mr-2 text-xs font-semibold rounded-full flex items-center " +
                        (!user ? "pointer-events-none text-gray-500/90" : "pointer-events-auto text-green-600/90") + " " +
                        (completedToggler.completed ? "hover:bg-green-200 bg-green-100" : "hover:bg-gray-200 bg-gray-100")
                    }
                    title={completedToggler.completed ? "Mark question as incomplete" : undefined}
                >
                    {/* { completedToggler.inProgress && <LoaderCircleIcon className="w-3 h-3 mr-1 animate-spin"/> } */}
                    { completedToggler.completed  ? "Completed" : "Mark Complete" }
                </button>
                {
                    question.topics.map(topic => (
                        <span
                            key={topic}
                            className="px-2 py-1 my-1 mr-2 text-xs font-semibold bg-purple-100 rounded-full text-uw/90"
                        >
                            {topic}
                        </span>
                    ))
                }
            </div>
            <Image
                src={question.questionImgSrc}
                alt="question"
                width={512}
                height={48}
                className="w-full h-auto p-2 mt-1 bg-white border-2 border-gray-300 rounded-sm"
            />
            <div className="flex justify-end mt-2 text-sm">
                <button
                    onClick={() => {
                        setShowAnswer(prevShowAnswer => !prevShowAnswer)
                        setAnswerLoading(true);
                    }}
                    className="px-2 py-1 text-sm font-semibold border-2 rounded-md bg-amber-100 text-amber-600/90 border-amber-300 hover:bg-amber-200"
                >
                    { showAnswer ? "Hide" : "Show" } answer
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
                        className="w-full h-auto p-2 bg-white"
                    />
                </div>
            }
        </div>
    )
}