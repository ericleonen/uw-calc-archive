"use client"

import { useFilteredQuestions } from "@/app/hooks/useFilteredQuestions";
import SideBar from "./components/SideBar";
import QuestionList from "./components/QuestionList";
import MobileQuestionFilters from "./components/MobileQuestionFilters";

export default function Search() {
    const { questions, updateQuestions } = useFilteredQuestions();

    return (
        <>
            <SideBar updateQuestions={updateQuestions} />
            <QuestionList questions={questions} />
            <MobileQuestionFilters updateQuestions={updateQuestions} />
        </>
    )
}