"use client"

import QuestionFilterForm from "./QuestionFilterForm/QuestionFilterForm";

type SideBarProps = {
    updateQuestions: () => Promise<void>
}

export default function SideBar({ updateQuestions }: SideBarProps) {
    return (
        <div className="lg:flex flex-col w-96 h-full p-6 bg-white/90 hidden">
            <QuestionFilterForm updateQuestions={updateQuestions} />
        </div>
    )
}