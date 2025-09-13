"use client"

import { useState } from "react";
import SearchSelect from "./SearchSelect";
import SearchMultiSelect from "./SearchMultiSelect";
import { TOPICS } from "../constants";

type SideBarProps = {
    updateQuestions: (class_: string, exam: string, topics: string[]) => Promise<void>
}

export default function SideBar({ updateQuestions }: SideBarProps) {
    const [class_, setClass] = useState("");
    const [exam, setExam] = useState("");
    const [topics, setTopics] = useState<string[]>([]);

    return (
        <div className="flex flex-col w-96 h-full p-6 bg-white/90">
            <p className="font-bold text-gray-700/90">Questions Filter</p>
            <div className="mt-6 space-y-3">
                <SearchSelect 
                    label="Class"
                    placeholder="Select your class"
                    options={["MATH 124", "MATH 125", "MATH 126"]}
                    value={class_}
                    setValue={setClass}
                />
                <SearchSelect 
                    label="Exam"
                    placeholder="Select your exam"
                    options={["Midterm 1", "Midterm 2", "Final"]}
                    value={exam}
                    setValue={setExam}
                />
                <SearchMultiSelect
                    label="Topics"
                    placeholder="Select topics"
                    options={TOPICS[class_] || []}
                    values={topics}
                    setValues={setTopics}
                />
                <button
                    onClick={() => updateQuestions(class_, exam, topics)}
                    className="text-center px-3 py-2 bg-uw/90 rounded-md font-medium text-white/90"
                >
                    Find questions
                </button>
            </div>

        </div>
    )
}