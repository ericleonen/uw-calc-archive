"use client"

import { useFilteredQuestions } from "@/app/hooks/useFilteredQuestions";
import SideBar from "./components/SideBar";
import Image from "next/image";

export default function Search() {
    const { questions, updateQuestions } = useFilteredQuestions();

    return (
        <>
            <SideBar updateQuestions={updateQuestions} />
            <div className="grow flex flex-col h-full py-8 px-16 overflow-y-scroll space-y-3">
                {questions.map(question => (
                    <div className="bg-white/90 w-full rounded-md flex flex-col p-3">
                        <p className="font-bold">Question {question.number} of {question.test.class} {question.test.type}, {question.test.quarter}</p>
                        <Image
                            src={question.questionImgSrc}
                            alt="question"
                            width={800}
                            height={600}
                            className="h-auto w-full border-gray-300/90 border-2 rounded-sm mt-3"
                        />
                    </div>
                ))}
            </div>
        </>
    )
}