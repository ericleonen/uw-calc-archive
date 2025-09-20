"use client"

import QuestionFilterForm from "./QuestionFilterForm";

export default function SideBar() {
    return (
        <aside className="lg:flex flex-col w-96 h-full p-6 bg-white/90 hidden">
            <QuestionFilterForm />
        </aside>
    )
}