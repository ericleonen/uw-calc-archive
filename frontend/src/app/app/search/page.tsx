"use client"

import { useFilteredQuestions } from "@/app/hooks/useFilteredQuestions";
import SideBar from "./components/SideBar";
import QuestionList from "./components/QuestionList";

export default function Search() {
    const { questions, updateQuestions } = useFilteredQuestions();

    return (
        <>
            <SideBar updateQuestions={updateQuestions} />
            <QuestionList questions={questions} />
        </>
    )
}