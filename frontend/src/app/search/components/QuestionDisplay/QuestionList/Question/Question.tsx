"use client"

import Image from "next/image";
import { type User } from "@supabase/supabase-js";
import { useState } from "react";
import useQuestionCompletedToggler from "@/hooks/useQuestionCompletedToggler";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Button from "@/components/Button";
import Paragraph from "@/components/text/Paragraph";

type QuestionProps = {
    question: Question,
    user: User | null,
    completed: boolean
}

export default function Question({ question, user, completed }: QuestionProps) {
    const completedToggler = useQuestionCompletedToggler(completed, user, question);

    const [showAnswer, setShowAnswer] = useState(false);
    const [answerLoading, setAnswerLoading] = useState(false);

    const completedToggleComponent = (
        <button
            onClick={completedToggler.onToggle}
            className={
                "px-2 py-1 my-1 mr-2 text-xs font-semibold rounded-full flex items-center " +
                (!user ? "text-gray-500/90" : "text-green-600/90") + " " +
                (completedToggler.completed ? "hover:bg-green-200 bg-green-100" : "hover:bg-gray-200 bg-gray-100")
            }
        >
            {/* { completedToggler.inProgress && <LoaderCircleIcon className="w-3 h-3 mr-1 animate-spin"/> } */}
            { completedToggler.completed  ? "Completed" : "Mark Complete" }
        </button>
    );

    return (
        <div
            key={`${question.testId}/Q${question.number}`}
            className="flex flex-col w-full p-3 rounded-md shadow bg-white/90"
        >
            <p className="text-sm font-bold text-gray-600/90">Question {question.number} of {question.class} {question.exam}, {question.quarter}</p>
            <div className="flex flex-wrap">
                {
                    user ? completedToggleComponent : (
                        <Popover >
                            <PopoverTrigger asChild>
                                {completedToggleComponent}
                            </PopoverTrigger>
                            <PopoverContent className="flex flex-col items-center p-3 mt-1 text-xs font-semibold bg-white border-2 border-gray-300 rounded-md shadow">
                                <Paragraph>You need an account to mark questions complete</Paragraph>
                                <Button href="/signup" className="mt-1">Create an account</Button>
                                <Button href="/login" theme="secondary" className="mt-1">Log in</Button>
                            </PopoverContent>
                        </Popover>
                    )
                    
                }
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
                <Button
                    theme="custom"
                    onClick={() => {
                        setShowAnswer(prevShowAnswer => !prevShowAnswer)
                        setAnswerLoading(true);
                    }}
                    className="border-2 bg-amber-100 text-amber-600/90 border-amber-300 hover:bg-amber-200 w-min whitespace-nowrap"
                >
                    { showAnswer ? "Hide" : "Show" } answer
                </Button>
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