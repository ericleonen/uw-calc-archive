"use client"

import SideBar from "./components/SideBar";
import QuestionDisplay from "./components/QuestionDisplay";
import MobileQuestionFilters from "./components/MobileQuestionFilters";

export default function Search() {
    return (
        <>
            <SideBar />
            <QuestionDisplay />
            <MobileQuestionFilters />
        </>
    )
}